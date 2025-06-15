import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

export const config = {
  api: {
    bodyParser: false
  }
};

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filter: ({ mimetype }) => {
        return mimetype?.startsWith('image/') || mimetype?.startsWith('video/') || false;
      }
    });

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const file = files.media;
    if (!file || Array.isArray(file)) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Forward the file to the cloud backend
    const formData = new FormData();
    formData.append('media', file);

    const response = await fetch(`${process.env.CLOUD_API_URL}/upload-media`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${req.headers.authorization}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload media to cloud backend');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ error: 'Failed to upload media' });
  }
}); 