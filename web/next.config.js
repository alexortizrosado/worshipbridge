/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      process.env.S3_BUCKET_NAME + '.s3.' + process.env.AWS_REGION + '.amazonaws.com'
    ],
  },
  env: {
    NEXT_PUBLIC_AWS_REGION: process.env.AWS_REGION,
    NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
    NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
    NEXT_PUBLIC_API_URL: process.env.API_URL,
  },
}

module.exports = nextConfig 