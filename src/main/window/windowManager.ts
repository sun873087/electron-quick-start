import { BrowserWindow } from 'electron';
import path from 'node:path';

class WindowManager {
  private mainWindow: BrowserWindow | null = null;

  /**
   * 創建主視窗
   */
  createMainWindow(): BrowserWindow {
    // 從環境變數讀取視窗尺寸
    const windowWidth = parseInt(process.env.WINDOW_WIDTH || '1024', 10);
    const windowHeight = parseInt(process.env.WINDOW_HEIGHT || '768', 10);
    const minWidth = parseInt(process.env.WINDOW_MIN_WIDTH || '800', 10);
    const minHeight = parseInt(process.env.WINDOW_MIN_HEIGHT || '600', 10);

    // Create the browser window.
    this.mainWindow = new BrowserWindow({
      width: windowWidth,
      height: windowHeight,
      minWidth: minWidth,
      minHeight: minHeight,
      title: process.env.APP_NAME,
      webPreferences: {
        // 根據環境選擇正確的預加載腳本路徑
        preload: MAIN_WINDOW_VITE_DEV_SERVER_URL 
          ? path.join(process.cwd(), '.vite/build/preload.js') 
          : path.join(__dirname, '../preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        // 為了調試，可以暫時啟用開發者工具
        devTools: process.env.NODE_ENV === 'development',
      },
      // 可以添加更多窗口設置
      // frame: false, // 無邊框窗口
      // transparent: true, // 透明窗口
      // titleBarStyle: 'hidden', // 隱藏標題欄
    });

    // 載入應用程式的 index.html
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      this.mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
      this.mainWindow.loadFile(path.join(__dirname, `../../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }

    // 在開發環境中打開 DevTools
    if (process.env.NODE_ENV === 'development' && process.env.ENABLE_DEVTOOLS === 'true') {
      this.mainWindow.webContents.openDevTools();
    }

    // 設置窗口關閉事件處理
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    return this.mainWindow;
  }

  /**
   * 獲取主視窗實例
   */
  getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }

  /**
   * 最小化主視窗
   */
  minimizeMainWindow(): void {
    if (this.mainWindow) {
      this.mainWindow.minimize();
    }
  }

  /**
   * 最大化或還原主視窗
   */
  maximizeOrRestoreMainWindow(): void {
    if (this.mainWindow) {
      if (this.mainWindow.isMaximized()) {
        this.mainWindow.unmaximize();
      } else {
        this.mainWindow.maximize();
      }
    }
  }

  /**
   * 關閉主視窗
   */
  closeMainWindow(): void {
    if (this.mainWindow) {
      this.mainWindow.close();
    }
  }
}

export default new WindowManager(); 