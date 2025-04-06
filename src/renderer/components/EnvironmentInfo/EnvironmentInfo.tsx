import React, { useEffect, useState } from 'react';
import './EnvironmentInfo.css';

interface AppInfo {
  name: string;
  version: string;
  description: string;
}

interface UserPreferences {
  locale: string;
  theme: string;
}

const EnvironmentInfo: React.FC = () => {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [userPrefs, setUserPrefs] = useState<UserPreferences | null>(null);
  const [isExperimental, setIsExperimental] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 檢查 window.electron 是否存在
    console.log('window.electron 存在嗎?', !!window.electron);
    
    // 如果存在，輸出它的結構
    if (window.electron) {
      console.log('window.electron:', window.electron);
      console.log('window.electron.environment:', window.electron.environment);
      console.log('window.electron.preferences:', window.electron.preferences);
    }

    const loadData = async () => {
      try {
        // 確保 window.electron 存在
        if (window.electron) {
          // 使用正確的API路徑
          const appName = await window.electron.environment.get('APP_NAME');
          const appVersion = await window.electron.environment.get('APP_VERSION');
          const appDescription = await window.electron.environment.get('APP_DESCRIPTION');
          
          const appInfoData = {
            name: appName || '未知',
            version: appVersion || '未知',
            description: appDescription || '未知'
          };
          
          const locale = await window.electron.preferences.get('locale', '繁體中文');
          const theme = await window.electron.preferences.get('theme', '淺色');
          
          const userPreferencesData = {
            locale,
            theme
          };
          
          const experimental = await window.electron.preferences.get('experimentalFeatures', false);
          
          setAppInfo(appInfoData);
          setUserPrefs(userPreferencesData);
          setIsExperimental(experimental);
        }
      } catch (error) {
        console.error('獲取環境信息失敗:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return <div className="environment-info">載入環境信息中...</div>;
  }

  if (!appInfo || !userPrefs) {
    return (
      <div className="environment-info">
        <div>無法載入環境信息</div>
        <div className="debug-info">
          <h4>調試信息</h4>
          <pre>
            window.electron 存在: {window.electron ? '是' : '否'}
            {window.electron && (
              <>
                {'\n'}環境API存在: {window.electron.environment ? '是' : '否'}
                {'\n'}偏好設置API存在: {window.electron.preferences ? '是' : '否'}
              </>
            )}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="environment-info">
      <h3>應用信息</h3>
      <ul>
        <li><strong>名稱:</strong> {appInfo.name}</li>
        <li><strong>版本:</strong> {appInfo.version}</li>
        <li><strong>描述:</strong> {appInfo.description}</li>
      </ul>
      
      <h3>用戶設定</h3>
      <ul>
        <li><strong>語言:</strong> {userPrefs.locale}</li>
        <li><strong>主題:</strong> {userPrefs.theme}</li>
      </ul>
      
      <h3>功能狀態</h3>
      <ul>
        <li>
          <strong>實驗性功能:</strong> 
          <span className={isExperimental ? 'status-enabled' : 'status-disabled'}>
            {isExperimental ? '已啟用' : '已停用'}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default EnvironmentInfo; 