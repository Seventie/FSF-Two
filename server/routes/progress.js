import { Router } from 'express';
import Progress from '../models/Progress.js';

const router = Router();

router.get('/:playerName', async (req, res) => {
  try {
    const playerName = String(req.params.playerName || '').trim();
    if (!playerName) {
      return res.status(400).json({ error: 'playerName is required.' });
    }

    const progress = await Progress.findOne({ playerName }).lean();
    if (!progress) {
      return res.json({ playerName, score: 0, updatedAt: null });
    }

    return res.json({
      playerName: progress.playerName,
      score: progress.score,
      updatedAt: progress.updatedAt ? progress.updatedAt.toISOString() : null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not fetch progress.';
    return res.status(500).json({ error: message });
  }
});

router.post('/', async (req, res) => {
  try {
    const playerName = String(req.body?.playerName || '').trim();
    const score = Number(req.body?.score);

    if (!playerName) {
      return res.status(400).json({ error: 'playerName is required.' });
    }

    if (!Number.isFinite(score) || score < 0) {
      return res.status(400).json({ error: 'score must be a non-negative number.' });
    }

    const updated = await Progress.findOneAndUpdate(
      { playerName: playerName.slice(0, 40) },
      { $set: { score: Math.floor(score) } },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );

    return res.json({
      playerName: updated.playerName,
      score: updated.score,
      updatedAt: updated.updatedAt ? updated.updatedAt.toISOString() : null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not save progress.';
    return res.status(500).json({ error: message });
  }
});

export default router;
