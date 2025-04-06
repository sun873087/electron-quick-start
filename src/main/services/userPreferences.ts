import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';

/**
 * 用戶偏好設置服務
 * 負責儲存和管理用戶偏好設置
 */
class UserPreferences {
  private readonly userDataPath: string;
  private readonly preferencesPath: string;
  private preferences: Record<string, any>;
  private loaded: boolean;

  constructor() {
    this.userDataPath = app.getPath('userData');
    this.preferencesPath = path.join(this.userDataPath, 'preferences.json');
    this.preferences = {};
    this.loaded = false;
  }

  /**
   * 初始化用戶偏好設置
   */
  init(): void {
    this.createFolderIfNotExists();
    this.loadPreferences();
  }

  /**
   * 創建用戶數據文件夾（如不存在）
   */
  private createFolderIfNotExists(): void {
    if (!fs.existsSync(this.userDataPath)) {
      fs.mkdirSync(this.userDataPath, { recursive: true });
    }
  }

  /**
   * 載入偏好設置
   */
  private loadPreferences(): void {
    try {
      if (fs.existsSync(this.preferencesPath)) {
        const data = fs.readFileSync(this.preferencesPath, 'utf8');
        this.preferences = JSON.parse(data);
      } else {
        this.preferences = this.getDefaultPreferences();
        this.savePreferences();
      }
      this.loaded = true;
      console.log('用戶偏好設置載入成功');
    } catch (error) {
      console.error('載入用戶偏好設置失敗:', error);
      this.preferences = this.getDefaultPreferences();
      this.loaded = true;
    }
  }

  /**
   * 獲取默認偏好設置
   */
  private getDefaultPreferences(): Record<string, any> {
    return {
      theme: 'system', // 'light', 'dark', 'system'
      language: 'zh-TW',
      notifications: {
        enabled: true,
        updates: true,
        sounds: true
      },
      updates: {
        checkAutomatically: true,
        downloadAutomatically: false
      },
      window: {
        startMaximized: false,
        rememberSize: true,
        width: 1024,
        height: 768
      },
      recentFiles: [],
      customWorkspaces: []
    };
  }

  /**
   * 儲存偏好設置
   */
  private savePreferences(): void {
    try {
      fs.writeFileSync(this.preferencesPath, JSON.stringify(this.preferences, null, 2), 'utf8');
      console.log('用戶偏好設置已儲存');
    } catch (error) {
      console.error('儲存用戶偏好設置失敗:', error);
    }
  }

  /**
   * 獲取偏好設置值
   * @param key 偏好設置鍵
   * @param defaultValue 默認值
   * @returns 偏好設置值
   */
  get<T>(key: string, defaultValue?: T): T {
    if (!this.loaded) {
      this.loadPreferences();
    }

    // 支持點符號訪問嵌套屬性，如 'notifications.enabled'
    const keys = key.split('.');
    let value: any = this.preferences;
    
    for (const k of keys) {
      if (value === undefined || value === null) {
        return defaultValue as T;
      }
      value = value[k];
    }

    return (value === undefined) ? defaultValue as T : value as T;
  }

  /**
   * 設置偏好設置值
   * @param key 偏好設置鍵
   * @param value 偏好設置值
   */
  set<T>(key: string, value: T): void {
    if (!this.loaded) {
      this.loadPreferences();
    }

    // 支持點符號設置嵌套屬性，如 'notifications.enabled'
    const keys = key.split('.');
    let target = this.preferences;
    
    // 遍歷和創建嵌套路徑
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in target)) {
        target[k] = {};
      }
      target = target[k];
    }
    
    // 設置最終值
    const lastKey = keys[keys.length - 1];
    target[lastKey] = value;
    
    // 儲存更新後的偏好設置
    this.savePreferences();
  }

  /**
   * 刪除偏好設置項
   * @param key 偏好設置鍵
   */
  delete(key: string): void {
    if (!this.loaded) {
      this.loadPreferences();
    }

    const keys = key.split('.');
    let target = this.preferences;
    
    // 遍歷嵌套路徑
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in target)) {
        return; // 如果路徑不存在，什麼都不做
      }
      target = target[k];
    }
    
    // 刪除屬性
    const lastKey = keys[keys.length - 1];
    if (lastKey in target) {
      delete target[lastKey];
      this.savePreferences();
    }
  }

  /**
   * 重置偏好設置為默認值
   */
  resetToDefaults(): void {
    this.preferences = this.getDefaultPreferences();
    this.savePreferences();
  }
}

export default new UserPreferences(); 