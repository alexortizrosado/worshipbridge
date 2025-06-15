import { app, BrowserWindow, Tray, Menu, dialog, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import { logger } from './utils/logger';
import { startServer } from './server';
import { store } from './utils/store';

// Extend the App interface to include isQuitting
declare global {
  namespace Electron {
    interface App {
      isQuitting: boolean;
    }
  }
}

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let server: any = null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  // Load the index.html of the app
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  // Hide window instead of closing
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
    return false;
  });
};

const createTray = () => {
  tray = new Tray(path.join(__dirname, '../assets/tray-icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Dashboard',
      click: () => {
        mainWindow?.show();
      },
    },
    {
      label: 'Check for Updates',
      click: () => {
        autoUpdater.checkForUpdates();
      },
    },
    {
      label: 'Settings',
      click: () => {
        mainWindow?.show();
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('WorshipBridge Bridge');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    mainWindow?.show();
  });
};

// IPC Handlers
ipcMain.handle('get-settings', async () => {
  return store.get('settings');
});

ipcMain.handle('save-settings', async (_event, settings) => {
  store.set('settings', settings);
  return true;
});

// Auto-updater events
autoUpdater.on('checking-for-update', () => {
  logger.info('Checking for updates...');
});

autoUpdater.on('update-available', (info) => {
  logger.info('Update available:', info);
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Available',
    message: 'A new version is available. It will be downloaded and installed automatically.',
    buttons: ['OK'],
  });
});

autoUpdater.on('update-not-available', () => {
  logger.info('No updates available');
});

autoUpdater.on('error', (err) => {
  logger.error('Error in auto-updater:', err);
  dialog.showErrorBox('Update Error', 'An error occurred while checking for updates.');
});

autoUpdater.on('download-progress', (progressObj) => {
  logger.info(`Download progress: ${progressObj.percent}%`);
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Ready',
    message: 'A new version has been downloaded. Restart the application to apply the updates.',
    buttons: ['Restart Now', 'Later'],
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

// This method will be called when Electron has finished initialization
app.whenReady().then(async () => {
  createWindow();
  createTray();

  // Start the bridge server
  try {
    server = await startServer();
    logger.info('Bridge server started successfully');
    mainWindow?.webContents.send('connection-status', { connected: true });
  } catch (error) {
    logger.error('Failed to start bridge server:', error);
    dialog.showErrorBox(
      'Server Error',
      'Failed to start the bridge server. Please check the logs for more information.'
    );
    mainWindow?.webContents.send('connection-status', { connected: false });
  }

  // Check for updates
  autoUpdater.checkForUpdates();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  app.isQuitting = true;
});

// Cleanup on quit
app.on('quit', () => {
  if (server) {
    server.close();
  }
  logger.info('Application quit');
}); 