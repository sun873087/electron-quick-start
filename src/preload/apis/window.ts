import { ipcRenderer } from 'electron';
import { WindowApi } from '../types';
import { windowChannels } from '../channels';

/**
 * 創建並返回窗口控制 API
 * 依賴倒置原則：依賴抽象（介面）而非具體實現
 */
export function createWindowApi(): WindowApi {
  // 確保通道名稱是正確的
  const [minimizeChannel, maximizeChannel, closeChannel] = windowChannels;
  
  return {
    /**
     * 最小化窗口
     */
    minimize: () => {
      console.log('minimize');
      ipcRenderer.send(minimizeChannel);
    },
    
    /**
     * 最大化/還原窗口
     */
    maximize: () => {
      console.log('maximize');
      ipcRenderer.send(maximizeChannel);
    },
    
    /**
     * 關閉窗口
     */
    close: () => {
      console.log('close');
      ipcRenderer.send(closeChannel);
    }
  };
} 