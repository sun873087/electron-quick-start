// 全局類型定義
interface Window {
  electron: {
    // 基本通信方法
    send: (channel: string, data?: any) => void;
    invoke: (channel: string, data?: any) => Promise<any>;
    on: (channel: string, callback: (data: any) => void) => () => void;
    
    // 視窗控制
    window: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    };
    
    // 環境變數
    environment: {
      get: (key: string) => Promise<string>;
    };
    
    // 更新相關
    updates: {
      checkForUpdates: () => Promise<void>;
      downloadUpdate: () => Promise<void>;
    };
    
    // 用戶偏好設置
    preferences: {
      get: <T>(key: string, defaultValue?: T) => Promise<T>;
      set: <T>(key: string, value: T) => Promise<void>;
      resetToDefaults: () => Promise<void>;
    };
  };
} 