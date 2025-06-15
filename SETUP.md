# WorshipBridge Setup Guide

This guide will help you set up the WorshipBridge system for development and production use.

## Prerequisites

- Node.js 18+
- AWS Account
- ProPresenter 7
- macOS or Windows development environment

## Development Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/worshipbridge.git
cd worshipbridge

# Install root dependencies
npm install

# Install component dependencies
cd bridge && npm install
cd ../cloud && npm install
cd ../web && npm install
cd ../shared && npm install
cd ..
```

### 2. Environment Configuration

Create environment files for each component:

```bash
# Bridge
cp bridge/.env.example bridge/.env
# Edit bridge/.env with your configuration

# Cloud
cp cloud/.env.example cloud/.env
# Edit cloud/.env with your AWS credentials

# Web
cp web/.env.example web/.env
# Edit web/.env with your configuration
```

### 3. AWS Setup

1. Create an S3 bucket for media storage:
   ```bash
   aws s3api create-bucket \
     --bucket worshipbridge-media \
     --region us-east-1
   ```

2. Create an SQS queue for commands:
   ```bash
   aws sqs create-queue \
     --queue-name worshipbridge-commands \
     --region us-east-1
   ```

3. Create a Cognito User Pool:
   ```bash
   aws cognito-idp create-user-pool \
     --pool-name WorshipBridgeUsers \
     --policies '{
       "PasswordPolicy": {
         "MinimumLength": 8,
         "RequireUppercase": true,
         "RequireLowercase": true,
         "RequireNumbers": true,
         "RequireSymbols": true
       }
     }' \
     --schema '[
       {
         "Name": "email",
         "AttributeDataType": "String",
         "Required": true,
         "Mutable": true
       }
     ]'
   ```

### 4. Start Development Servers

Start all components:
```bash
npm run dev
```

Or start individual components:
```bash
# Bridge
cd bridge && npm run dev

# Cloud
cd cloud && npm run dev

# Web
cd web && npm run dev
```

## Production Setup

### 1. Build Components

Build all components:
```bash
npm run build
```

Or build individual components:
```bash
cd bridge && npm run build
cd ../cloud && npm run build
cd ../web && npm run build
```

### 2. Bridge Configuration

1. Launch the bridge application
2. Configure settings:
   - API Key
   - User ID
   - Cloud API URL
   - ProPresenter WebSocket Port
   - Polling Interval
   - Auto-start option

### 3. Cloud Backend Deployment

1. Build the Docker image:
   ```bash
   cd cloud
   npm run docker:build
   ```

2. Deploy to your hosting provider:
   ```bash
   # Example: Deploy to AWS ECS
   aws ecs create-service \
     --cluster worshipbridge \
     --service-name cloud \
     --task-definition worshipbridge-cloud \
     --desired-count 1
   ```

### 4. Web Dashboard Deployment

1. Build the Next.js application:
   ```bash
   cd web
   npm run build
   ```

2. Deploy to your hosting provider:
   ```bash
   # Example: Deploy to Vercel
   vercel --prod
   ```

## Shared Package

The shared package contains common code used across all components. It's installed as a local dependency in each component.

To use shared code in a component:

```typescript
import { 
  User, 
  Playlist, 
  Command,
  formatFileSize,
  createApiResponse,
  COMMAND_TYPES,
  ERROR_CODES
} from '@worshipbridge/shared';
```

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Clear the `dist` directories: `npm run clean`
   - Rebuild: `npm run build`

2. **Dependency Issues**
   - Clear node_modules: `rm -rf node_modules`
   - Reinstall dependencies in each component:
     ```bash
     cd bridge && npm install
     cd ../cloud && npm install
     cd ../web && npm install
     cd ../shared && npm install
     ```

3. **Environment Issues**
   - Verify all .env files are properly configured
   - Check AWS credentials
   - Verify ProPresenter is running

### Support

For additional help:
- Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Open an issue on GitHub
- Contact the development team 