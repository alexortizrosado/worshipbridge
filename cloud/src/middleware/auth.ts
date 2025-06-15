import { Request, Response, NextFunction } from 'express';
import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { logger } from '../utils/logger';

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;
        email: string;
        username: string;
      };
    }
  }
}

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const command = new GetUserCommand({
      AccessToken: token
    });

    const response = await cognitoClient.send(command);
    
    req.user = {
      sub: response.UserAttributes?.find(attr => attr.Name === 'sub')?.Value || '',
      email: response.UserAttributes?.find(attr => attr.Name === 'email')?.Value || '',
      username: response.Username || ''
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
} 