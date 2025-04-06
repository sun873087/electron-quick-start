import { ipcRenderer } from 'electron';
import { validChannels } from '../channels';
import { BaseApi } from '../types';

/**
 * 創建並返回基本通信 API
 * 采用介面隔離原則，只提供必要的方法
 */
export function createBaseApi(): BaseApi {
  return {
    /**
     * 發送訊息到主進程
     * @param channel 通道名稱
     * @param data 要發送的數據
     */
    send: (channel: string, data?: any) => {
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      } else {
        console.warn(`嘗試使用未授權的通道 ${channel}`);
      }
    },
    
    /**
     * 調用主進程方法並等待響應
     * @param channel 通道名稱
     * @param data 要發送的數據
     */
    invoke: (channel: string, data?: any) => {
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, data);
      }
      return Promise.reject(new Error(`無效的通道: ${channel}`));
    },
    
    /**
     * 監聽來自主進程的訊息
     * @param channel 通道名稱
     * @param callback 回調函數
     */
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
      
      console.warn(`嘗試監聽未授權的通道 ${channel}`);
      return () => { /* noop */ };
    }
  };
} 