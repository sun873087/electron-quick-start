interface ElectronAPI {
  preferences: {
    get: <T>(key: string, defaultValue?: T) => Promise<T>;
    set: <T>(key: string, value: T) => Promise<void>;
  };
  on: (channel: string, callback: (...args: any[]) => void) => () => void;
  window: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
  };
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {}; 