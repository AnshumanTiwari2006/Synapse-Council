from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_stream():
    print("Routes:")
    for route in app.routes:
        print(f"{route.path} {route.methods}")

    print("\nTesting /teststream")
    resp = client.post("/teststream")
    print(f"Status: {resp.status_code}")

    cid = "32ee4020-69c1-453c-b1c6-452a2cdfe46d"
    print(f"\nTesting /stream_endpoint?cid={cid} with body")
    response = client.post(f"/stream_endpoint?cid={cid}", json={"content": "Hello"})
    print(f"Status: {response.status_code}")
    print(f"Content: {response.text}")

if __name__ == "__main__":
    test_stream()
