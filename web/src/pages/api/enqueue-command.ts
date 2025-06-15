import type { NextApiRequest, NextApiResponse } from 'next';
import { getCurrentUser } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from '@/utils/amplifyServer';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { v4 as uuidv4 } from 'uuid';

const sqsClient = new SQSClient({ region: process.env.AWS_REGION });

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

    const { type, command } = req.body;
    
    if (!type || !command) {
      return res.status(400).json({ error: 'Type and command are required' });
    }

    const message = {
      type,
      userId: user.userId,
      command,
      timestamp: new Date().toISOString()
    };

    const messageId = uuidv4();
    const messageGroupId = `${user.userId}-${type}`;

    const sqsCommand = new SendMessageCommand({
      QueueUrl: process.env.SQS_QUEUE_URL,
      MessageBody: JSON.stringify(message),
      MessageGroupId: messageGroupId,
      MessageDeduplicationId: messageId
    });

    await sqsClient.send(sqsCommand);
    return res.status(200).json({ message: 'Command enqueued successfully' });
  } catch (error) {
    console.error('Error enqueueing command:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 