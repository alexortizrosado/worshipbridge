import { S3Client } from '@aws-sdk/client-s3';
import { SQSClient } from '@aws-sdk/client-sqs';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { logger } from '../utils/logger';

interface CloudConfig {
  port: number;
  nodeEnv: string;
  s3: {
    client: S3Client;
    bucketName: string;
  };
  sqs: {
    client: SQSClient;
    queueUrl: string;
  };
  cognito: {
    client: CognitoIdentityProviderClient;
    userPoolId: string;
    clientId: string;
  };
  jwt: {
    secret: string;
  };
}

const isDevelopment = process.env.NODE_ENV === 'development';

// S3 Configuration
const s3Config = {
  region: process.env.AWS_REGION || 'us-east-1',
  ...(isDevelopment && {
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
      secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
    },
    forcePathStyle: true, // Required for MinIO
  }),
};

// SQS Configuration
const sqsConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  ...(isDevelopment && {
    endpoint: process.env.SQS_ENDPOINT,
    credentials: {
      accessKeyId: process.env.SQS_ACCESS_KEY || 'admin',
      secretAccessKey: process.env.SQS_SECRET_KEY || 'admin',
    },
  }),
};

// Cognito Configuration
const cognitoConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  ...(isDevelopment && {
    endpoint: process.env.COGNITO_ENDPOINT,
    credentials: {
      accessKeyId: process.env.COGNITO_ACCESS_KEY || 'admin',
      secretAccessKey: process.env.COGNITO_SECRET_KEY || 'admin',
    },
  }),
};

const config: CloudConfig = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  s3: {
    client: new S3Client(s3Config),
    bucketName: process.env.S3_BUCKET_NAME || 'worshipbridge-media',
  },
  sqs: {
    client: new SQSClient(sqsConfig),
    queueUrl: process.env.SQS_QUEUE_URL || 'worshipbridge-commands.fifo',
  },
  cognito: {
    client: new CognitoIdentityProviderClient(cognitoConfig),
    userPoolId: process.env.COGNITO_USER_POOL_ID || '',
    clientId: process.env.COGNITO_CLIENT_ID || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-jwt-secret-key',
  },
};

// Log configuration in development
if (isDevelopment) {
  logger.info('Running in development mode with local services');
  logger.info('S3 Endpoint:', process.env.S3_ENDPOINT);
  logger.info('SQS Endpoint:', process.env.SQS_ENDPOINT);
  logger.info('Cognito Endpoint:', process.env.COGNITO_ENDPOINT);
}

export default config; 