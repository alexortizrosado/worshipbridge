import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator/check';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import { logger } from '../../utils/logger';
import { authenticateToken } from '../../middleware/auth';
import fileUpload from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';

// Extend Express Request type to include user and files
declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;
        email: string;
        username: string;
      };
      files?: fileUpload.FileArray | null;
    }
  }
}

const router = Router();

// AWS clients
const sqsClient = new SQSClient({ region: process.env.AWS_REGION });
const s3Client = new S3Client({ region: process.env.AWS_REGION });
const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

// Authentication routes
router.post('/auth/login', [
  check('username').isString().notEmpty(),
  check('password').isString().notEmpty()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const authCommand = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    });

    const response = await cognitoClient.send(authCommand);
    res.json({ token: response.AuthenticationResult?.IdToken });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Command routes
router.post('/commands', authenticateToken, [
  check('type').isString().notEmpty(),
  check('userId').isString().notEmpty(),
  check('command').isObject()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, userId, command: commandData } = req.body;

    const message = {
      type,
      userId,
      command: commandData,
      timestamp: new Date().toISOString()
    };

    const messageId = uuidv4();
    const messageGroupId = `${userId}-${type}`;

    const sqsCommand = new SendMessageCommand({
      QueueUrl: process.env.SQS_QUEUE_URL,
      MessageBody: JSON.stringify(message),
      MessageGroupId: messageGroupId,
      MessageDeduplicationId: messageId
    });

    await sqsClient.send(sqsCommand);
    res.json({ status: 'Command enqueued successfully' });
  } catch (error) {
    logger.error('Error enqueueing command:', error);
    res.status(500).json({ error: 'Failed to enqueue command' });
  }
});

router.get('/commands/status', authenticateToken, async (req: Request, res: Response) => {
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
router.post('/media', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.files || !req.files.media) {
      return res.status(400).json({ error: 'No media file provided' });
    }

    const file = req.files.media as fileUpload.UploadedFile;
    const key = `${req.user?.sub}/${Date.now()}-${file.name}`;

    const s3Command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: file.data,
      ContentType: file.mimetype
    });

    await s3Client.send(s3Command);

    const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    res.json({ url });
  } catch (error) {
    logger.error('Error uploading media:', error);
    res.status(500).json({ error: 'Failed to upload media' });
  }
});

export const v1Router = router; 