import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import { logger } from '../../utils/logger';
import { authenticateToken } from '../../middleware/auth';

const router = Router();

// AWS clients
const sqsClient = new SQSClient({ region: process.env.AWS_REGION });
const s3Client = new S3Client({ region: process.env.AWS_REGION });
const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

// Authentication routes
router.post('/auth/login', [
  body('username').isString().notEmpty(),
  body('password').isString().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    });

    const response = await cognitoClient.send(command);
    res.json({ token: response.AuthenticationResult?.IdToken });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Command routes
router.post('/commands', authenticateToken, [
  body('type').isString().notEmpty(),
  body('userId').isString().notEmpty(),
  body('command').isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, userId, command } = req.body;

    const message = {
      type,
      userId,
      command,
      timestamp: new Date().toISOString()
    };

    const command = new SendMessageCommand({
      QueueUrl: process.env.SQS_QUEUE_URL,
      MessageBody: JSON.stringify(message)
    });

    await sqsClient.send(command);
    res.json({ status: 'Command enqueued successfully' });
  } catch (error) {
    logger.error('Error enqueueing command:', error);
    res.status(500).json({ error: 'Failed to enqueue command' });
  }
});

router.get('/commands/status', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // TODO: Implement queue status check
    res.json({ status: 'Queue status endpoint not implemented' });
  } catch (error) {
    logger.error('Error checking queue status:', error);
    res.status(500).json({ error: 'Failed to check queue status' });
  }
});

// Media routes
router.post('/media', authenticateToken, async (req, res) => {
  try {
    if (!req.files || !req.files.media) {
      return res.status(400).json({ error: 'No media file provided' });
    }

    const file = req.files.media;
    const key = `${req.user?.sub}/${Date.now()}-${file.name}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: file.data,
      ContentType: file.mimetype
    });

    await s3Client.send(command);

    const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    res.json({ url });
  } catch (error) {
    logger.error('Error uploading media:', error);
    res.status(500).json({ error: 'Failed to upload media' });
  }
});

export const v1Router = router; 