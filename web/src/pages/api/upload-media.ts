import type { NextApiRequest, NextApiResponse } from 'next';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplifyServer';

export const config = {
  api: {
    bodyParser: false
  }
};

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

    // TODO: Implement media upload logic
    return res.status(200).json({ message: 'Media uploaded successfully' });
  } catch (error) {
    console.error('Error uploading media:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 