import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { app } from 'electron';

/**
 * 環境變數管理類
 */
class Environment {
  /**
   * 初始化環境變數
   * 從不同的 .env 文件中載入環境變數
   */
  init(): void {
    try {
      // 根據環境載入不同的 .env 文件
      const nodeEnv = process.env.NODE_ENV || 'development';
      
      // 定義 .env 文件路徑
      const basePath = process.env.NODE_ENV === 'production' 
        ? path.join(process.resourcesPath) 
        : app.getAppPath();

      // 加載 .env 文件
      const envFile = path.join(basePath, '.env');
      const envLocalFile = path.join(basePath, '.env.local');
      const envEnvFile = path.join(basePath, `.env.${nodeEnv}`);
      const envEnvLocalFile = path.join(basePath, `.env.${nodeEnv}.local`);
      
      // 加載順序從低優先級到高優先級
      this.loadEnvFile(envFile);
      this.loadEnvFile(envEnvFile);
      this.loadEnvFile(envLocalFile);
      this.loadEnvFile(envEnvLocalFile);
      
      // 輸出當前環境信息
      console.log(`当前环境: ${this.get('NODE_ENV', 'development')}`);
      console.log(`应用名称: ${this.get('APP_NAME', 'Electron App')}`);
      console.log(`API 地址: ${this.get('API_URL', 'http://localhost:3000')}`);
    } catch (error) {
      console.error('環境變數加載失敗:', error);
    }
  }

  /**
   * 加載環境變數文件
   * @param filePath 文件路徑
   */
  private loadEnvFile(filePath: string): void {
    if (fs.existsSync(filePath)) {
      console.log(`載入環境變數文件: ${filePath}`);
      const envConfig = dotenv.parse(fs.readFileSync(filePath));
      
      // 將變數設置到 process.env
      for (const key in envConfig) {
        process.env[key] = envConfig[key];
      }
    }
  }

  /**
   * 獲取環境變數
   * @param key 環境變數鍵
   * @param defaultValue 默認值
   * @returns 環境變數值
   */
  get(key: string, defaultValue = ''): string {
    return process.env[key] || defaultValue;
  }

  /**
   * 獲取數字類型環境變數
   * @param key 環境變數鍵
   * @param defaultValue 默認值
   * @returns 環境變數數字值
   */
  getNumber(key: string, defaultValue = 0): number {
    const value = process.env[key];
    if (value === undefined || value === null) {
      return defaultValue;
    }
    
    const numValue = parseInt(value, 10);
    return isNaN(numValue) ? defaultValue : numValue;
  }

  /**
   * 獲取布爾類型環境變數
   * @param key 環境變數鍵
   * @param defaultValue 默認值
   * @returns 環境變數布爾值
   */
  getBoolean(key: string, defaultValue = false): boolean {
    const value = process.env[key];
    if (value === undefined || value === null) {
      return defaultValue;
    }
    
    return value.toLowerCase() === 'true';
  }

  /**
   * 是否爲開發環境
   * @returns 是否爲開發環境
   */
  isDevelopment(): boolean {
    return this.get('NODE_ENV', 'development') === 'development';
  }

  /**
   * 是否爲生產環境
   * @returns 是否爲生產環境
   */
  isProduction(): boolean {
    return this.get('NODE_ENV') === 'production';
  }
}

// 導出單例實例
export default new Environment(); 