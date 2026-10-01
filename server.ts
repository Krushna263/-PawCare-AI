import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { 
  processChatRequest, 
  processPhotoObserveRequest, 
  getGeminiClient 
} from './src/server/geminiService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// AI Chat Route
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { message, petContext } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message string is required' });
    }

    const result = await processChatRequest(message, petContext);
    return res.json(result);
  } catch (err: any) {
    console.error('Server chat route error:', err);
    return res.status(500).json({ error: 'Internal chat processing error' });
  }
});

// Photo Observation Route
app.post('/api/gemini/photo-observe', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, petContext, prompt } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const result = await processPhotoObserveRequest(imageBase64, mimeType, petContext, prompt);
    return res.json(result);
  } catch (err: any) {
    console.error('Server photo observe route error:', err);
    return res.status(500).json({ error: 'Internal photo observation error' });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'PawCare AI API',
    aiEnabled: Boolean(getGeminiClient()),
    timestamp: new Date().toISOString(),
  });
});

// Mount Vite middleware in development or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Only bind port if running directly
  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🐾 PawCare server active on http://0.0.0.0:${PORT}`);
    });
  }
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
