"""FastAPI backend for Synapse Council."""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
import asyncio
import json
from fastapi.responses import StreamingResponse

from . import storage
from .council import (
    run_full_council,
    stage1_collect_responses,
    stage2_collect_rankings,
    stage3_synthesize_final,
    parse_ranking_from_text
)


app = FastAPI(title="Synapse Council API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SendMessage(BaseModel):
    content: str

@app.post("/api/conversations/stream")
async def send_message_stream(cid: str, req: SendMessage):
    convo = storage.get_conversation(cid)
    if not convo:
        raise HTTPException(404)

    storage.add_user_message(cid, req.content)

    async def event_generator():
        try:
            # Stage 1
            yield f"data: {json.dumps({'type': 'stage1_start'})}\n\n"
            s1, s1_nodes = await stage1_collect_responses(req.content)
            if not s1:
                 yield f"data: {json.dumps({'type': 'error', 'message': 'No responses from Stage 1'})}\n\n"
                 return
            yield f"data: {json.dumps({'type': 'stage1_complete', 'data': s1})}\n\n"

            # Stage 2
            yield f"data: {json.dumps({'type': 'stage2_start'})}\n\n"
            s2, map_, s2_nodes = await stage2_collect_rankings(req.content, s1)
            yield f"data: {json.dumps({'type': 'stage2_complete', 'data': s2, 'metadata': {'label_to_model': map_}})}\n\n"

            # Stage 3
            yield f"data: {json.dumps({'type': 'stage3_start'})}\n\n"
            s3, s3_nodes = await stage3_synthesize_final(req.content, s1, s2)
            yield f"data: {json.dumps({'type': 'stage3_complete', 'data': s3})}\n\n"

            # Build VRT
            vrt = {
                "question": req.content,
                "models_used": list(set([n["model"] for n in s1_nodes + s2_nodes + s3_nodes])),
                "nodes": s1_nodes + s2_nodes + s3_nodes,
                "edges": []
            }
            
            # Create edges
            for r_node in s2_nodes:
                for p_id in r_node.get("parent_ids", []):
                    vrt["edges"].append({"from": p_id, "to": r_node["id"], "relation": "critiques"})
            
            for s_node in s3_nodes:
                for p_id in s_node.get("parent_ids", []):
                    vrt["edges"].append({"from": p_id, "to": s_node["id"], "relation": "informs"})
            
            # Add matrices
            try:
                from sklearn.feature_extraction.text import TfidfVectorizer
                from sklearn.metrics.pairwise import cosine_similarity
                
                texts = [r["response"] for r in s1]
                if len(texts) > 1:
                    vec = TfidfVectorizer()
                    tfidf = vec.fit_transform(texts)
                    sim_matrix = cosine_similarity(tfidf)
                    contra_matrix = 1 - sim_matrix
                    
                    vrt["similarity_matrix"] = sim_matrix.tolist()
                    vrt["contradiction_matrix"] = contra_matrix.tolist()
                    consensus_scores = sim_matrix.mean(axis=1).tolist()
                    vrt["consensus_scores"] = {r["model"]: s for r, s in zip(s1, consensus_scores)}
            except Exception as e:
                print(f"Matrix computation error: {e}")

            # Save to storage with VRT
            storage.add_assistant_message(cid, s1, s2, s3, vrt)
            
            yield f"data: {json.dumps({'type': 'vrt_complete', 'vrt': vrt})}\n\n"
            yield f"data: {json.dumps({'type': 'complete'})}\n\n"

        except Exception as e:
            print(f"Streaming error: {e}")
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.post("/api/conversations")
async def create_conversation():
    cid = str(uuid.uuid4())
    return storage.create_conversation(cid)


@app.get("/api/conversations")
async def list_conversations():
    return storage.list_conversations()


@app.get("/api/conversations/{cid}")
async def get_conversation(cid: str):
    data = storage.get_conversation(cid)
    if not data:
        raise HTTPException(404)
    return data


class UpdateConversation(BaseModel):
    title: str

@app.patch("/api/conversations/{cid}")
async def update_conversation(cid: str, req: UpdateConversation):
    data = storage.update_conversation_title(cid, req.title)
    if not data:
        raise HTTPException(404)
    return data


@app.delete("/api/conversations/{cid}")
async def delete_conversation(cid: str):
    success = storage.delete_conversation(cid)
    if not success:
        raise HTTPException(404)
    return {"success": True}


@app.post("/api/conversations/{cid}/message")
async def send_message(cid: str, req: SendMessage):
    convo = storage.get_conversation(cid)
    if not convo:
        raise HTTPException(404)

    storage.add_user_message(cid, req.content)

    s1, s2, s3, meta, vrt = await run_full_council(req.content)

    storage.add_assistant_message(cid, s1, s2, s3, vrt)

    return {"stage1": s1, "stage2": s2, "stage3": s3, "metadata": meta, "vrt": vrt}


@app.get("/api/metrics")
async def get_metrics():
    try:
        with open("data/metrics.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []
