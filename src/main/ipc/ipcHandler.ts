import { ipcMain, BrowserWindow } from 'electron';
import windowManager from '../window/windowManager';
import environment from '../utils/environment';
import userPreferences from '../services/userPreferences';
import appUpdater from '../services/appUpdater';

/**
 * IPC 通信處理類
 * 負責處理主進程與渲染進程之間的通信
 */
class IpcHandler {
  /**
   * 初始化 IPC 處理
   */
  init(): void {
    this.setupBasicChannels();
    this.setupWindowControls();
    this.setupEnvironmentAccess();
    this.setupPreferencesAccess();
    this.setupUpdatesHandling();
  }

  /**
   * 設置基本通信通道
   */
  private setupBasicChannels(): void {
    // 示例：基本的 ping-pong 通信
    ipcMain.on('app:hello', (event) => {
      event.reply('app:message', '你好，來自主進程！');
    });

    ipcMain.handle('app:message', async (_event, message: string) => {
      console.log('從渲染進程收到訊息:', message);
      return `主進程已收到您的訊息: "${message}"`;
    });
  }

  /**
   * 設置視窗控制
   */
  private setupWindowControls(): void {
    // 處理視窗最小化
    ipcMain.on('window:minimize', () => {
      const mainWindow = windowManager.getMainWindow();
      if (mainWindow) {
        windowManager.minimizeMainWindow();
      }
    });

    // 處理視窗最大化/還原
    ipcMain.on('window:maximize', () => {
      const mainWindow = windowManager.getMainWindow();
      if (mainWindow) {
        windowManager.maximizeOrRestoreMainWindow();
      }
    });

    // 處理視窗關閉
    ipcMain.on('window:close', () => {
      const mainWindow = windowManager.getMainWindow();
      if (mainWindow) {
        windowManager.closeMainWindow();
      }
    });
  }

  /**
   * 設置環境變數訪問
   */
  private setupEnvironmentAccess(): void {
    // 安全地獲取環境變數
    ipcMain.handle('env:get', (_event, key: string) => {
      // 允許的環境變數列表
      const allowedEnvVars = [
        'APP_NAME',
        'APP_VERSION',
        'APP_DESCRIPTION',
        'API_URL',
        'DEFAULT_LOCALE',
        'DEFAULT_THEME',
        'FEATURE_EXPERIMENTAL'
      ];

      // 只返回允許的環境變數
      if (allowedEnvVars.includes(key)) {
        return environment.get(key, '');
      }
      
      console.warn(`嘗試訪問未授權的環境變數: ${key}`);
      return '';
    });
  }

  /**
   * 設置用戶偏好設置訪問
   */
  private setupPreferencesAccess(): void {
    // 獲取偏好設置
    ipcMain.handle('preferences:get', (_event, { key, defaultValue }) => {
      return userPreferences.get(key, defaultValue);
    });

    // 設置偏好設置
    ipcMain.handle('preferences:set', (_event, { key, value }) => {
      userPreferences.set(key, value);
      return true;
    });

    // 重置偏好設置
    ipcMain.handle('preferences:reset', () => {
      userPreferences.resetToDefaults();
      return true;
    });
  }

  /**
   * 設置更新處理
   */
  private setupUpdatesHandling(): void {
    // 檢查更新
    ipcMain.handle('app:check-updates', async () => {
      const mainWindow = windowManager.getMainWindow();
      if (mainWindow) {
        // 這只是一個示例，在實際應用中應當調用真實的更新檢查邏輯
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模擬發現更新
        if (environment.isDevelopment()) {
          mainWindow.webContents.send('app:update-available', {
            version: '1.1.0',
            releaseNotes: '- 修復了一些錯誤\n- 改進了性能\n- 添加了新功能'
          });
        }
      }
      return true;
    });

    // 下載更新
    ipcMain.handle('app:download-update', async () => {
      const mainWindow = windowManager.getMainWindow();
      if (mainWindow && environment.isDevelopment()) {
        // 在實際應用中，這裡應該調用實際的更新下載邏輯
        await new Promise(resolve => setTimeout(resolve, 2000));
        // 發送更新下載完成事件
        mainWindow.webContents.send('app:update-downloaded', {
          version: '1.1.0',
          releaseDate: new Date().toISOString()
        });
      }
      return true;
    });

    // 處理選單事件
    ipcMain.on('menu:check-updates', () => {
      const mainWindow = windowManager.getMainWindow();
      if (mainWindow) {
        mainWindow.webContents.send('menu:check-updates');
      }
    });

    // 處理開啟設定視窗事件
    ipcMain.on('menu:open-settings', () => {
      const mainWindow = windowManager.getMainWindow();
      if (mainWindow) {
        mainWindow.webContents.send('menu:open-settings');
      }
    });
  }
}

export default new IpcHandler(); 