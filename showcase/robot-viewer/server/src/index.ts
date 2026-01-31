import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import voiceRoutes from './routes/voice.js';
import partsRoutes from './routes/parts.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const demoMode = !process.env.ELEVENLABS_API_KEY || !process.env.GEMINI_API_KEY;

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

app.use('/api/voice', voiceRoutes);
app.use('/api/parts', partsRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), demoMode });
});

app.listen(PORT, () => {
  console.log(`\n  Robot Viewer Server running on http://localhost:${PORT}`);
  if (demoMode) {
    console.log('  ⚠ Running in DEMO MODE (missing API keys)');
    console.log('  Set ELEVENLABS_API_KEY and GEMINI_API_KEY in .env for full functionality\n');
  } else {
    console.log('  All API keys configured - full functionality enabled\n');
  }
});
