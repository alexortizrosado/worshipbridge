import { execSync } from 'child_process';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { logger } from '../src/utils/logger';

const s3Client = new S3Client({ region: process.env.AWS_REGION });

interface VersionInfo {
  version: string;
  files: {
    url: string;
    sha512: string;
    size: number;
  }[];
  releaseDate: string;
  releaseNotes: string;
}

async function buildAndUpload() {
  try {
    // Read package.json for version
    const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
    const version = packageJson.version;
    const platform = process.platform;

    logger.info(`Building version ${version} for ${platform}`);

    // Build the application
    execSync('npm run build', { stdio: 'inherit' });

    // Create version info
    const versionInfo: VersionInfo = {
      version,
      files: [],
      releaseDate: new Date().toISOString(),
      releaseNotes: `Release ${version}`
    };

    // Upload files and update version info
    const releaseDir = join(process.cwd(), 'release');
    const files = execSync('ls -1 release', { encoding: 'utf-8' }).split('\n').filter(Boolean);

    for (const file of files) {
      const filePath = join(releaseDir, file);
      const fileContent = readFileSync(filePath);
      const key = `updates/${platform}/${file}`;

      // Upload file
      await s3Client.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: fileContent,
        ContentType: 'application/octet-stream'
      }));

      // Add file info to version info
      versionInfo.files.push({
        url: `${process.env.UPDATE_SERVER_URL}/download/${platform}/${file}`,
        sha512: '', // TODO: Calculate SHA512
        size: fileContent.length
      });
    }

    // Upload version info
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `updates/${platform}/latest.json`,
      Body: JSON.stringify(versionInfo, null, 2),
      ContentType: 'application/json'
    }));

    logger.info('Build and upload completed successfully');
  } catch (error) {
    logger.error('Build and upload failed:', error);
    process.exit(1);
  }
}

buildAndUpload(); 