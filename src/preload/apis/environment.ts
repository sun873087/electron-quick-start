import { ipcRenderer } from 'electron';
import { EnvironmentApi } from '../types';
import { environmentChannels } from '../channels';

/**
 * 創建並返回環境變數 API
 * 遵循單一職責原則：此模塊只負責環境變數相關功能
 */
export function createEnvironmentApi(): EnvironmentApi {
  // 獲取環境變數通道
  const [getEnvChannel] = environmentChannels;
  
  return {
    /**
     * 獲取環境變數
     * @param key 環境變數鍵名
     */
    get: (key: string) => {
      return ipcRenderer.invoke(getEnvChannel, key);
    }
  };
} 