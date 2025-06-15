import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    getSettings: () => ipcRenderer.invoke('get-settings'),
    saveSettings: (settings: any) => ipcRenderer.invoke('save-settings', settings),
    onConnectionStatus: (callback: (status: { connected: boolean }) => void) => {
      ipcRenderer.on('connection-status', (_event, status) => callback(status));
      return () => {
        ipcRenderer.removeAllListeners('connection-status');
      };
    }
  }
); 