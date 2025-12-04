"""OpenRouter API client."""

import os
import httpx
import asyncio
import json
import time
from typing import List, Dict, Any
from .config import OPENROUTER_API_KEY

METRICS_FILE = "data/metrics.json"

def log_metric(model: str, latency: float, success: bool, tokens: int = 0):
    entry = {
        "timestamp": time.time(),
        "model": model,
        "latency": latency,
        "success": success,
        "tokens": tokens
    }
    try:
        if not os.path.exists("data"):
            os.makedirs("data")
        
        data = []
        if os.path.exists(METRICS_FILE):
            with open(METRICS_FILE, "r") as f:
                try:
                    data = json.load(f)
                except json.JSONDecodeError:
                    pass
        
        data.append(entry)
        
        with open(METRICS_FILE, "w") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"Failed to log metric: {e}")


async def query_model(model: str, messages: List[Dict[str, str]]) -> Dict[str, Any]:
    """Query a single model via OpenRouter."""
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8000", 
    }
    data = {
        "model": model,
        "messages": messages,
    }

    start_time = time.time()
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, headers=headers, json=data, timeout=60.0)
            resp.raise_for_status()
            result = resp.json()
            
            latency = time.time() - start_time
            usage = result.get("usage", {})
            tokens = usage.get("total_tokens", 0)
            log_metric(model, latency, True, tokens)
            
            return result["choices"][0]["message"]
    except Exception as e:
        latency = time.time() - start_time
        log_metric(model, latency, False)
        print(f"[ERROR] Model {model} failed: {e}")
        return None


async def query_models_parallel(models: List[str], messages: List[Dict[str, str]]):
    import asyncio
    tasks = [query_model(m, messages) for m in models]
    responses = await asyncio.gather(*tasks)
    return {model: resp for model, resp in zip(models, responses)}
