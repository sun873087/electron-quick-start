# Electron + React + TypeScript + Vite 專案

這是一個使用 Electron、React、TypeScript 和 Vite 建立的桌面應用程式專案。

## 技術棧

- Electron
- React
- TypeScript
- Vite
- electron-squirrel-startup (Windows 安裝程式支援)

## 系統需求

- Node.js 16 或更高版本
- npm 7 或更高版本

## 安裝步驟

1. 建立專案：
```bash
npx create-electron-app@latest {project name} --template=vite-typescript
cd {project name}
```

2. 安裝所有專案依賴：
```bash
npm install
```

3. 安裝 React 相關依賴：
```bash
npm install react react-dom
npm install -D @vitejs/plugin-react
npm install -D @types/react @types/react-dom
```

4. 安裝 TypeScript 型別定義：
```bash
npm install --save-dev @types/electron-squirrel-startup
```

5. 配置 TypeScript：
```bash
# 修改 tsconfig.json 以支援 JSX
```
需要在 tsconfig.json 中添加以下設定：
```json
{
  "compilerOptions": {
    // 其他設定...
    "jsx": "react-jsx",
    "lib": ["DOM", "DOM.Iterable", "ESNext"]
  },
  "include": ["src/**/*"]
}
```

6. 為 Vite 環境變數創建類型定義檔：
```bash
# 建立 src/custom.d.ts
```
定義內容：
```typescript
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;
```

## 目錄結構轉換

1. 建立 renderer 資料夾：
```bash
mkdir -p src/renderer
```

2. 在 renderer 資料夾中建立 React 相關檔案：
   - App.tsx, App.css
   - index.tsx, index.css
   - index.html

3. 更新 Vite 配置：
```bash
# 編輯 vite.renderer.config.ts
```
更新為：
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  root: resolve(__dirname, 'src/renderer'),
  build: {
    outDir: resolve(__dirname, '.vite/renderer'),
  },
});
```

## 開發指令

- 啟動開發伺服器：
```bash
npm start
```

- 打包應用程式：
```bash
npm run package
```

- 建置發布版本：
```bash
npm run make
```

## 專案結構

### 完整專案結構

```
├── .env                     # 通用環境變數
├── .env.development         # 開發環境變數
├── .env.production          # 生產環境變數
├── .env.local               # 本地環境變數
├── src/
│   ├── main.ts              # 主程序入口點 (已重構，只包含基礎配置和引入 main/index.ts)
│   ├── main/                # 主進程代碼 (模組化架構)
│   │   ├── index.ts         # 主進程入口點
│   │   ├── window/          # 窗口管理模組
│   │   │   └── windowManager.ts # 窗口管理服務
│   │   ├── services/        # 應用服務
│   │   │   ├── appUpdater.ts # 應用更新服務
│   │   │   ├── menuBuilder.ts # 選單構建服務
│   │   │   └── userPreferences.ts # 使用者偏好設置服務
│   │   ├── ipc/             # IPC 通信模組
│   │   │   └── ipcHandler.ts # IPC 訊息處理器
│   │   └── utils/           # 工具模組
│   │       ├── environment.ts # 環境變數管理
│   │       └── log.ts       # 日誌服務
│   ├── preload.ts           # 預加載腳本
│   ├── renderer.d.ts        # 渲染進程類型定義
│   └── app/                 # React 渲染進程 (原 renderer)
│       ├── components/      # 可重用組件
│       │   ├── Counter.tsx  # 計數器示例組件
│       │   └── EnvironmentInfo.tsx # 環境變數顯示組件
│       ├── pages/           # 頁面組件
│       │   └── Home.tsx     # 首頁
│       ├── layouts/         # 布局組件
│       │   └── MainLayout.tsx # 主布局
│       ├── styles/          # 共享樣式
│       │   └── global.css   # 全局樣式
│       ├── utils/           # 工具函數
│       │   └── electron.ts  # Electron 通信工具
│       ├── hooks/           # 自定義 React hooks
│       ├── assets/          # 靜態資源
│       ├── types/           # 類型定義
│       ├── App.tsx          # React 主要應用組件
│       └── index.tsx        # React 入口文件
├── .vscode/                 # VSCode/Cursor 配置
│   ├── extensions/          # 擴展配置
│   ├── settings.json        # 設定
│   ├── extensions.json      # 推薦擴展
│   ├── extensions-guide.md  # 擴展說明文檔
│   ├── launch.json          # 除錯配置
│   ├── tasks.json           # 任務配置
│   └── debug-guide.md       # 除錯指南文檔
├── vite.main.config.ts      # 主進程 Vite 配置
├── vite.preload.config.ts   # 預加載腳本 Vite 配置
├── vite.renderer.config.ts  # 渲染進程 Vite 配置
├── forge.config.ts          # Electron Forge 配置
├── tsconfig.json            # TypeScript 配置
├── package.json             # 專案配置和依賴
├── open-ide.sh              # IDE 啟動腳本
└── README.md                # 專案說明
``` 

### 模組化架構

本項目使用模組化架構組織代碼，遵循單一職責原則（SRP）：

```
src/
├── main.ts                 # 主程序入口點 (基礎初始化與環境變數設定)
├── main/                   # 主進程代碼 (模組化架構)
│   ├── index.ts            # 主進程入口點
│   ├── window/             # 窗口管理模組
│   │   └── windowManager.ts # 窗口管理服務
│   ├── services/           # 應用服務
│   │   ├── appUpdater.ts   # 應用更新服務
│   │   ├── menuBuilder.ts  # 選單構建服務
│   │   └── userPreferences.ts # 使用者偏好設置服務
│   ├── ipc/                # IPC 通信模組
│   │   └── ipcHandler.ts   # IPC 訊息處理器
│   └── utils/              # 工具模組
│       ├── environment.ts  # 環境變數管理
│       └── log.ts          # 日誌服務
├── preload.ts              # 預加載腳本
├── renderer.d.ts          # 渲染進程類型定義
└── ...
```

### 主要模組說明

#### 主進程模組 (`src/main/`)

- **窗口管理 (`window/`)**: 負責創建和管理應用程序窗口。
  - `windowManager.ts`: 提供 `createMainWindow`、`minimizeMainWindow` 等窗口操作方法。

- **服務模組 (`services/`)**: 提供各種應用服務。
  - `appUpdater.ts`: 檢查和處理應用程序更新。
  - `menuBuilder.ts`: 構建應用程序選單。
  - `userPreferences.ts`: 管理用戶偏好設置。

- **IPC 通信 (`ipc/`)**: 處理主進程和渲染進程之間的通信。
  - `ipcHandler.ts`: 註冊和處理 IPC 訊息。

- **工具模組 (`utils/`)**: 提供輔助功能。
  - `environment.ts`: 管理環境變數。
  - `log.ts`: 提供日誌記錄功能。

#### 預加載腳本 (`preload.ts`)

連接渲染進程和主進程，提供安全的 API 訪問。

### IPC 通信

本應用使用以下 IPC 通道進行通信：

- **基本通信**: `app:hello`, `app:message`
- **窗口控制**: `window:minimize`, `window:maximize`, `window:close`
- **環境變數**: `env:get`
- **更新相關**: `app:update-available`, `app:update-downloaded`, `app:check-updates`, `app:download-update`
- **偏好設置**: `preferences:get`, `preferences:set`, `preferences:reset`
- **選單事件**: `menu:open-settings`, `menu:check-updates`

請參考 `src/preload.ts` 和 `src/main/ipc/ipcHandler.ts` 以了解所有可用的 IPC 方法。

## .env.local 設定指南

`.env.local` 是一個本地環境變數文件，用於覆蓋通用設定且不會被提交到版本控制系統中。

### 用途

- 用於設定個人開發環境特定的配置
- 覆蓋其他環境文件 (`.env`、`.env.development`、`.env.production`) 中的設定
- 存放私密資訊，如 API 金鑰、資料庫憑證等

### 設定方式

- 創建 `.env.local` 文件在專案根目錄
- 使用 `KEY=VALUE` 格式設定變數
- 不需要引號，除非值包含空格
- 每行一個變數定義

### 載入順序

- dotenv 會按以下順序載入環境變數文件：
  1. `.env` (基本配置)
  2. `.env.development` 或 `.env.production` (根據環境)
  3. `.env.local` (最後載入，優先級最高)

### 範例配置

```
# 個人化應用設定
APP_NAME=我的 Electron 應用 (本地)
APP_AUTHOR=您的名字

# 本地開發服務設定
API_URL=http://localhost:4000/api
API_TIMEOUT=2000

# 本地功能開關
ENABLE_DEVTOOLS=true
FEATURE_EXPERIMENTAL=true

# 本地視窗設定
WINDOW_WIDTH=1200
WINDOW_HEIGHT=800
```

### 注意事項

- `.env.local` 應該添加到 `.gitignore` 中
- 建議提供 `.env.local.example` 作為範本
- 這確保每個開發者可以有自己的本地設定而不影響他人

## 優化建議

1. 關閉自動開啟 DevTools（在 main.ts 中）：
```typescript
// 將這行註釋掉
// mainWindow.webContents.openDevTools();
```

2. 讓應用在關閉視窗時完全退出（已實現於 src/main/index.ts）：
```typescript
/**
 * 當所有視窗關閉時的處理
 */
private onWindowAllClosed(): void {
  // 在所有平台上都完全退出應用，不僅僅是 Windows 和 Linux
  app.quit();
}
```

3. 確保在所有平台（macOS、Windows、Linux）上的視窗關閉行為一致（已實現於 src/main/index.ts）：
```typescript
class Application {
  // ...
  private isAppQuitting = false;

  private onBeforeQuit(): void {
    logger.info('應用程式即將退出');
    
    // 設置退出標記，防止 macOS 上重新開啟視窗
    this.isAppQuitting = true;
    
    // 清理資源
    this.mainWindow = null;
  }

  private onActivate(): void {
    // 在macOS上，當點擊dock圖標且沒有其他視窗打開時，
    // 通常會在應用程式中重新建立一個視窗
    // 但如果應用程式正在退出，則不重新建立視窗
    if (!this.isAppQuitting && this.mainWindow === null) {
      this.mainWindow = windowManager.createMainWindow();
    }
  }
}
```
這段代碼確保在所有平台上有一致的應用程式行為：關閉視窗時正常退出應用，在 macOS 上則允許用戶透過點擊 dock 圖示重新開啟應用，同時避免意外的視窗重新創建。

## 注意事項

- 本專案使用 electron-squirrel-startup 來處理 Windows 安裝程式的捷徑建立和移除
- 支援熱重載（Hot Reload）
- 使用 React 框架作為渲染層，支援 JSX/TSX
- dependencies 與 devDependencies 的區別：
  - React 和 React DOM 應放在 dependencies 中，因為它們是運行時依賴
  - 類型定義和開發工具應放在 devDependencies 中


## 除錯指南

本專案提供了完整的 VSCode/Cursor 除錯配置，可以輕鬆地對 Electron 應用進行除錯。

### 除錯配置

在 `.vscode/launch.json` 中定義了幾種除錯配置：

1. **Electron: Main** - 用於除錯主進程
2. **Electron: Renderer** - 用於除錯渲染進程
3. **Electron: All** - 同時除錯主進程和渲染進程
4. **Electron: Forge Package** - 用於除錯打包過程
5. **Electron: Forge Make** - 用於除錯發布過程

### 使用方法

1. 在 VSCode/Cursor 中按下 F5 或點擊除錯面板中的運行按鈕
2. 選擇要使用的除錯配置（推薦使用 "Electron: All"）
3. 應用會在除錯模式下啟動，可以設置斷點、檢查變數等

### TypeScript 除錯支援

為了確保能夠在 TypeScript 檔案中設置斷點並進行除錯，本專案已進行以下配置：

1. **SourceMap 生成**：
   - 在 `vite.main.config.ts`, `vite.preload.config.ts` 和 `vite.renderer.config.ts` 中啟用了 `sourcemap: true`
   - `tsconfig.json` 中設置了 `"sourceMap": true`

2. **VSCode 除錯配置**：
   - 在 `launch.json` 中添加了 sourceMaps 相關配置
   - 設置了 `outFiles` 路徑以幫助 VSCode 找到編譯後的 JavaScript 文件
   - 配置了 `resolveSourceMapLocations` 以優化 source map 解析

3. **常見問題排查**：
   - 如果斷點仍然無法命中（顯示為「未綁定的斷點」），請嘗試重啟除錯會話
   - 確保在啟動除錯前已經運行了完整的構建（有時候熱重載可能導致源碼映射不完整）
   - 在某些情況下，可能需要手動更新 `.vite/build` 目錄中的文件（通過重新運行 `npm start`）

### 注意事項

- 如果遇到 "Waiting for preLaunchTask 'Start Vite Dev'..." 的提示，這是正常的，系統正在等待 Vite 開發伺服器啟動
- 除錯模式下會同時開啟兩個視窗：一個是應用視窗，另一個是 Chrome 開發者工具視窗
- 可以在 `.vscode/tasks.json` 中修改啟動任務的配置
- 在除錯過程中修改代碼會觸發熱重載，但某些情況下可能需要手動重新啟動應用