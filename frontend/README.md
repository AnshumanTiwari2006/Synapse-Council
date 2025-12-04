# Synapse Council - Frontend

React-based frontend for Synapse Council, a multi-agent AI consultation system.

## Tech Stack

- **React** 18.2.0 - UI framework
- **Vite** 7.2.6 - Build tool & dev server
- **TailwindCSS** 3.4.0 - Styling
- **Framer Motion** 10.18.0 - Animations
- **ReactFlow** 11.10.4 - Visual Reasoning Tree visualization
- **React Markdown** 8.0.7 - Markdown rendering

## Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
src/
├── components/        # React components
│   ├── ChatWindow.jsx
│   ├── MessageBubble.jsx
│   ├── Sidebar.jsx
│   ├── Stage1.jsx
│   ├── Stage2.jsx
│   ├── Stage3.jsx
│   ├── VRTPanel.jsx
│   └── HeatmapModal.jsx
├── utils/            # Utility functions
│   ├── apiClient.js  # API communication
│   └── cn.js         # Class name utility
├── styles/           # Global styles
│   └── theme.css
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

## Features

- 🎨 Modern dark theme UI
- 💬 ChatGPT-style interface
- 🌳 Visual Reasoning Tree visualization
- 📊 Consensus heatmaps
- 🔄 Real-time streaming responses
- 📱 Responsive design

## API Configuration

The frontend connects to the backend API at `http://localhost:8000/api` by default. This is configured in `vite.config.js` as a proxy.

To change the backend URL, update `frontend/src/utils/apiClient.js`.

## Learn More

See the main [README.md](../README.md) in the project root for complete documentation.
