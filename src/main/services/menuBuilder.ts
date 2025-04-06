import {
  Menu,
  MenuItem,
  BrowserWindow,
  MenuItemConstructorOptions,
  app,
  dialog,
  shell
} from 'electron';
import environment from '../utils/environment';

/**
 * 選單構建器
 * 負責建立應用程式選單
 */
class MenuBuilder {
  /**
   * 建立應用程式選單
   * @param mainWindow 主視窗
   */
  buildMenu(mainWindow: BrowserWindow): void {
    // 如果在開發模式或測試模式下，保留默認選單
    if (environment.isDevelopment() || process.env.DEBUG_PROD === 'true') {
      this.setupDevelopmentMenu(mainWindow);
    } else {
      this.setupProductionMenu(mainWindow);
    }
  }

  /**
   * 設置開發環境選單
   * @param mainWindow 主視窗
   */
  private setupDevelopmentMenu(mainWindow: BrowserWindow): void {
    const menu = Menu.getApplicationMenu();
    
    // 添加開發者工具選單項
    if (menu) {
      const viewMenu = menu.items.find(item => item.role === 'viewMenu');
      if (viewMenu && viewMenu.submenu) {
        viewMenu.submenu.append(
          new MenuItem({
            label: '切換開發者工具',
            accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Alt+Ctrl+I',
            click: () => {
              mainWindow.webContents.toggleDevTools();
            }
          })
        );
        
        viewMenu.submenu.append(
          new MenuItem({
            label: '重新載入',
            accelerator: 'F5',
            click: () => {
              mainWindow.webContents.reload();
            }
          })
        );
      }
      
      Menu.setApplicationMenu(menu);
    }
  }

  /**
   * 設置生產環境選單
   * @param mainWindow 主視窗
   */
  private setupProductionMenu(mainWindow: BrowserWindow): void {
    const template: MenuItemConstructorOptions[] = [
      {
        label: '檔案',
        submenu: [
          {
            label: '關於',
            click: () => {
              this.showAboutDialog();
            }
          },
          { type: 'separator' },
          {
            label: '設定',
            click: () => {
              mainWindow.webContents.send('menu:open-settings');
            }
          },
          { type: 'separator' },
          {
            label: '離開',
            accelerator: 'CommandOrControl+Q',
            click: () => {
              app.quit();
            }
          }
        ]
      },
      {
        label: '編輯',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ]
      },
      {
        label: '檢視',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: '幫助',
        submenu: [
          {
            label: '檢查更新',
            click: () => {
              mainWindow.webContents.send('menu:check-updates');
            }
          },
          {
            label: '報告問題',
            click: () => {
              const url = environment.get('REPORT_ISSUE_URL', 'https://github.com/yourusername/your-repo/issues');
              shell.openExternal(url);
            }
          },
          {
            label: '關於',
            click: () => {
              this.showAboutDialog();
            }
          }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  /**
   * 顯示關於對話框
   */
  private showAboutDialog(): void {
    const appName = environment.get('APP_NAME', app.getName());
    const appVersion = app.getVersion();
    
    const options = {
      type: 'info' as const,
      buttons: ['確定'],
      title: `關於 ${appName}`,
      message: `${appName} ${appVersion}`,
      detail: `
版本: ${appVersion}
Electron: ${process.versions.electron}
Chrome: ${process.versions.chrome}
Node.js: ${process.versions.node}
V8: ${process.versions.v8}
作業系統: ${process.platform} ${process.arch}
      `
    };
    
    dialog.showMessageBox(options);
  }
}

export default new MenuBuilder(); 