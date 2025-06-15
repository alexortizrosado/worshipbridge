# Testing WorshipBridge Locally

This guide walks you through testing the WorshipBridge stack locally, including building the Bridge App, starting Docker services, and configuring the Bridge App to connect to the Docker containers.

## Prerequisites

- Node.js (v18 or later)
- Docker and Docker Compose
- ProPresenter installed and running locally

## Step 1: Build and Run the Bridge App

1. Navigate to the `bridge` directory:
   ```sh
   cd bridge
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Build the Bridge App:
   ```sh
   npm run build
   ```

4. Start the Bridge App:
   ```sh
   npm start
   ```

   The Bridge App will:
   - Start and appear in your system tray
   - Show a tray icon that you can click to show/hide the main window
   - Right-click the tray icon to access the menu with options:
     - Show Dashboard
     - Check for Updates
     - Settings
     - Quit

## Step 2: Start Docker Services

1. Navigate to the root directory of the project:
   ```sh
   cd ..
   ```

2. Start the Docker services using Docker Compose:
   ```sh
   docker-compose up
   ```

   This will start the following services:
   - **Web App** (Next.js) on `http://localhost:3000`
   - **Cloud Service** on `http://localhost:4000`
   - **LocalStack** (SQS emulation) on `http://localhost:4566`

## Step 3: Configure the Bridge App

1. Open the Bridge App's configuration file:
   ```sh
   open bridge/src/config/index.ts
   ```

2. Ensure the configuration is set for development:
   ```typescript
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
   ```

3. Restart the Bridge App to apply the changes:
   - Click the tray icon to show the main window
   - Use the menu to quit the app
   - Start it again with `npm start`

## Step 4: Test the Connection

1. **Test the Web App**:
   - Open your browser and navigate to `http://localhost:3000`.
   - You should see the WorshipBridge web interface.

2. **Test the Cloud Service**:
   - Open your browser and navigate to `http://localhost:4000/health` (or a similar endpoint).
   - You should receive a successful response.

3. **Test the Bridge App**:
   - Check the Bridge App's logs in the main window to ensure it is successfully polling the SQS queue.
   - You should see logs indicating that it is connected to the queue and processing commands.
   - The tray icon should indicate a healthy connection status.

4. **Test Command Flow**:
   - Use the Web App to enqueue a command (e.g., create a playlist).
   - Check the Bridge App's logs to see if it receives and processes the command.
   - Verify that ProPresenter receives the command and executes it.

## Building an Installable Package

To create an installable package for the Bridge App:

1. For all platforms:
   ```sh
   npm run package
   ```

2. For macOS only:
   ```sh
   npm run package:mac
   ```

3. For Windows only:
   ```sh
   npm run package:win
   ```

The packaged applications will be created in the `bridge/dist` directory:
- macOS: `.dmg` and `.zip` files
- Windows: `.exe` installer

## Troubleshooting

- **Bridge App Not Connecting to SQS**:
  - Ensure LocalStack is running and the SQS queue is created.
  - Check the Bridge App's logs in the main window for connection errors.
  - Verify the configuration in `config/index.ts`.

- **Docker Services Not Starting**:
  - Check Docker logs for errors.
  - Ensure ports 3000, 4000, and 4566 are not already in use.

- **ProPresenter Not Receiving Commands**:
  - Ensure ProPresenter is running and the WebSocket connection is established.
  - Check the Bridge App's logs for WebSocket errors.

## Next Steps

- Once everything is working locally, you can proceed to deploy the stack to production.
- Refer to the `README.md` for deployment instructions.

---

Happy testing! Let me know if you encounter any issues or need further assistance. 