import type { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(`${process.env.CLOUD_API_URL}/enqueue-command`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.headers.authorization}`
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      throw new Error('Failed to enqueue command');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error enqueueing command:', error);
    res.status(500).json({ error: 'Failed to enqueue command' });
  }
}); 