import Store from 'electron-store';

interface BridgeConfig {
  apiKey: string;
  userId: string;
  cloudApiUrl: string;
  propresenterPort: number;
  pollingInterval: number;
  autoStart: boolean;
}

const defaultConfig: BridgeConfig = {
  apiKey: '',
  userId: '',
  cloudApiUrl: 'https://api.worshipbridge.com',
  propresenterPort: 8080,
  pollingInterval: 5000,
  autoStart: false
};

const store = new Store<BridgeConfig>({
  name: 'worshipbridge-config',
  defaults: defaultConfig
});

export function getConfig(): BridgeConfig {
  return store.store;
}

export function saveConfig(config: Partial<BridgeConfig>) {
  store.store = {
    ...store.store,
    ...config
  };
}

export function resetConfig() {
  store.store = defaultConfig;
} 