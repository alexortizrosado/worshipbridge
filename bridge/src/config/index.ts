const isProduction = process.env.NODE_ENV === 'production';

export const config = {
  sqs: {
    region: process.env.AWS_REGION || 'us-east-1',
    queueUrl: isProduction
      ? process.env.SQS_QUEUE_URL
      : 'http://localhost:4566/000000000000/worshipbridge-commands.fifo',
  },
  api: {
    url: isProduction
      ? process.env.API_URL
      : 'http://localhost:4000',
  },
}; 