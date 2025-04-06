/**
 * 基本通信 API 介面
 */
export interface BaseApi {
  send: (channel: string, data?: any) => void;
  invoke: (channel: string, data?: any) => Promise<any>;
  on: (channel: string, callback: (data: any) => void) => () => void;
}

/**
 * 窗口控制 API 介面
 */
export interface WindowApi {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
}

/**
 * 環境變數 API 介面
 */
export interface EnvironmentApi {
  get: (key: string) => Promise<string>;
}

/**
 * 更新相關 API 介面
 */
export interface UpdatesApi {
  checkForUpdates: () => Promise<void>;
  downloadUpdate: () => Promise<void>;
}

/**
 * 用戶偏好設置 API 介面
 */
export interface PreferencesApi {
  get: <T>(key: string, defaultValue?: T) => Promise<T>;
  set: <T>(key: string, value: T) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

/**
 * 完整的 IPC API 介面
 */
export interface IpcApi extends BaseApi {
  window: WindowApi;
  environment: EnvironmentApi;
  updates: UpdatesApi;
  preferences: PreferencesApi;
} 