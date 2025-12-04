import asyncio
import httpx
import json
import time

API_URL = "http://localhost:8008/api/conversations"

async def run_benchmark():
    async with httpx.AsyncClient(timeout=120.0) as client:
        # 1. Create Conversation
        resp = await client.post(API_URL)
        cid = resp.json()["id"]
        print(f"Created conversation: {cid}")
        
        # 2. Send Message (Math/Reasoning - should trigger Scientist/Strategist)
        query = "Calculate the impact of quantum computing on cryptography and explain why it matters."
        print(f"\nSending query: {query}")
        start = time.time()
        resp = await client.post(f"{API_URL}/{cid}/message", json={"content": query})
        duration = time.time() - start
        
        if resp.status_code != 200:
            print(f"Error: {resp.text}")
            return
            
        data = resp.json()
        print(f"Response received in {duration:.2f}s")
        
        # 3. Verify VRT
        vrt = data.get("vrt")
        if vrt:
            print("\n[PASS] VRT object present")
            print(f"Nodes: {len(vrt['nodes'])}")
            print(f"Edges: {len(vrt['edges'])}")
            print(f"Models used: {vrt['models_used']}")
            
            # Check for matrices
            if "similarity_matrix" in vrt:
                print("[PASS] Similarity matrix present")
            else:
                print("[FAIL] Similarity matrix missing")
                
            if "contradiction_matrix" in vrt:
                print("[PASS] Contradiction matrix present")
            else:
                print("[FAIL] Contradiction matrix missing")
        else:
            print("\n[FAIL] VRT object missing")
            
        # 4. Verify Metrics
        resp = await client.get("http://localhost:8008/api/metrics")
        metrics = resp.json()
        if metrics:
            print(f"\n[PASS] Metrics logged: {len(metrics)} entries")
            print(f"Latest metric: {metrics[-1]}")
        else:
            print("\n[FAIL] No metrics found")

if __name__ == "__main__":
    asyncio.run(run_benchmark())
