# Voice-Controlled 3D Robot Viewer

Interactive 3D robot model viewer with voice commands and AI-powered part identification.

## Quick Start

### 1. Install dependencies

```bash
cd client && npm install
cd ../server && npm install
```

### 2. Configure API keys (optional)

```bash
cp .env.example server/.env
# Edit server/.env with your API keys
```

The app works in **demo mode** without API keys — voice/text queries use keyword matching instead of AI.

### 3. Run

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Open http://localhost:5173

## Features

- Interactive 3D robot with clickable parts
- Voice commands via ElevenLabs Speech-to-Text
- Natural language queries via Google Gemini
- Text search and category filtering
- Part highlighting with glow effects

## API Keys

| Service | Get key at |
|---------|-----------|
| ElevenLabs | https://elevenlabs.io → Profile → API Keys |
| Google Gemini | https://makersuite.google.com/app/apikey |

## Tech Stack

- React + Vite + TypeScript
- Three.js (@react-three/fiber + @react-three/drei)
- Express + Node.js
- Zustand (state) + Tailwind CSS (styling)
