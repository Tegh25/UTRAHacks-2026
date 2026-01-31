import { Router, Request, Response } from 'express';
import { getAllParts, searchParts, getPartDetails, getRelatedParts } from '../services/partMapper.js';

const router = Router();

// GET /api/parts - Return all parts
router.get('/', (_req: Request, res: Response) => {
  res.json({ parts: getAllParts() });
});

// GET /api/parts/search?q=query - Search parts
router.get('/search', (req: Request, res: Response) => {
  const q = req.query.q as string;
  if (!q) {
    res.json({ parts: getAllParts() });
    return;
  }
  res.json({ parts: searchParts(q) });
});

// GET /api/parts/:id - Get part details with related parts
router.get('/:id', (req: Request, res: Response) => {
  const id = req.params.id as string;
  const part = getPartDetails(id);
  if (!part) {
    res.status(404).json({ error: 'Part not found' });
    return;
  }
  res.json({ part, relatedParts: getRelatedParts(id) });
});

export default router;
