import type { Request, Response } from 'express';
import { processChatRequest } from '../../src/server/geminiService.js';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, petContext } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message string is required' });
    }

    const result = await processChatRequest(message, petContext);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('Vercel serverless chat error:', err);
    return res.status(500).json({ error: 'Internal chat serverless error' });
  }
}
