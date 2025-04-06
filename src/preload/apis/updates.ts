import { ipcRenderer } from 'electron';
import { UpdatesApi } from '../types';
import { updateChannels } from '../channels';

/**
 * 創建並返回更新相關 API
 * 遵循單一職責原則：此模塊只負責應用更新相關功能
 */
export function createUpdatesApi(): UpdatesApi {
  // 從通道列表中獲取更新相關通道
  // 只獲取需要用到的通道
  const checkUpdatesChannel = updateChannels.find(ch => ch === 'app:check-updates');
  const downloadUpdateChannel = updateChannels.find(ch => ch === 'app:download-update');
  
  if (!checkUpdatesChannel || !downloadUpdateChannel) {
    throw new Error('更新通道定義不正確');
  }
  
  return {
    /**
     * 檢查應用更新
     */
    checkForUpdates: () => {
      return ipcRenderer.invoke(checkUpdatesChannel);
    },
    
    /**
     * 下載更新
     */
    downloadUpdate: () => {
      return ipcRenderer.invoke(downloadUpdateChannel);
    }
  };
} 