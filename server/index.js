import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDatabase } from './config/db.js';
import progressRoutes from './routes/progress.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'minimalist-math-backend',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/progress', progressRoutes);

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Startup failed';
    console.error(message);
    process.exit(1);
  }
};

startServer();
