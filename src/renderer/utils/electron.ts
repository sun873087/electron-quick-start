// Electron API 工具函數
// 使用 contextBridge 和 ipcRenderer 與主進程通信的輔助函數

// 導入類型定義
import '../types/electron.d.ts';

/**
 * 檢查是否在 Electron 環境中運行
 */
export const isElectron = (): boolean => {
  return window && window.process && window.process.type === 'renderer';
};

/**
 * 通過 preload 腳本暴露的 API 發送消息給主進程
 */
export const sendToMain = (channel: string, data?: any): void => {
  if (isElectron() && (window as any).electron) {
    (window as any).electron.send(channel, data);
  } else {
    console.warn('Electron API 不可用，無法發送消息到主進程');
  }
};

/**
 * 通過 preload 腳本暴露的 API 從主進程接收消息
 */
export const receiveFromMain = (channel: string, callback: (...args: any[]) => void): void => {
  if (isElectron() && (window as any).electron) {
    (window as any).electron.receive(channel, callback);
  } else {
    console.warn('Electron API 不可用，無法接收主進程消息');
  }
}; 