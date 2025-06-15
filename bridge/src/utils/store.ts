import Store from 'electron-store';

interface Settings {
  apiKey: string;
  userId: string;
  wsPort: string;
  autoStart: boolean;
}

const store = new Store<Settings>({
  defaults: {
    apiKey: '',
    userId: '',
    wsPort: '8080',
    autoStart: false
  }
});

export { store };
export type { Settings }; 