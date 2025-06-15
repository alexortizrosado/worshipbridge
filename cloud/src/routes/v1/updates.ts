import { Router } from 'express';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { logger } from '../../utils/logger';
import { authenticateToken } from '../../middleware/auth';

const router = Router();
const s3Client = new S3Client({ region: process.env.AWS_REGION });

// Get latest version info
router.get('/latest', async (req, res) => {
  try {
    const platform = req.query.platform as string;
    if (!platform || !['darwin', 'win32'].includes(platform)) {
      return res.status(400).json({ error: 'Invalid platform' });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `updates/${platform}/latest.json`
    });

    const response = await s3Client.send(command);
    const versionInfo = JSON.parse(await response.Body?.transformToString() || '{}');

    res.json(versionInfo);
  } catch (error) {
    logger.error('Error fetching update info:', error);
    res.status(500).json({ error: 'Failed to fetch update information' });
  }
});

// Get update file
router.get('/download/:platform/:version', async (req, res) => {
  try {
    const { platform, version } = req.params;
    if (!platform || !version || !['darwin', 'win32'].includes(platform)) {
      return res.status(400).json({ error: 'Invalid platform or version' });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `updates/${platform}/${version}`
    });

    const response = await s3Client.send(command);
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=update-${version}`);
    
    // Stream the file
    response.Body?.pipe(res);
  } catch (error) {
    logger.error('Error downloading update:', error);
    res.status(500).json({ error: 'Failed to download update' });
  }
});

export const updatesRouter = router; 