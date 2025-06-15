import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { check, validationResult } from 'express-validator/check';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import { logger } from './utils/logger';
import { authenticateToken } from './middleware/auth';
import { v1Router } from './routes/v1';
import fileUpload from 'express-fileupload';

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

const app = express();
const port = process.env.PORT || 3000;

// AWS clients
const sqsClient = new SQSClient({ region: process.env.AWS_REGION });
const s3Client = new S3Client({ region: process.env.AWS_REGION });
const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(fileUpload());

// API Versioning
app.use('/v1', v1Router);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', version: '1.0.0' });
});

// Routes
app.post('/auth/login', [
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

app.post('/enqueue-command', authenticateToken, [
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

    const sqsCommand = new SendMessageCommand({
      QueueUrl: process.env.SQS_QUEUE_URL,
      MessageBody: JSON.stringify(message)
    });

    await sqsClient.send(sqsCommand);
    res.json({ status: 'Command enqueued successfully' });
  } catch (error) {
    logger.error('Error enqueueing command:', error);
    res.status(500).json({ error: 'Failed to enqueue command' });
  }
});

app.get('/queue-status', authenticateToken, async (req: Request, res: Response) => {
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

app.post('/upload-media', authenticateToken, async (req: Request, res: Response) => {
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

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
}); 