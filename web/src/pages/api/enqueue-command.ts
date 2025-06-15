import type { NextApiRequest, NextApiResponse } from 'next';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplifyServer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication using AWS Cognito
    const user = await runWithAmplifyServerContext({
      nextServerContext: { request: req, response: res },
      operation: (contextSpec) => getCurrentUser(contextSpec)
    });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { command } = req.body;
    
    if (!command) {
      return res.status(400).json({ error: 'Command is required' });
    }

    // TODO: Implement command enqueuing logic
    return res.status(200).json({ message: 'Command enqueued successfully' });
  } catch (error) {
    console.error('Error enqueueing command:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 