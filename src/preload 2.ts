// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

/**
 * Electron 預加載腳本
 * 在渲染進程和主進程之間提供安全的通信渠道
 */

// 定義 IPC API 類型
interface IpcApi {
  // 基本通信
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
    get: (key: string, defaultValue?: any) => Promise<any>;
    set: (key: string, value: any) => Promise<void>;
    resetToDefaults: () => Promise<void>;
  };
}

// 定義安全通道名稱
const validChannels = [
  // 基本通信通道
  'app:hello',
  'app:message',
  
  // 視窗控制通道
  'window:minimize',
  'window:maximize',
  'window:close',
  
  // 環境變數通道
  'env:get',
  
  // 更新相關通道
  'app:update-available',
  'app:update-downloaded',
  'app:update-error',
  'app:check-updates',
  'app:download-update',
  
  // 用戶偏好設置通道
  'preferences:get',
  'preferences:set',
  'preferences:reset',
  
  // 選單通道
  'menu:open-settings',
  'menu:check-updates'
];

// 暴露安全的 IPC API 給渲染進程
contextBridge.exposeInMainWorld('electron', {
  // 基本通信方法
  send: (channel: string, data?: any) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  
  invoke: (channel: string, data?: any) => {
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    }
    return Promise.reject(new Error(`無效的通道: ${channel}`));
  },
  
  on: (channel: string, callback: (data: any) => void) => {
    if (validChannels.includes(channel)) {
      // 將原始回調包裝為可移除的事件監聽器
      const subscription = (_event: Electron.IpcRendererEvent, ...args: any[]) => 
        callback(args.length > 1 ? args : args[0]);
      
      ipcRenderer.on(channel, subscription);
      
      // 返回一個清理函數來移除事件監聽器
      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    }
    return () => {}; // 返回空清理函數
  },
  
  // 視窗控制方法
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close')
  },
  
  // 環境變數方法
  environment: {
    get: (key: string) => ipcRenderer.invoke('env:get', key)
  },
  
  // 更新相關方法
  updates: {
    checkForUpdates: () => ipcRenderer.invoke('app:check-updates'),
    downloadUpdate: () => ipcRenderer.invoke('app:download-update')
  },
  
  // 用戶偏好設置方法
  preferences: {
    get: (key: string, defaultValue?: any) => 
      ipcRenderer.invoke('preferences:get', { key, defaultValue }),
    set: (key: string, value: any) => 
      ipcRenderer.invoke('preferences:set', { key, value }),
    resetToDefaults: () => 
      ipcRenderer.invoke('preferences:reset')
  }
} as IpcApi);
