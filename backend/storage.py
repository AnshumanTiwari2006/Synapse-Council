"""JSON storage for conversations."""

import json, os
from datetime import datetime
from pathlib import Path
from .config import DATA_DIR


def ensure_dir():
    Path(DATA_DIR).mkdir(parents=True, exist_ok=True)


def path_for(cid: str):
    return os.path.join(DATA_DIR, f"{cid}.json")


def create_conversation(cid):
    ensure_dir()
    convo = {"id": cid, "created_at": datetime.utcnow().isoformat(), "title": "Conversation", "messages": []}
    with open(path_for(cid), "w") as f:
        json.dump(convo, f, indent=2)
    return convo


def get_conversation(cid):
    p = path_for(cid)
    if not os.path.exists(p): return None
    with open(p) as f: return json.load(f)


def save(convo):
    with open(path_for(convo["id"]), "w") as f:
        json.dump(convo, f, indent=2)


def list_conversations():
    ensure_dir()
    out = []
    for fn in os.listdir(DATA_DIR):
        if fn.endswith(".json"):
            with open(os.path.join(DATA_DIR, fn)) as f:
                d = json.load(f)
                out.append({
                    "id": d["id"],
                    "created_at": d["created_at"],
                    "title": d["title"],
                    "message_count": len(d["messages"])
                })
    return sorted(out, key=lambda x: x["created_at"], reverse=True)


def add_user_message(cid, content):
    convo = get_conversation(cid)
    convo["messages"].append({"role": "user", "content": content})
    save(convo)


def add_assistant_message(cid, s1, s2, s3, vrt=None):
    convo = get_conversation(cid)
    msg = {
        "role": "assistant",
        "stage1": s1,
        "stage2": s2,
        "stage3": s3
    }
    if vrt:
        msg["vrt"] = vrt
    convo["messages"].append(msg)
    save(convo)


def update_conversation_title(cid, title):
    convo = get_conversation(cid)
    if convo:
        convo["title"] = title
        save(convo)
        return convo
    return None


def delete_conversation(cid):
    p = path_for(cid)
    if os.path.exists(p):
        os.remove(p)
        return True
    return False
