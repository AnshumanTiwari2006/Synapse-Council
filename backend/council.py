"""Three-stage orchestration for Synapse Council."""

from typing import List, Dict, Any, Tuple
import uuid
import asyncio
import math
from .openrouter import query_models_parallel, query_model
from .config import COUNCIL_MODELS, CHAIRMAN_MODEL, ROLE_ASSIGNMENTS, RANKER_MODELS, MODEL_REGISTRY


ROLES = {
    "scientist": (
        "You are a scientist trained to reason with precision. "
        "Use evidence-driven logic, avoid assumptions, verify claims, and explain your reasoning clearly."
    ),
    "critic": (
        "You are a critic tasked with identifying logical flaws, weak arguments, contradictions, "
        "and missing considerations. Be analytical and rigorous."
    ),
    "explainer": (
        "You are an explainer focused on simplicity and clarity. "
        "Break down the idea using intuitive language and accessible analogies."
    ),
    "strategist": (
        "You are a strategist who forms structured reasoning paths, evaluates trade-offs, "
        "and outlines high-level decision frameworks."
    ),
}


def select_models_for_query(query: str, k: int = 4) -> Dict[str, str]:
    """Dynamic Agent Pool Selector (Task E)."""
    # Simple heuristic to identify tags
    query_lower = query.lower()
    query_tags = []
    if "code" in query_lower or "python" in query_lower or "function" in query_lower:
        query_tags.append("code")
    if "math" in query_lower or "calculate" in query_lower:
        query_tags.append("math")
    if "why" in query_lower or "explain" in query_lower:
        query_tags.append("explanation")
    if "critique" in query_lower or "review" in query_lower:
        query_tags.append("critic")
    
    # If no specific tags, assume general
    if not query_tags:
        query_tags = ["general", "reasoning"]
        
    scored_models = []
    for m in MODEL_REGISTRY:
        # Score = (tag_match_weight * trust) / (cost * sqrt(latency))
        tag_match = sum(1 for t in m["tags"] if t in query_tags)
        weight = 1 + (tag_match * 0.5) # Boost for tag match
        
        score = (weight * m["trust"]) / (max(0.1, m["cost"]) * math.sqrt(max(0.1, m["latency"])))
        scored_models.append((score, m))
        
    # Sort by score desc
    scored_models.sort(key=lambda x: x[0], reverse=True)
    
    # Pick top k
    selected = [m["id"] for _, m in scored_models[:k]]
    
    # Map to roles (round-robin or best fit)
    # For simplicity, we map top 4 to the 4 roles in order
    role_keys = list(ROLES.keys())
    assignments = {}
    for i, role in enumerate(role_keys):
        if i < len(selected):
            assignments[role] = selected[i]
        else:
            # Fallback to default if not enough selected (shouldn't happen with k=4)
            assignments[role] = ROLE_ASSIGNMENTS[role]
            
    return assignments


def apply_role_prompt(query: str, role_key: str) -> str:
    return f"{ROLES[role_key]}\n\nUser Query:\n{query}"


def create_vrt_node(node_type: str, model: str, role: str, text: str, parent_ids: List[str] = None):
    return {
        "id": str(uuid.uuid4()),
        "type": node_type,
        "model": model,
        "role": role,
        "text": text,
        "parent_ids": parent_ids or []
    }


async def stage1_collect_responses(user_query: str):
    # Dynamic Agent Pool Selection
    assignments = select_models_for_query(user_query)
    
    # Query specific models for each role
    tasks = []
    role_keys = list(assignments.keys())
    
    for role in role_keys:
        model = assignments[role]
        prompt = apply_role_prompt(user_query, role)
        messages = [{"role": "user", "content": prompt}]
        tasks.append(query_model(model, messages))
    
    responses = await asyncio.gather(*tasks)
    
    output = []
    vrt_nodes = []
    
    for role, resp in zip(role_keys, responses):
        if resp is not None:
            text = resp.get("content", "")
            node = create_vrt_node("initial_answer", assignments[role], role, text)
            vrt_nodes.append(node)
            
            output.append({
                "model": assignments[role],
                "role": role,
                "response": text,
                "node_id": node["id"]
            })
    return output, vrt_nodes


async def stage2_collect_rankings(user_query: str, stage1_results: List[Dict[str, Any]]):
    labels = [chr(65 + i) for i in range(len(stage1_results))]
    label_to_model = {f"Response {L}": f"{r['role'].title()} ({r['model']})" for L, r in zip(labels, stage1_results)}
    label_to_node_id = {f"Response {L}": r["node_id"] for L, r in zip(labels, stage1_results)}

    block = "\n\n".join([f"Response {L} ({r['role'].title()}):\n{r['response']}" for L, r in zip(labels, stage1_results)])

    prompt = f"""
Evaluate the following responses to the user question.

User Question:
{user_query}

Responses:
{block}

Your Task:
1. Analyze each response based on its assigned role.
2. Provide strengths and weaknesses.
3. At the end, provide a final ranking:

Format:
FINAL RANKING:
1. Response X
2. Response Y
3. Response Z
"""

    # Ensemble Ranking: Query multiple ranker models
    messages = [{"role": "user", "content": prompt}]
    results = await query_models_parallel(RANKER_MODELS, messages)
    
    final_rankings = []
    vrt_nodes = []
    
    # Collect all rankings
    for model, resp in results.items():
        if resp:
            text = resp.get("content", "")
            parsed = parse_ranking_from_text(text)
            
            # Create a critique/ranking node
            node = create_vrt_node("ranking", model, "ranker", text, parent_ids=[r["node_id"] for r in stage1_results])
            vrt_nodes.append(node)
            
            final_rankings.append({
                "model": model,
                "ranking": text,
                "parsed_ranking": parsed,
                "node_id": node["id"]
            })

    # Aggregate rankings (Simple Borda Count or Average Position)
    # For now, we just pass the raw rankings to Stage 3, but we could compute a consensus score here.
    
    return final_rankings, label_to_model, vrt_nodes


async def stage3_synthesize_final(user_query: str, stage1: List, stage2: List):
    s1 = "\n\n".join([f"{r['role'].title()} ({r['model']}):\n{r['response']}" for r in stage1])
    s2 = "\n\n".join([f"Ranker ({r['model']}):\n{r['ranking']}" for r in stage2])

    prompt = f"""
Produce a synthesized final answer based on the council's analysis and ensemble rankings.

User Query:
{user_query}

STAGE 1 RESPONSES:
{s1}

STAGE 2 RANKINGS:
{s2}

Provide a clear, well-reasoned final synthesis.
"""

    messages = [{"role": "user", "content": prompt}]
    resp = await query_model(CHAIRMAN_MODEL, messages)

    if resp is None:
        return {"model": CHAIRMAN_MODEL, "response": "Unable to synthesize."}, []

    text = resp.get("content", "")
    
    # Parent IDs are all Stage 2 ranking nodes
    parent_ids = [r["node_id"] for r in stage2]
    node = create_vrt_node("synthesis", CHAIRMAN_MODEL, "chairman", text, parent_ids=parent_ids)
    
    return {"model": CHAIRMAN_MODEL, "response": text}, [node]


def parse_ranking_from_text(text: str):
    import re
    if "FINAL RANKING:" in text:
        part = text.split("FINAL RANKING:")[1]
        matches = re.findall(r"Response [A-Z]", part)
        return matches
    return re.findall(r"Response [A-Z]", text)


async def run_clcc_flow(user_query: str, stage1_results: List[Dict[str, Any]]):
    """Circular Critique Chain: Each model critiques the previous one."""
    if len(stage1_results) < 2:
        return []

    tasks = []
    nodes = []
    
    # Create a cycle: 0->1, 1->2, ..., N->0
    for i in range(len(stage1_results)):
        target = stage1_results[i]
        critic_idx = (i + 1) % len(stage1_results)
        critic_res = stage1_results[critic_idx]
        
        critic_model = critic_res["model"]
        critic_role = critic_res["role"]
        
        prompt = f"""
You are acting as the {critic_role}. Critique the following response from the {target['role']}.

User Query: {user_query}

Response to Critique:
{target['response']}

Provide a constructive critique focusing on logical gaps, accuracy, and alignment with the user's goal.
"""
        messages = [{"role": "user", "content": prompt}]
        tasks.append(query_model(critic_model, messages))

    responses = await asyncio.gather(*tasks)
    
    for i, resp in enumerate(responses):
        if resp:
            text = resp.get("content", "")
            target_node_id = stage1_results[i]["node_id"]
            critic_res = stage1_results[(i + 1) % len(stage1_results)]
            
            node = create_vrt_node("critique", critic_res["model"], critic_res["role"], text, parent_ids=[target_node_id])
            nodes.append(node)
            
    return nodes


async def run_full_council(user_query: str):
    # Initialize VRT
    vrt = {
        "question": user_query,
        "models_used": [],
        "nodes": [],
        "edges": []
    }
    
    # Stage 1
    s1, s1_nodes = await stage1_collect_responses(user_query)
    if not s1:
        return [], [], {"response": "No responses."}, {}, vrt

    vrt["nodes"].extend(s1_nodes)
    vrt["models_used"].extend([n["model"] for n in s1_nodes])

    # Compute Matrices (Task C)
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity
        
        texts = [r["response"] for r in s1]
        if len(texts) > 1:
            vec = TfidfVectorizer()
            tfidf = vec.fit_transform(texts)
            sim_matrix = cosine_similarity(tfidf)
            
            # Contradiction = 1 - Similarity
            contra_matrix = 1 - sim_matrix
            
            vrt["similarity_matrix"] = sim_matrix.tolist()
            vrt["contradiction_matrix"] = contra_matrix.tolist()
            
            # Simple consensus score: average similarity to others
            consensus_scores = sim_matrix.mean(axis=1).tolist()
            vrt["consensus_scores"] = {r["model"]: s for r, s in zip(s1, consensus_scores)}
    except ImportError:
        print("scikit-learn not installed, skipping matrices")
    except Exception as e:
        print(f"Matrix computation error: {e}")

    # Optional: Circular Critique Chain (CLCC) (Task D)
    # For now, we'll run it if explicitly requested or just as a demonstration step
    # Let's add a simple CLCC flow here
    clcc_nodes = await run_clcc_flow(user_query, s1)
    if clcc_nodes:
        vrt["nodes"].extend(clcc_nodes)
        # Add edges for CLCC
        for node in clcc_nodes:
             for p_id in node["parent_ids"]:
                vrt["edges"].append({
                    "from": p_id,
                    "to": node["id"],
                    "relation": "critiques"
                })

    # Stage 2
    s2, map_, s2_nodes = await stage2_collect_rankings(user_query, s1)
    vrt["nodes"].extend(s2_nodes)
    vrt["models_used"].extend([n["model"] for n in s2_nodes if n["model"] not in vrt["models_used"]])
    
    # Create edges from Stage 1 (or CLCC) to Stage 2
    # If CLCC ran, Stage 2 should ideally look at critiques too, but for now it looks at Stage 1
    for r_node in s2_nodes:
        for p_id in r_node["parent_ids"]:
            vrt["edges"].append({
                "from": p_id,
                "to": r_node["id"],
                "relation": "critiques"
            })

    # Stage 3
    final, s3_nodes = await stage3_synthesize_final(user_query, s1, s2)
    vrt["nodes"].extend(s3_nodes)
    
    # Create edges from Stage 2 to Stage 3
    for s_node in s3_nodes:
        for p_id in s_node["parent_ids"]:
            vrt["edges"].append({
                "from": p_id,
                "to": s_node["id"],
                "relation": "informs"
            })
            
    vrt["final_choice"] = final

    return s1, s2, final, {"label_to_model": map_}, vrt
