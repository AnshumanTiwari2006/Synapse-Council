# 🏛️ Synapse Council

A sophisticated multi-agent AI system that leverages multiple Large Language Models (LLMs) to provide comprehensive, well-reasoned responses through a three-stage deliberation process. The system features a modern ChatGPT-style interface with advanced visualization tools including Visual Reasoning Trees (VRT) and consensus heatmaps.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
  - [Stage 1: Initial Responses](#stage-1-initial-responses)
  - [Stage 2: Ensemble Ranking](#stage-2-ensemble-ranking)
  - [Stage 3: Final Synthesis](#stage-3-final-synthesis)
- [API Documentation](#api-documentation)
- [Frontend Components](#frontend-components)
- [Advanced Features](#advanced-features)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

LLM Council X is an advanced AI consultation system that simulates a council of expert AI agents, each with specialized roles (Scientist, Critic, Explainer, Strategist). The system orchestrates these agents through a sophisticated three-stage process to deliver high-quality, consensus-driven responses.

### Key Highlights

- **Multi-Agent Collaboration**: 4+ specialized AI agents working together
- **Three-Stage Deliberation**: Initial responses → Ensemble ranking → Final synthesis
- **Visual Reasoning Trees**: Interactive visualization of the decision-making process
- **Consensus Analysis**: Similarity and contradiction matrices with heatmap visualization
- **Real-time Streaming**: Server-Sent Events (SSE) for live response updates
- **Modern UI**: ChatGPT-inspired dark theme interface with smooth animations

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ Sidebar  │  │   Chat   │  │   VRT    │  │ Heatmap  │     │
│  │          │  │  Window  │  │  Panel   │  │  Modal   │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────────────────┘
                              ↕ HTTP/SSE
┌─────────────────────────────────────────────────────────────┐
│                    Backend (FastAPI)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Council Orchestration                   │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐      │   │
│  │  │Stage 1 │→ │Stage 2 │→ │Stage 3 │→ │  VRT   │      │   │
│  │  └────────┘  └────────┘  └────────┘  └────────┘      │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            OpenRouter API Integration                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                   OpenRouter (LLM Gateway)                  │
│  DeepSeek • Llama • Mistral • Qwen • Phi-3                  │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### Core Features
- ✅ **Multi-Agent Council**: 4 specialized AI roles (Scientist, Critic, Explainer, Strategist)
- ✅ **Three-Stage Processing**: Structured deliberation pipeline
- ✅ **Dynamic Agent Selection**: Automatic model selection based on query type
- ✅ **Ensemble Ranking**: Multiple rankers evaluate and rank responses
- ✅ **Circular Critique Chain (CLCC)**: Agents critique each other's responses
- ✅ **Visual Reasoning Tree**: Interactive graph visualization of reasoning flow
- ✅ **Consensus Heatmaps**: Similarity and contradiction matrices
- ✅ **Real-time Streaming**: Live updates as the council deliberates
- ✅ **Conversation Management**: Create, rename, delete, and persist conversations
- ✅ **Responsive Design**: Mobile-friendly interface

### Advanced Analytics
- 📊 **Similarity Matrix**: TF-IDF based cosine similarity between responses
- 📊 **Contradiction Matrix**: Inverse similarity showing disagreement
- 📊 **Consensus Scores**: Per-model agreement metrics
- 🌳 **VRT Visualization**: Node-edge graph with ReactFlow
- 🎨 **Interactive Heatmaps**: Color-coded consensus visualization

---

## 🛠️ Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.8+ | Backend runtime |
| **FastAPI** | Latest | Web framework & API server |
| **Uvicorn** | Latest | ASGI server |
| **httpx** | Latest | Async HTTP client for OpenRouter |
| **python-dotenv** | Latest | Environment variable management |
| **scikit-learn** | Latest | TF-IDF & similarity calculations |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI framework |
| **Vite** | 7.2.6 | Build tool & dev server |
| **TailwindCSS** | 3.4.0 | Utility-first CSS framework |
| **Framer Motion** | 10.18.0 | Animation library |
| **ReactFlow** | 11.10.4 | VRT graph visualization |
| **React Markdown** | 8.0.7 | Markdown rendering |
| **Lucide React** | 0.263.1 | Icon library |

### External Services
- **OpenRouter**: LLM API gateway providing access to multiple models

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js**: v16.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v7.0.0 or higher (comes with Node.js)
- **Python**: v3.8 or higher ([Download](https://www.python.org/downloads/))
- **pip**: Latest version (comes with Python)

### API Keys
- **OpenRouter API Key**: Sign up at [OpenRouter](https://openrouter.ai/) and get your API key

### System Requirements
- **OS**: Windows 10/11, macOS 10.15+, or Linux
- **RAM**: 4GB minimum (8GB recommended)
- **Disk Space**: 500MB for dependencies

---

## 🚀 Installation

### Clone the Repository

```bash
git clone <repository-url>
cd "LLM Council X"
```

---

## 🔧 Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Create Virtual Environment (Recommended)

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Python Dependencies

```bash
pip install -r requirements.txt
```

**Expected dependencies:**
```
fastapi
uvicorn
httpx
python-dotenv
scikit-learn
```

### Step 4: Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# backend/.env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

**To get your API key:**
1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up or log in
3. Navigate to API Keys section
4. Generate a new API key
5. Copy and paste it into the `.env` file

### Step 5: Verify Backend Configuration

Check `backend/config.py` to review model configurations:

```python
# Council Models (Stage 1 - Initial Responses)
COUNCIL_MODELS = [
    "deepseek/deepseek-chat",
    "deepseek/deepseek-r1",
    "qwen/qwen-2.5-7b-instruct",
    "meta-llama/llama-3.1-8b-instruct",
    "meta-llama/llama-3.1-70b-instruct",
    "mistralai/mistral-nemo",
    "mistralai/mistral-small",
]

# Role Assignments
ROLE_ASSIGNMENTS = {
    "scientist": "deepseek/deepseek-chat",
    "critic": "meta-llama/llama-3.1-70b-instruct",
    "explainer": "mistralai/mistral-nemo",
    "strategist": "qwen/qwen-2.5-7b-instruct",
}

# Ranker Models (Stage 2 - Ensemble Ranking)
RANKER_MODELS = [
    "mistralai/mistral-nemo",
    "meta-llama/llama-3.1-70b-instruct",
    "deepseek/deepseek-chat",
]

# Chairman Model (Stage 3 - Final Synthesis)
CHAIRMAN_MODEL = "mistralai/mistral-nemo"
```

**You can customize these models based on your needs and OpenRouter availability.**

### Step 6: Create Data Directory

```bash
mkdir -p data/conversations
```

This directory will store conversation history as JSON files.

---

## 🎨 Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd ../frontend
# Or from root: cd frontend
```

### Step 2: Install Node Dependencies

```bash
npm install
```

**This will install all dependencies from `package.json`:**
- React & React DOM
- Vite (build tool)
- TailwindCSS
- Framer Motion
- ReactFlow
- React Markdown
- Lucide React (icons)
- And all dev dependencies

### Step 3: Verify Frontend Configuration

Check `frontend/vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
```

**Note:** The frontend is configured to proxy API requests to `http://localhost:8000` (backend).

### Step 4: Review TailwindCSS Configuration

Check `frontend/tailwind.config.js`:

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## ⚙️ Configuration

### Backend Configuration Files

#### 1. `backend/config.py`
Central configuration file for all model settings.

**Key Configuration Options:**

```python
# Dynamic Agent Pool Registry (Task E)
MODEL_REGISTRY = [
    {
        "id": "deepseek/deepseek-chat",
        "tags": ["code", "reasoning", "science"],
        "cost": 1,
        "trust": 0.9,
        "latency": 1.0
    },
    # ... more models
]
```

**Parameters:**
- `id`: OpenRouter model identifier
- `tags`: Query-matching tags for dynamic selection
- `cost`: Relative cost weight (lower is cheaper)
- `trust`: Trust score 0-1 (higher is more reliable)
- `latency`: Expected response time weight

#### 2. `backend/.env`
Environment variables (never commit this file!).

```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
```

### Frontend Configuration Files

#### 1. `frontend/src/utils/apiClient.js`
API endpoint configuration.

```javascript
const API_BASE = 'http://localhost:8000/api';
```

**Change this if your backend runs on a different host/port.**

#### 2. `frontend/src/styles/theme.css`
Global theme variables.

```css
:root {
  --bg-primary: #212121;
  --bg-secondary: #2f2f2f;
  --accent: #14b8a6;
  --text-primary: #e5e5e5;
  /* ... more variables */
}
```

---

## 🏃 Running the Application

### Method 1: Run Both Servers Simultaneously (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
# Activate virtual environment first (if using)
uvicorn backend.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Method 2: Using Package Scripts

**Backend:**
```bash
cd backend
python -m uvicorn backend.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Expected Output

**Backend (Terminal 1):**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [xxxxx] using StatReload
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Frontend (Terminal 2):**
```
  VITE v7.2.6  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📁 Project Structure

```
LLM Council X/
│
├── backend/                      # FastAPI backend
│   ├── __init__.py              # Package initializer
│   ├── main.py                  # FastAPI app & routes
│   ├── council.py               # Three-stage orchestration logic
│   ├── config.py                # Model & system configuration
│   ├── openrouter.py            # OpenRouter API client
│   ├── storage.py               # Conversation persistence
│   ├── requirements.txt         # Python dependencies
│   ├── .env                     # Environment variables (create this)
│   ├── test_app.py              # Backend tests
│   └── tests/                   # Test directory
│       ├── test_council.py
│       └── test_openrouter.py
│
├── frontend/                     # React frontend
│   ├── public/                  # Static assets
│   │   └── vite.svg
│   ├── src/                     # Source code
│   │   ├── components/          # React components
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── ChatInterface.css
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── HeatmapModal.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── ModelTag.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Sidebar.css
│   │   │   ├── Stage1.jsx
│   │   │   ├── Stage1.css
│   │   │   ├── Stage2.jsx
│   │   │   ├── Stage2.css
│   │   │   ├── Stage3.jsx
│   │   │   ├── Stage3.css
│   │   │   └── VRTPanel.jsx
│   │   ├── utils/               # Utility functions
│   │   │   ├── apiClient.js     # API communication
│   │   │   └── cn.js            # Class name utility
│   │   ├── styles/              # Global styles
│   │   │   └── theme.css
│   │   ├── App.jsx              # Main app component
│   │   ├── App.css              # App styles
│   │   ├── index.css            # Global CSS
│   │   └── main.jsx             # React entry point
│   ├── index.html               # HTML template
│   ├── package.json             # Node dependencies
│   ├── package-lock.json        # Dependency lock file
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # TailwindCSS config
│   ├── postcss.config.js        # PostCSS config
│   ├── eslint.config.js         # ESLint config
│   └── .gitignore               # Git ignore rules
│
├── data/                         # Data storage
│   ├── conversations/           # Conversation JSON files
│   └── metrics.json             # System metrics (optional)
│
└── README.md                     # This file
```

---

## 🔄 How It Works

### Stage 1: Initial Responses

**Purpose:** Collect diverse perspectives from specialized AI agents.

**Process:**
1. **Dynamic Agent Selection**: System analyzes the query to select optimal models
   - Extracts tags from query (code, math, explanation, etc.)
   - Scores models based on tag match, trust, cost, and latency
   - Selects top 4 models for the 4 roles

2. **Role Assignment**: Each selected model is assigned a role:
   - **Scientist**: Evidence-driven, logical reasoning
   - **Critic**: Identifies flaws and contradictions
   - **Explainer**: Simplifies complex concepts
   - **Strategist**: Structured decision frameworks

3. **Parallel Querying**: All 4 agents respond simultaneously
   - Each receives a role-specific prompt
   - Responses are collected asynchronously
   - VRT nodes created for each response

**Code Reference:** `backend/council.py` → `stage1_collect_responses()`

**Example Query Flow:**
```
User: "Explain quantum entanglement"
↓
Tag Detection: ["explain", "science"]
↓
Model Selection: [deepseek-chat, llama-70b, mistral-nemo, qwen-7b]
↓
Role Prompts:
  - Scientist: "Use evidence-driven logic... Explain quantum entanglement"
  - Critic: "Identify logical flaws... Explain quantum entanglement"
  - Explainer: "Break down using analogies... Explain quantum entanglement"
  - Strategist: "Form structured reasoning... Explain quantum entanglement"
↓
4 Parallel API Calls to OpenRouter
↓
Stage 1 Complete: 4 diverse responses
```

### Stage 2: Ensemble Ranking

**Purpose:** Evaluate and rank Stage 1 responses through multiple rankers.

**Process:**
1. **Response Compilation**: All Stage 1 responses are labeled (A, B, C, D)

2. **Ranker Prompt Creation**:
   ```
   Evaluate the following responses to the user question.
   
   User Question: [original query]
   
   Responses:
   Response A (Scientist): [response text]
   Response B (Critic): [response text]
   Response C (Explainer): [response text]
   Response D (Strategist): [response text]
   
   Your Task:
   1. Analyze each response based on its assigned role
   2. Provide strengths and weaknesses
   3. Provide a final ranking
   ```

3. **Ensemble Ranking**: Multiple ranker models evaluate independently
   - Default rankers: Mistral Nemo, Llama 70B, DeepSeek Chat
   - Each ranker provides critique and ranking
   - Rankings are parsed and stored

4. **Consensus Analysis** (Optional):
   - TF-IDF vectorization of Stage 1 responses
   - Cosine similarity matrix calculation
   - Contradiction matrix (1 - similarity)
   - Per-model consensus scores

**Code Reference:** `backend/council.py` → `stage2_collect_rankings()`

**Example Ranking Output:**
```json
{
  "model": "mistralai/mistral-nemo",
  "ranking": "Analysis:\nResponse A (Scientist): Strong evidence-based...\n\nFINAL RANKING:\n1. Response A\n2. Response C\n3. Response B\n4. Response D",
  "parsed_ranking": ["Response A", "Response C", "Response B", "Response D"]
}
```

### Stage 3: Final Synthesis

**Purpose:** Create a comprehensive final answer based on all council input.

**Process:**
1. **Context Aggregation**: Combine all Stage 1 responses and Stage 2 rankings

2. **Chairman Prompt**:
   ```
   Produce a synthesized final answer based on the council's analysis.
   
   User Query: [original query]
   
   STAGE 1 RESPONSES:
   [All 4 responses with role labels]
   
   STAGE 2 RANKINGS:
   [All ranker evaluations]
   
   Provide a clear, well-reasoned final synthesis.
   ```

3. **Synthesis Generation**: Chairman model (Mistral Nemo) creates final answer
   - Considers all perspectives
   - Weighs rankings and critiques
   - Produces cohesive response

4. **VRT Completion**: Final node added to Visual Reasoning Tree

**Code Reference:** `backend/council.py` → `stage3_synthesize_final()`

### Visual Reasoning Tree (VRT)

**Structure:**
```javascript
{
  "question": "User's original query",
  "models_used": ["model-1", "model-2", ...],
  "nodes": [
    {
      "id": "uuid-1",
      "type": "initial_answer",
      "model": "deepseek/deepseek-chat",
      "role": "scientist",
      "text": "Response text...",
      "parent_ids": []
    },
    {
      "id": "uuid-2",
      "type": "ranking",
      "model": "mistralai/mistral-nemo",
      "role": "ranker",
      "text": "Ranking analysis...",
      "parent_ids": ["uuid-1", ...]
    },
    {
      "id": "uuid-3",
      "type": "synthesis",
      "model": "mistralai/mistral-nemo",
      "role": "chairman",
      "text": "Final synthesis...",
      "parent_ids": ["uuid-2", ...]
    }
  ],
  "edges": [
    {"from": "uuid-1", "to": "uuid-2", "relation": "critiques"},
    {"from": "uuid-2", "to": "uuid-3", "relation": "informs"}
  ],
  "similarity_matrix": [[1.0, 0.8, ...], ...],
  "contradiction_matrix": [[0.0, 0.2, ...], ...],
  "consensus_scores": {"model-1": 0.85, ...}
}
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Endpoints

#### 1. Create Conversation
```http
POST /api/conversations
```

**Response:**
```json
{
  "id": "uuid-string",
  "title": "New Conversation",
  "created_at": "2025-12-04T12:00:00",
  "messages": []
}
```

#### 2. List Conversations
```http
GET /api/conversations
```

**Response:**
```json
[
  {
    "id": "uuid-1",
    "title": "Conversation 1",
    "created_at": "2025-12-04T12:00:00",
    "messages": [...]
  },
  ...
]
```

#### 3. Get Conversation
```http
GET /api/conversations/{cid}
```

**Response:**
```json
{
  "id": "uuid-string",
  "title": "Conversation Title",
  "created_at": "2025-12-04T12:00:00",
  "messages": [
    {
      "role": "user",
      "content": "User message"
    },
    {
      "role": "assistant",
      "stage1": [...],
      "stage2": [...],
      "stage3": {...},
      "vrt": {...}
    }
  ]
}
```

#### 4. Update Conversation Title
```http
PATCH /api/conversations/{cid}
```

**Request Body:**
```json
{
  "title": "New Title"
}
```

#### 5. Delete Conversation
```http
DELETE /api/conversations/{cid}
```

**Response:**
```json
{
  "success": true
}
```

#### 6. Send Message (Streaming)
```http
POST /api/conversations/stream?cid={conversation_id}
```

**Request Body:**
```json
{
  "content": "Your question here"
}
```

**Response:** Server-Sent Events (SSE) stream

**Event Types:**
```javascript
// Stage 1 Start
data: {"type": "stage1_start"}

// Stage 1 Complete
data: {"type": "stage1_complete", "data": [...]}

// Stage 2 Start
data: {"type": "stage2_start"}

// Stage 2 Complete
data: {"type": "stage2_complete", "data": [...], "metadata": {...}}

// Stage 3 Start
data: {"type": "stage3_start"}

// Stage 3 Complete
data: {"type": "stage3_complete", "data": {...}}

// VRT Complete
data: {"type": "vrt_complete", "vrt": {...}}

// All Complete
data: {"type": "complete"}

// Error
data: {"type": "error", "message": "Error description"}
```

#### 7. Send Message (Non-Streaming)
```http
POST /api/conversations/{cid}/message
```

**Request Body:**
```json
{
  "content": "Your question here"
}
```

**Response:**
```json
{
  "stage1": [...],
  "stage2": [...],
  "stage3": {...},
  "metadata": {...},
  "vrt": {...}
}
```

#### 8. Get Metrics
```http
GET /api/metrics
```

**Response:**
```json
[
  {
    "timestamp": "2025-12-04T12:00:00",
    "query": "Example query",
    "latency": 5.2,
    "models_used": ["model-1", "model-2"]
  }
]
```

---

## 🎨 Frontend Components

### Component Hierarchy

```
App.jsx
├── Sidebar.jsx
│   └── Conversation items
├── ChatWindow.jsx
│   └── MessageBubble.jsx
│       ├── Stage1.jsx
│       ├── Stage2.jsx
│       └── Stage3.jsx
├── VRTPanel.jsx
│   └── ReactFlow graph
└── HeatmapModal.jsx
    └── Similarity matrix heatmap
```

### Key Components

#### 1. **App.jsx**
Main application component managing global state.

**State:**
- `conversations`: List of all conversations
- `currentId`: Active conversation ID
- `currentConv`: Full conversation data
- `isLoading`: Loading state
- `isVRTOpen`: VRT panel visibility
- `showMatrix`: Heatmap modal visibility
- `matrixData`: Similarity matrix data

**Key Functions:**
- `loadConversations()`: Fetch all conversations
- `loadConversation(id)`: Fetch specific conversation
- `handleNew()`: Create new conversation
- `handleRename(id, title)`: Rename conversation
- `handleDelete(id)`: Delete conversation
- `handleSendMessage(content)`: Send message with streaming
- `handleShowHeatmap(vrt)`: Open heatmap modal

#### 2. **Sidebar.jsx**
Conversation list and navigation.

**Features:**
- New conversation button
- Conversation list with titles
- Inline rename functionality
- Delete confirmation
- Active conversation highlighting

#### 3. **MessageBubble.jsx**
Displays individual messages (user or assistant).

**Props:**
- `message`: Message object
- `onShowHeatmap`: Callback for heatmap button

**Features:**
- User message styling
- Assistant message with 3 stages
- Loading states for each stage
- Heatmap button (if VRT available)
- Markdown rendering

#### 4. **Stage1.jsx**
Displays Stage 1 initial responses.

**Features:**
- 4 response cards (Scientist, Critic, Explainer, Strategist)
- Model tags
- Expandable/collapsible responses
- Loading skeletons

#### 5. **Stage2.jsx**
Displays Stage 2 ensemble rankings.

**Features:**
- Multiple ranker evaluations
- Parsed ranking display
- Score visualization
- Model labels

#### 6. **Stage3.jsx**
Displays Stage 3 final synthesis.

**Features:**
- Chairman's final answer
- Markdown rendering
- Model tag

#### 7. **VRTPanel.jsx**
Visual Reasoning Tree visualization.

**Features:**
- ReactFlow graph
- Node types: initial_answer, ranking, synthesis
- Edge types: critiques, informs
- Interactive zoom/pan
- Auto-layout (dagre)

#### 8. **HeatmapModal.jsx**
Consensus heatmap visualization.

**Features:**
- Color-coded similarity matrix
- Axis labels
- Gradient legend
- Responsive grid

---

## 🚀 Advanced Features

### 1. Dynamic Agent Pool Selection

**Location:** `backend/council.py` → `select_models_for_query()`

**How it works:**
1. Extracts tags from user query (code, math, explanation, etc.)
2. Scores each model in `MODEL_REGISTRY` based on:
   - Tag match weight
   - Trust score
   - Cost efficiency
   - Latency
3. Selects top 4 models
4. Assigns to roles (Scientist, Critic, Explainer, Strategist)

**Scoring Formula:**
```python
score = (weight * trust) / (cost * sqrt(latency))
```

**Example:**
```python
# Query: "Write a Python function to sort a list"
# Detected tags: ["code", "python"]
# 
# Model scores:
# deepseek/deepseek-chat: (1.5 * 0.9) / (1 * 1.0) = 1.35
# meta-llama/llama-3.1-70b-instruct: (1.0 * 0.95) / (2 * 1.22) = 0.39
# ...
# 
# Top 4 selected: [deepseek-chat, qwen-7b, mistral-nemo, llama-8b]
```

### 2. Circular Critique Chain (CLCC)

**Location:** `backend/council.py` → `run_clcc_flow()`

**How it works:**
1. After Stage 1, each agent critiques the next agent's response
2. Creates a circular critique pattern: 0→1, 1→2, 2→3, 3→0
3. Adds critique nodes to VRT
4. Provides additional perspective before ranking

**Example:**
```
Scientist → critiques → Critic's response
Critic → critiques → Explainer's response
Explainer → critiques → Strategist's response
Strategist → critiques → Scientist's response
```

### 3. Consensus Analysis

**Location:** `backend/council.py` → Matrix computation in `run_full_council()`

**Metrics:**

**a) Similarity Matrix:**
- TF-IDF vectorization of all Stage 1 responses
- Cosine similarity between vectors
- Values: 0 (completely different) to 1 (identical)

**b) Contradiction Matrix:**
- Inverse of similarity: `1 - similarity`
- Values: 0 (no contradiction) to 1 (complete contradiction)

**c) Consensus Scores:**
- Average similarity of each model to all others
- Higher score = more aligned with group consensus

**Example:**
```python
# 4 responses from Stage 1
texts = [response1, response2, response3, response4]

# TF-IDF
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(texts)

# Similarity
similarity = cosine_similarity(tfidf_matrix)
# [[1.0,  0.8,  0.6,  0.7],
#  [0.8,  1.0,  0.5,  0.6],
#  [0.6,  0.5,  1.0,  0.9],
#  [0.7,  0.6,  0.9,  1.0]]

# Consensus
consensus = similarity.mean(axis=1)
# [0.775, 0.725, 0.75, 0.8]
# Model 4 has highest consensus (0.8)
```

### 4. Real-time Streaming

**Backend:** Server-Sent Events (SSE)

**Location:** `backend/main.py` → `/api/conversations/stream`

**Implementation:**
```python
async def event_generator():
    # Stage 1
    yield f"data: {json.dumps({'type': 'stage1_start'})}\n\n"
    s1, s1_nodes = await stage1_collect_responses(query)
    yield f"data: {json.dumps({'type': 'stage1_complete', 'data': s1})}\n\n"
    
    # Stage 2
    yield f"data: {json.dumps({'type': 'stage2_start'})}\n\n"
    # ... etc
```

**Frontend:** EventSource API

**Location:** `frontend/src/utils/apiClient.js`

```javascript
export async function sendMessageStream(cid, content, onEvent) {
  const response = await fetch(`${API_BASE}/conversations/stream?cid=${cid}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));
        onEvent(data.type, data);
      }
    }
  }
}
```

### 5. Visual Reasoning Tree (VRT)

**Visualization:** ReactFlow library

**Location:** `frontend/src/components/VRTPanel.jsx`

**Node Types:**
- `initial_answer`: Stage 1 responses (blue)
- `ranking`: Stage 2 rankings (orange)
- `synthesis`: Stage 3 final answer (green)
- `critique`: CLCC critiques (purple)

**Edge Types:**
- `critiques`: From Stage 1 to Stage 2
- `informs`: From Stage 2 to Stage 3

**Layout:** Dagre auto-layout (hierarchical)

**Example VRT:**
```
[Scientist]  [Critic]  [Explainer]  [Strategist]
     ↓           ↓          ↓            ↓
     └───────────┴──────────┴────────────┘
                     ↓
              [Ranker 1]  [Ranker 2]  [Ranker 3]
                     ↓           ↓          ↓
                     └───────────┴──────────┘
                              ↓
                        [Chairman]
```

---

## 💻 Development

### Backend Development

#### Running Tests
```bash
cd backend
pytest
```

#### Code Structure
- `main.py`: FastAPI routes and SSE streaming
- `council.py`: Core orchestration logic
- `config.py`: Model and system configuration
- `openrouter.py`: API client for OpenRouter
- `storage.py`: Conversation persistence (JSON files)

#### Adding New Models
1. Add model to `COUNCIL_MODELS` in `config.py`
2. Add to `MODEL_REGISTRY` with tags, cost, trust, latency
3. Optionally update `ROLE_ASSIGNMENTS` or `RANKER_MODELS`

#### Debugging
```bash
# Enable debug logging
uvicorn backend.main:app --reload --port 8000 --log-level debug
```

### Frontend Development

#### Development Server
```bash
cd frontend
npm run dev
```

#### Build for Production
```bash
npm run build
```

#### Preview Production Build
```bash
npm run preview
```

#### Code Structure
- `App.jsx`: Main app logic and state management
- `components/`: Reusable React components
- `utils/apiClient.js`: API communication layer
- `styles/theme.css`: Global CSS variables

#### Adding New Components
1. Create component file in `src/components/`
2. Import in `App.jsx` or parent component
3. Add corresponding CSS file if needed

#### Styling Guidelines
- Use TailwindCSS utility classes
- Follow dark theme color scheme
- Use CSS variables from `theme.css`
- Maintain responsive design (mobile-first)

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Backend won't start

**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

---

#### 2. Frontend won't start

**Error:** `Cannot find module 'vite'`

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

#### 3. API connection failed

**Error:** `Failed to fetch` or `Network error`

**Checklist:**
- ✅ Backend is running on port 8000
- ✅ Frontend proxy is configured correctly in `vite.config.js`
- ✅ CORS is enabled in backend (already configured)
- ✅ No firewall blocking localhost connections

**Solution:**
```bash
# Check backend is running
curl http://localhost:8000/api/conversations

# Should return: []
```

---

#### 4. OpenRouter API errors

**Error:** `401 Unauthorized` or `Invalid API key`

**Solution:**
1. Check `.env` file exists in `backend/` directory
2. Verify API key is correct (no extra spaces)
3. Test API key directly:
```bash
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

#### 5. Streaming not working

**Symptoms:** Messages don't update in real-time

**Solution:**
1. Check browser console for errors
2. Verify SSE connection in Network tab
3. Ensure backend streaming endpoint is working:
```bash
curl -N http://localhost:8000/api/conversations/stream?cid=test \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"content":"test"}'
```

---

#### 6. VRT not displaying

**Symptoms:** "View Reasoning Tree" button doesn't show graph

**Checklist:**
- ✅ Message has `vrt` data
- ✅ ReactFlow is installed (`npm list reactflow`)
- ✅ No console errors

**Solution:**
```bash
cd frontend
npm install reactflow@11.10.4
```

---

#### 7. Heatmap not rendering

**Symptoms:** Heatmap button doesn't work or shows blank modal

**Checklist:**
- ✅ VRT has `similarity_matrix` field
- ✅ Matrix is not empty
- ✅ Labels are present

**Debug:**
```javascript
// In browser console
console.log(currentConv.messages[0].vrt.similarity_matrix);
```

---

#### 8. Conversation not saving

**Symptoms:** Conversations disappear after refresh

**Solution:**
1. Check `data/conversations/` directory exists
2. Verify write permissions
3. Check backend logs for storage errors

```bash
mkdir -p data/conversations
chmod 755 data/conversations
```

---

#### 9. Models not responding

**Symptoms:** Stage 1 returns empty responses

**Possible Causes:**
- Model is unavailable on OpenRouter
- Rate limiting
- API quota exceeded

**Solution:**
1. Check OpenRouter status page
2. Try different models in `config.py`
3. Check API usage dashboard

---

#### 10. Port already in use

**Error:** `Address already in use: 8000` or `5173`

**Solution:**

**Windows:**
```bash
# Find process using port
netstat -ano | findstr :8000
# Kill process
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Find and kill process
lsof -ti:8000 | xargs kill -9
```

---

### Debug Mode

#### Backend Debug Mode
```bash
# Enable verbose logging
export PYTHONPATH=.
python -m uvicorn backend.main:app --reload --log-level debug
```

#### Frontend Debug Mode
```javascript
// In browser console
localStorage.setItem('debug', 'true');
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style
- **Python**: Follow PEP 8
- **JavaScript**: Use ESLint configuration
- **React**: Functional components with hooks
- **CSS**: TailwindCSS utilities preferred

### Testing
- Write tests for new features
- Ensure all tests pass before submitting PR
- Test on multiple browsers (Chrome, Firefox, Safari)

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **OpenRouter** for providing unified LLM API access
- **FastAPI** for the excellent Python web framework
- **React** and **Vite** for modern frontend tooling
- **TailwindCSS** for utility-first styling
- **ReactFlow** for graph visualization
- All the open-source contributors who made this possible

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review troubleshooting section above

---

## 🗺️ Roadmap

### Planned Features
- [ ] User authentication and multi-user support
- [ ] Conversation export (PDF, Markdown)
- [ ] Custom model configuration UI
- [ ] Advanced metrics dashboard
- [ ] Voice input support
- [ ] Mobile app (React Native)
- [ ] Plugin system for custom agents
- [ ] Integration with local LLMs (Ollama)

---

## 📊 Performance

### Expected Latencies
- **Stage 1**: 3-8 seconds (4 parallel API calls)
- **Stage 2**: 5-10 seconds (3 parallel ranker calls)
- **Stage 3**: 2-5 seconds (1 synthesis call)
- **Total**: 10-23 seconds per query

### Optimization Tips
- Use faster models for time-critical applications
- Reduce number of rankers in Stage 2
- Disable CLCC if not needed
- Cache frequent queries (future feature)

---

## 🔐 Security

### Best Practices
- ✅ Never commit `.env` file
- ✅ Use environment variables for secrets
- ✅ Validate all user inputs
- ✅ Sanitize conversation data before storage
- ✅ Use HTTPS in production
- ✅ Implement rate limiting (future feature)

### Production Deployment
```bash
# Use production ASGI server
gunicorn backend.main:app -w 4 -k uvicorn.workers.UvicornWorker

# Build frontend for production
cd frontend
npm run build

# Serve with nginx or similar
```

---

**Built with ❤️ by the Synapse Council Team**

*Last Updated: December 4, 2025*
