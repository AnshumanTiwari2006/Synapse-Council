"""Configuration for the Synapse Council system."""

from dotenv import load_dotenv
from pathlib import Path
import os

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# Full list of free OpenRouter models (Pruned to working ones)
COUNCIL_MODELS = [
    "deepseek/deepseek-chat",
    "deepseek/deepseek-r1",
    "qwen/qwen-2.5-7b-instruct",
    "meta-llama/llama-3.1-8b-instruct",
    "meta-llama/llama-3.1-70b-instruct",
    "mistralai/mistral-nemo",
    "mistralai/mistral-small",
]

# Assign specific models to roles
ROLE_ASSIGNMENTS = {
    "scientist": "deepseek/deepseek-chat",
    "critic": "meta-llama/llama-3.1-70b-instruct",
    "explainer": "mistralai/mistral-nemo",
    "strategist": "qwen/qwen-2.5-7b-instruct",
}

# Models used for Ensemble Ranking (Stage 2)
RANKER_MODELS = [
    "mistralai/mistral-nemo",           # Chairman
    "meta-llama/llama-3.1-70b-instruct", # Critic
    "deepseek/deepseek-chat",           # Scientist
]

# Dynamic Agent Pool Registry (Task E)
MODEL_REGISTRY = [
    {"id": "deepseek/deepseek-chat", "tags": ["code", "reasoning", "science"], "cost": 1, "trust": 0.9, "latency": 1.0},
    {"id": "deepseek/deepseek-r1", "tags": ["reasoning", "math", "complex"], "cost": 1, "trust": 0.85, "latency": 1.2},
    {"id": "qwen/qwen-2.5-7b-instruct", "tags": ["general", "strategy", "creative"], "cost": 0.5, "trust": 0.8, "latency": 0.5},
    {"id": "meta-llama/llama-3.1-8b-instruct", "tags": ["general", "fast", "chat"], "cost": 0.5, "trust": 0.8, "latency": 0.4},
    {"id": "meta-llama/llama-3.1-70b-instruct", "tags": ["critic", "nuance", "writing"], "cost": 2, "trust": 0.95, "latency": 1.5},
    {"id": "mistralai/mistral-nemo", "tags": ["explanation", "summary", "chairman"], "cost": 1, "trust": 0.9, "latency": 0.8},
    {"id": "mistralai/mistral-small", "tags": ["fast", "efficient"], "cost": 0.3, "trust": 0.7, "latency": 0.3},
    {"id": "microsoft/phi-3-medium-instruct", "tags": ["reasoning", "math"], "cost": 0.8, "trust": 0.8, "latency": 0.7},
]

# Final synthesis model
CHAIRMAN_MODEL = "mistralai/mistral-nemo"

OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

DATA_DIR = "data/conversations"
