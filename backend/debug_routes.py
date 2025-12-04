from backend.main import app
import json

for route in app.routes:
    print(f"{route.path} {route.methods}")
