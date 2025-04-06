import React, { useState, useEffect } from 'react';

interface EnvironmentInfo {
  appName: string;
  appVersion: string;
  appDescription: string;
  nodeEnv: string;
  apiUrl: string;
  locale: string;
  theme: string;
  experimental: boolean;
}

const defaultEnvironmentInfo: EnvironmentInfo = {
  appName: '正在載入...',
  appVersion: '正在載入...',
  appDescription: '正在載入...',
  nodeEnv: '正在載入...',
  apiUrl: '正在載入...',
  locale: '正在載入...',
  theme: '正在載入...',
  experimental: false
};

const EnvironmentInfo = () => {
  const [environmentInfo, setEnvironmentInfo] = useState<EnvironmentInfo>(defaultEnvironmentInfo);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEnvironmentInfo = async () => {
      try {
        // 使用新的 electron API 獲取環境信息
        const appName = await (window as any).electron.environment.get('APP_NAME');
        const appVersion = await (window as any).electron.environment.get('APP_VERSION');
        const appDescription = await (window as any).electron.environment.get('APP_DESCRIPTION');
        const nodeEnv = await (window as any).electron.environment.get('NODE_ENV');
        const apiUrl = await (window as any).electron.environment.get('API_URL');
        const locale = await (window as any).electron.environment.get('DEFAULT_LOCALE');
        const theme = await (window as any).electron.environment.get('DEFAULT_THEME');
        const experimentalStr = await (window as any).electron.environment.get('FEATURE_EXPERIMENTAL');
        
        // 使用用戶偏好設置獲取主題
        const userTheme = await (window as any).electron.preferences.get('theme', 'system');

        setEnvironmentInfo({
          appName: appName || '未設置',
          appVersion: appVersion || '未設置',
          appDescription: appDescription || '未設置',
          nodeEnv: nodeEnv || '未設置',
          apiUrl: apiUrl || '未設置',
          locale: locale || '未設置',
          theme: userTheme || theme || '未設置',
          experimental: experimentalStr === 'true'
        });
        setIsLoading(false);
      } catch (error) {
        console.error('獲取環境信息失敗:', error);
        setIsLoading(false);
      }
    };

    fetchEnvironmentInfo();

    // 設置更新監聽器
    const removeUpdateListener = (window as any).electron.on('app:update-available', (updateInfo) => {
      console.log('有可用更新:', updateInfo);
      // 這裡可以顯示更新通知
    });

    // 設置選單事件監聽器
    const removeSettingsListener = (window as any).electron.on('menu:open-settings', () => {
      console.log('打開設置頁面');
      // 這裡可以導航到設置頁面
    });

    // 清理函數
    return () => {
      removeUpdateListener();
      removeSettingsListener();
    };
  }, []);

  // 檢查更新的示例函數
  const checkForUpdates = async () => {
    try {
      await (window as any).electron.updates.checkForUpdates();
      console.log('已啟動更新檢查');
    } catch (error) {
      console.error('檢查更新失敗:', error);
    }
  };

  // 切換主題的示例函數
  const toggleTheme = async () => {
    const currentTheme = await (window as any).electron.preferences.get('theme', 'system');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    await (window as any).electron.preferences.set('theme', newTheme);
    
    // 更新界面顯示
    setEnvironmentInfo(prev => ({
      ...prev,
      theme: newTheme
    }));
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        環境信息
      </h3>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">應用名稱:</span>
            <span className="font-medium">{environmentInfo.appName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">版本:</span>
            <span className="font-medium">{environmentInfo.appVersion}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">描述:</span>
            <span className="font-medium">{environmentInfo.appDescription}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">環境:</span>
            <span className="font-medium">{environmentInfo.nodeEnv}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">API URL:</span>
            <span className="font-medium">{environmentInfo.apiUrl}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">語言:</span>
            <span className="font-medium">{environmentInfo.locale}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">主題:</span>
            <span className="font-medium">{environmentInfo.theme}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">實驗功能:</span>
            <span className="font-medium">{environmentInfo.experimental ? '啟用' : '禁用'}</span>
          </div>
          
          <div className="flex gap-2 mt-4">
            <button 
              onClick={checkForUpdates}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              檢查更新
            </button>
            <button 
              onClick={toggleTheme}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              切換主題
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvironmentInfo; 