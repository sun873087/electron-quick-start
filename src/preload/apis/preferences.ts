import { ipcRenderer } from 'electron';
import { PreferencesApi } from '../types';
import { preferencesChannels } from '../channels';

/**
 * 創建並返回用戶偏好設置 API
 * 遵循單一職責原則：此模塊只負責用戶偏好設置相關功能
 */
export function createPreferencesApi(): PreferencesApi {
  // 獲取偏好設置相關通道
  const [getChannel, setChannel, resetChannel] = preferencesChannels;
  
  return {
    /**
     * 獲取偏好設置
     * @param key 偏好設置鍵名
     * @param defaultValue 默認值
     */
    get: <T>(key: string, defaultValue?: T) => {
      return ipcRenderer.invoke(getChannel, { key, defaultValue }) as Promise<T>;
    },
    
    /**
     * 設置偏好設置
     * @param key 偏好設置鍵名
     * @param value 值
     */
    set: <T>(key: string, value: T) => {
      return ipcRenderer.invoke(setChannel, { key, value }) as Promise<void>;
    },
    
    /**
     * 重置偏好設置為默認值
     */
    resetToDefaults: () => {
      return ipcRenderer.invoke(resetChannel) as Promise<void>;
    }
  };
} 