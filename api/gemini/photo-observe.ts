import type { Request, Response } from 'express';
import { processPhotoObserveRequest } from '../../src/server/geminiService.js';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { imageBase64, mimeType, petContext, prompt } = req.body || {};
    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const result = await processPhotoObserveRequest(imageBase64, mimeType, petContext, prompt);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('Vercel serverless photo observe error:', err);
    return res.status(500).json({ error: 'Internal photo observation serverless error' });
  }
}
