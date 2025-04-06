import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';
import environment from './environment';

/**
 * 日誌級別
 */
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

/**
 * 日誌記錄器
 */
class Logger {
  private readonly logFolder: string;
  private logStream: fs.WriteStream | null = null;
  private logLevel: LogLevel;
  private maxLogSize: number; // 字節
  private maxLogFiles: number;
  private currentLogFile = '';

  constructor() {
    // 日誌文件夾路徑
    this.logFolder = path.join(app.getPath('userData'), 'logs');
    
    // 默認日誌級別
    this.logLevel = environment.isDevelopment() 
      ? LogLevel.DEBUG 
      : LogLevel.INFO;
    
    // 默認設置
    this.maxLogSize = 5 * 1024 * 1024; // 5MB
    this.maxLogFiles = 5;
  }

  /**
   * 初始化日誌記錄器
   */
  init(): void {
    try {
      this.createLogFolder();
      this.setupLogFile();
      
      // 當應用退出時關閉日誌流
      app.on('quit', () => {
        this.closeLogStream();
      });
      
      this.info('日誌記錄器初始化成功');
    } catch (error) {
      console.error('初始化日誌記錄器失敗:', error);
    }
  }

  /**
   * 創建日誌文件夾
   */
  private createLogFolder(): void {
    if (!fs.existsSync(this.logFolder)) {
      fs.mkdirSync(this.logFolder, { recursive: true });
    }
  }

  /**
   * 設置日誌文件
   */
  private setupLogFile(): void {
    const timestamp = new Date().toISOString().split('T')[0];
    this.currentLogFile = path.join(this.logFolder, `app-${timestamp}.log`);
    
    // 如果已有日誌流，先關閉
    this.closeLogStream();
    
    // 打開新的日誌流
    this.logStream = fs.createWriteStream(this.currentLogFile, { flags: 'a' });
    
    // 檢查日誌文件大小和數量
    this.checkLogRotation();
  }

  /**
   * 關閉日誌流
   */
  private closeLogStream(): void {
    if (this.logStream) {
      this.logStream.end();
      this.logStream = null;
    }
  }

  /**
   * 檢查日誌文件輪轉
   */
  private checkLogRotation(): void {
    try {
      // 檢查當前日誌文件大小
      if (fs.existsSync(this.currentLogFile)) {
        const stats = fs.statSync(this.currentLogFile);
        if (stats.size >= this.maxLogSize) {
          this.rotateLogFiles();
        }
      }
      
      // 檢查日誌文件數量並刪除過舊的文件
      this.cleanupOldLogFiles();
    } catch (error) {
      console.error('檢查日誌輪轉失敗:', error);
    }
  }

  /**
   * 輪轉日誌文件
   */
  private rotateLogFiles(): void {
    this.closeLogStream();
    
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace('T', '_').slice(0, 19);
    const newLogFile = path.join(this.logFolder, `app-${timestamp}.log`);
    
    // 重命名當前日誌文件
    if (fs.existsSync(this.currentLogFile)) {
      fs.renameSync(this.currentLogFile, newLogFile);
    }
    
    // 創建新的日誌文件
    this.currentLogFile = path.join(this.logFolder, `app-${new Date().toISOString().split('T')[0]}.log`);
    this.logStream = fs.createWriteStream(this.currentLogFile, { flags: 'a' });
  }

  /**
   * 清理舊日誌文件
   */
  private cleanupOldLogFiles(): void {
    try {
      const files = fs.readdirSync(this.logFolder)
        .filter(file => file.startsWith('app-') && file.endsWith('.log'))
        .map(file => ({
          name: file,
          path: path.join(this.logFolder, file),
          time: fs.statSync(path.join(this.logFolder, file)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time); // 按修改時間降序排序
      
      // 保留最新的 maxLogFiles 個文件，刪除其餘的
      if (files.length > this.maxLogFiles) {
        const filesToDelete = files.slice(this.maxLogFiles);
        for (const file of filesToDelete) {
          fs.unlinkSync(file.path);
          console.log(`刪除舊日誌文件: ${file.name}`);
        }
      }
    } catch (error) {
      console.error('清理舊日誌文件失敗:', error);
    }
  }

  /**
   * 設置日誌級別
   * @param level 日誌級別
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * 寫入日誌
   * @param level 日誌級別
   * @param message 日誌消息
   * @param args 額外參數
   */
  private log(level: LogLevel, message: string, ...args: any[]): void {
    // 檢查是否達到日誌級別
    if (level < this.logLevel) {
      return;
    }
    
    try {
      // 重新檢查日誌文件
      if (!this.logStream) {
        this.setupLogFile();
      }
      
      // 檢查日誌文件大小
      this.checkLogRotation();
      
      // 格式化日誌消息
      const timestamp = new Date().toISOString();
      const levelName = LogLevel[level];
      let formattedArgs = '';
      
      if (args.length > 0) {
        formattedArgs = args.map(arg => {
          if (typeof arg === 'object') {
            return JSON.stringify(arg, null, 2);
          }
          return String(arg);
        }).join(' ');
      }
      
      const logMessage = `[${timestamp}] [${levelName}] ${message} ${formattedArgs}\n`;
      
      // 寫入日誌文件
      if (this.logStream) {
        this.logStream.write(logMessage);
      }
      
      // 在開發環境中也輸出到控制台
      if (environment.isDevelopment()) {
        console.log(logMessage);
      }
    } catch (error) {
      console.error('寫入日誌失敗:', error);
    }
  }

  /**
   * 記錄調試信息
   * @param message 消息
   * @param args 額外參數
   */
  debug(message: string, ...args: any[]): void {
    this.log(LogLevel.DEBUG, message, ...args);
  }

  /**
   * 記錄普通信息
   * @param message 消息
   * @param args 額外參數
   */
  info(message: string, ...args: any[]): void {
    this.log(LogLevel.INFO, message, ...args);
  }

  /**
   * 記錄警告信息
   * @param message 消息
   * @param args 額外參數
   */
  warn(message: string, ...args: any[]): void {
    this.log(LogLevel.WARN, message, ...args);
  }

  /**
   * 記錄錯誤信息
   * @param message 消息
   * @param args 額外參數
   */
  error(message: string, ...args: any[]): void {
    this.log(LogLevel.ERROR, message, ...args);
  }

  /**
   * 記錄致命錯誤信息
   * @param message 消息
   * @param args 額外參數
   */
  fatal(message: string, ...args: any[]): void {
    this.log(LogLevel.FATAL, message, ...args);
  }
}

// 導出單例實例
export default new Logger(); 