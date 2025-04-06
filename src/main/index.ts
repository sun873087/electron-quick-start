import { app, BrowserWindow } from 'electron';
import windowManager from './window/windowManager';
import environment from './utils/environment';
import ipcHandler from './ipc/ipcHandler';
import appUpdater from './services/appUpdater';
import menuBuilder from './services/menuBuilder';
import userPreferences from './services/userPreferences';
import logger from './utils/log';

/**
 * 主應用程式類
 */
class Application {
  private mainWindow: BrowserWindow | null = null;

  /**
   * 初始化應用程式
   */
  init(): void {
    // 初始化日誌系統
    logger.init();
    logger.info('應用程式啟動中...');
    
    // 初始化環境變數
    environment.init();
    logger.info('環境變數已載入');
    
    // 初始化用戶偏好設置
    userPreferences.init();
    logger.info('用戶偏好設置已載入');

    // 設置應用程式事件
    this.setupAppEvents();
    logger.info('應用程式事件已設置');
    
    // 初始化IPC處理
    ipcHandler.init();
    logger.info('IPC通信已初始化');
    
    logger.info('應用程式初始化完成');
  }

  /**
   * 設置應用程式事件
   */
  private setupAppEvents(): void {
    // 當Electron初始化完成且準備建立瀏覽器視窗時觸發
    app.on('ready', () => this.onReady());

    // 當所有視窗都被關閉時觸發
    app.on('window-all-closed', () => this.onWindowAllClosed());

    // 當應用程式將要退出前觸發
    app.on('before-quit', () => this.onBeforeQuit());

    // 當應用程式被激活時觸發
    app.on('activate', () => this.onActivate());
  }

  /**
   * 當應用程式準備好時的處理
   */
  private onReady(): void {
    logger.info('應用程式準備就緒');
    
    // 創建主視窗
    this.mainWindow = windowManager.createMainWindow();
    logger.info('主視窗已創建');
    
    // 設置應用程式選單
    menuBuilder.buildMenu(this.mainWindow);
    logger.info('應用程式選單已設置');
    
    // 初始化更新服務
    appUpdater.init(this.mainWindow);
    logger.info('更新服務已初始化');
  }

  /**
   * 當所有視窗關閉時的處理
   */
  private onWindowAllClosed(): void {
    // 在所有平台上都完全退出應用，不僅僅是 Windows 和 Linux
    app.quit();
  }

  /**
   * 當應用程式將要退出前的處理
   */
  private isAppQuitting = false;

  /**
   * 當應用程式即將退出前的處理
   */
  private onBeforeQuit(): void {
    logger.info('應用程式即將退出');
    
    // 設置退出標記，防止 macOS 上重新開啟視窗
    this.isAppQuitting = true;
    
    // 清理資源
    this.mainWindow = null;
  }

  /**
   * 當應用程式被激活時的處理
   */
  private onActivate(): void {
    // 在macOS上，當點擊dock圖標且沒有其他視窗打開時，
    // 通常會在應用程式中重新建立一個視窗
    // 但如果應用程式正在退出，則不重新建立視窗
    if (!this.isAppQuitting && this.mainWindow === null) {
      this.mainWindow = windowManager.createMainWindow();
    }
  }
}

// 處理未捕獲的異常
process.on('uncaughtException', (error) => {
  logger.fatal('未捕獲的異常:', error);
  app.quit();
});

// 處理未處理的Promise拒絕
process.on('unhandledRejection', (reason, promise) => {
  logger.error('未處理的Promise拒絕:', reason);
});

// 創建應用程式實例並初始化
const application = new Application();
application.init();

// 將 application 導出為 default 導出
export default application; 