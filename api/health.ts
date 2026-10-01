import type { Request, Response } from 'express';
import { getGeminiClient } from '../src/server/geminiService.js';

export default function handler(req: Request, res: Response) {
  return res.status(200).json({
    status: 'ok',
    service: 'PawCare AI API (Vercel Serverless)',
    aiEnabled: Boolean(getGeminiClient()),
    timestamp: new Date().toISOString(),
  });
}
