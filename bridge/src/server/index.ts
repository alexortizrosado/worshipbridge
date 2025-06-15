import WebSocket from 'ws';
import axios from 'axios';
import { getConfig } from '../config';
import { logger } from '../utils/logger';

let propresenterWs: WebSocket | null = null;
let pollingInterval: NodeJS.Timeout | null = null;

export async function startServer() {
  const config = getConfig();
  
  // Connect to ProPresenter WebSocket
  try {
    propresenterWs = new WebSocket(`ws://localhost:${config.propresenterPort}`);
    
    propresenterWs.on('open', () => {
      logger.info('Connected to ProPresenter WebSocket');
    });
    
    propresenterWs.on('message', (data) => {
      logger.debug('Received message from ProPresenter:', data.toString());
    });
    
    propresenterWs.on('error', (error) => {
      logger.error('ProPresenter WebSocket error:', error);
    });
    
    propresenterWs.on('close', () => {
      logger.info('Disconnected from ProPresenter WebSocket');
      // Attempt to reconnect after delay
      setTimeout(() => {
        if (propresenterWs?.readyState === WebSocket.CLOSED) {
          startServer();
        }
      }, 5000);
    });
  } catch (error) {
    logger.error('Failed to connect to ProPresenter:', error);
    throw error;
  }
  
  // Start polling for commands
  startPolling();
}

export async function stopServer() {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
  
  if (propresenterWs) {
    propresenterWs.close();
    propresenterWs = null;
  }
}

function startPolling() {
  const config = getConfig();
  
  pollingInterval = setInterval(async () => {
    try {
      const response = await axios.get(`${config.cloudApiUrl}/queue-status`, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`
        }
      });
      
      if (response.data.commands?.length > 0) {
        for (const command of response.data.commands) {
          await processCommand(command);
        }
      }
    } catch (error) {
      logger.error('Error polling for commands:', error);
    }
  }, config.pollingInterval || 5000);
}

async function processCommand(command: any) {
  if (!propresenterWs || propresenterWs.readyState !== WebSocket.OPEN) {
    throw new Error('ProPresenter WebSocket not connected');
  }
  
  switch (command.type) {
    case 'create_playlist':
      await createPlaylist(command);
      break;
    case 'add_slide':
      await addSlide(command);
      break;
    case 'add_media':
      await addMedia(command);
      break;
    case 'trigger_presentation':
      await triggerPresentation(command);
      break;
    default:
      logger.warn('Unknown command type:', command.type);
  }
}

async function createPlaylist(command: any) {
  // Send WebSocket message to ProPresenter to create playlist
  propresenterWs?.send(JSON.stringify({
    action: 'createPlaylist',
    name: command.playlistName
  }));
}

async function addSlide(command: any) {
  propresenterWs?.send(JSON.stringify({
    action: 'addSlide',
    playlist: command.playlistName,
    title: command.title,
    lines: command.lines,
    template: command.template
  }));
}

async function addMedia(command: any) {
  // Download media from S3
  const response = await axios.get(command.url, {
    responseType: 'arraybuffer'
  });
  
  // Save to local temp directory
  const tempPath = `/tmp/${command.filename}`;
  require('fs').writeFileSync(tempPath, response.data);
  
  // Add to ProPresenter
  propresenterWs?.send(JSON.stringify({
    action: 'addMedia',
    playlist: command.playlistName,
    path: tempPath
  }));
}

async function triggerPresentation(command: any) {
  propresenterWs?.send(JSON.stringify({
    action: 'triggerPresentation',
    playlist: command.playlistName
  }));
} 