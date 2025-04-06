import { contextBridge } from 'electron';
import { IpcApi } from './types';
import { createBaseApi } from './apis/base';
import { createWindowApi } from './apis/window';
import { createEnvironmentApi } from './apis/environment';
import { createUpdatesApi } from './apis/updates';
import { createPreferencesApi } from './apis/preferences';

/**
 * 預加載腳本主入口
 * 遵循開閉原則：對擴展開放，對修改封閉
 * 當需要添加新的API時，只需創建新模塊並在此處組合即可
 */

try {
  console.log('開始初始化預加載腳本...');
  
  // 創建各個 API 模塊
  const baseApi = createBaseApi();
  console.log('基本API已創建');
  
  const windowApi = createWindowApi();
  console.log('窗口API已創建');
  
  const environmentApi = createEnvironmentApi();
  console.log('環境API已創建:', environmentApi);
  
  const updatesApi = createUpdatesApi();
  console.log('更新API已創建');
  
  const preferencesApi = createPreferencesApi();
  console.log('偏好設置API已創建:', preferencesApi);
  
  // 組合到完整的 IPC API
  const api: IpcApi = {
    ...baseApi,
    window: windowApi,
    environment: environmentApi,
    updates: updatesApi,
    preferences: preferencesApi
  };
  
  console.log('完整API已組合，準備暴露到渲染進程');
  
  // 通過 contextBridge 暴露給渲染進程
  contextBridge.exposeInMainWorld('electron', api);
  
  console.log('預加載腳本已成功初始化，API已暴露到window.electron');
} catch (error) {
  console.error('預加載腳本初始化失敗:', error);
} 