/** Voice: audio→text (ElevenLabs), then match parts (Gemini). Text query and status. */
import { Router, Request, Response } from 'express';
import multer from 'multer';
import { transcribeAudio } from '../services/elevenlabs.js';
import { identifyParts } from '../services/gemini.js';
import { getPartById } from '../config/robotParts.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// POST /api/voice/process - Process audio recording
router.post('/process', upload.single('audio'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No audio file provided' });
      return;
    }

    const mimeType = req.file.mimetype || 'audio/webm';
    const transcription = await transcribeAudio(req.file.buffer, mimeType);
    const geminiResult = await identifyParts(transcription);
    const matchedParts = geminiResult.partIds
      .map((id) => getPartById(id))
      .filter(Boolean);

    res.json({
      transcription,
      matchedParts,
      confidence: geminiResult.confidence,
      reasoning: geminiResult.reasoning,
    });
  } catch (error) {
    console.error('[Voice Process Error]', error);
    res.status(500).json({ error: 'Failed to process voice command' });
  }
});

// POST /api/voice/query - Process text query
router.post('/query', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Query text is required' });
      return;
    }

    const geminiResult = await identifyParts(query);
    const matchedParts = geminiResult.partIds
      .map((id) => getPartById(id))
      .filter(Boolean);

    res.json({
      transcription: query,
      matchedParts,
      confidence: geminiResult.confidence,
      reasoning: geminiResult.reasoning,
    });
  } catch (error) {
    console.error('[Voice Query Error]', error);
    res.status(500).json({ error: 'Failed to process query' });
  }
});

// GET /api/voice/status - Check API configuration
router.get('/status', (_req: Request, res: Response) => {
  const elevenlabsConfigured = !!process.env.ELEVENLABS_API_KEY;
  const geminiConfigured = !!process.env.GEMINI_API_KEY;
  res.json({
    demoMode: !elevenlabsConfigured || !geminiConfigured,
    elevenlabsConfigured,
    geminiConfigured,
  });
});

export default router;
