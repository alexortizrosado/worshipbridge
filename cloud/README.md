# WorshipBridge Cloud Backend

The cloud backend for WorshipBridge, providing a secure API for remote ProPresenter control.

## Features

- User authentication with AWS Cognito
- Command queue management with AWS SQS
- Media storage with AWS S3
- RESTful API endpoints
- Docker support for local development

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- AWS Account (for production deployment)

## Development Setup

### Using Docker (Recommended)

1. Install Docker and Docker Compose if you haven't already:
   - [Docker Desktop](https://www.docker.com/products/docker-desktop)
   - Docker Compose comes included with Docker Desktop

2. Clone the repository and navigate to the cloud directory:
   ```bash
   cd cloud
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development environment:
   ```bash
   npm run docker:run
   ```

   This will start:
   - The Express.js API server
   - MinIO (S3-compatible storage)
   - RabbitMQ (message queue)

5. Access the services:
   - API: http://localhost:3000
   - MinIO Console: http://localhost:9001
     - Username: minioadmin
     - Password: minioadmin
   - RabbitMQ Management: http://localhost:15672
     - Username: admin
     - Password: admin

6. Available Docker commands:
   ```bash
   npm run docker:build  # Build the Docker image
   npm run docker:run    # Start all services
   npm run docker:stop   # Stop all services
   npm run docker:clean  # Stop services and remove volumes
   ```

### Manual Setup (Without Docker)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```env
   NODE_ENV=development
   PORT=3000
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=worshipbridge-media
   SQS_QUEUE_URL=worshipbridge-commands
   JWT_SECRET=your-jwt-secret-key
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /v1/auth/login` - User login

### Commands
- `POST /v1/commands` - Send a command to ProPresenter
- `GET /v1/commands/status` - Check command queue status

### Media
- `POST /v1/media` - Upload media files

## Development Guidelines

### Code Structure
```
src/
├── config/         # Configuration management
├── middleware/     # Express middleware
├── routes/         # API routes
│   └── v1/        # Version 1 API endpoints
├── services/       # Business logic
├── utils/          # Utility functions
└── index.ts        # Application entry point
```

### Adding New Features
1. Create new route handlers in `src/routes/v1/`
2. Add business logic in `src/services/`
3. Update tests in `__tests__/`
4. Update API documentation

### Testing
```bash
npm test           # Run all tests
npm test:watch    # Run tests in watch mode
```

## Deployment

### AWS Setup
1. Create an S3 bucket for media storage
2. Set up an SQS queue for commands
3. Configure Cognito User Pool
4. Set up environment variables in your deployment platform

### Environment Variables
Required environment variables for production:
```env
NODE_ENV=production
PORT=3000
AWS_REGION=us-east-1
S3_BUCKET_NAME=worshipbridge-media
SQS_QUEUE_URL=worshipbridge-commands
COGNITO_USER_POOL_ID=your-user-pool-id
COGNITO_CLIENT_ID=your-client-id
JWT_SECRET=your-secure-jwt-secret
```

## Security

- All API endpoints (except login) require JWT authentication
- Media uploads are validated and sanitized
- Commands are validated before being queued
- Environment variables are used for sensitive configuration
- CORS is configured to allow only trusted origins
- Helmet.js is used for security headers

## Troubleshooting

### Common Issues

1. **Docker services not starting**
   - Check if ports 3000, 9000, 9001, 5672, and 15672 are available
   - Run `docker-compose logs` to see service logs

2. **MinIO connection issues**
   - Verify MinIO is running: http://localhost:9001
   - Check if the bucket exists in MinIO console
   - Verify S3 credentials in environment variables

3. **RabbitMQ connection issues**
   - Check RabbitMQ management console: http://localhost:15672
   - Verify queue exists and is properly configured
   - Check connection URL in environment variables

### Logs
- Application logs are available in the Docker container:
  ```bash
  docker-compose logs api
  ```
- MinIO logs:
  ```bash
  docker-compose logs minio
  ```
- RabbitMQ logs:
  ```bash
  docker-compose logs rabbitmq
  ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 