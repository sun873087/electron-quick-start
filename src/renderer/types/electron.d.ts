/**
 * Electron 相關類型定義
 */

interface ElectronAPI {
  send: (channel: string, data?: any) => void;
  receive: (channel: string, callback: (...args: any[]) => void) => void;
  getEnv: (key: string) => Promise<string | null>;
  getAppInfo: () => Promise<{ name: string; version: string; description: string }>;
  getUserPreferences: () => Promise<{ locale: string; theme: string }>;
  isExperimentalEnabled: () => Promise<boolean>;
}

declare global {
  interface Window {
    electron?: ElectronAPI;
    process?: {
      type: string;
    };
  }
} 