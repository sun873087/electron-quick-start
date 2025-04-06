# Electron 專案除錯配置說明

本文檔說明專案中 `.vscode/launch.json` 與 `.vscode/tasks.json` 的配置及使用方法，用於 Electron + React + TypeScript + Vite 專案的除錯。

## launch.json 配置說明

`launch.json` 檔案定義了 VSCode/Cursor 中的除錯配置，用於除錯不同部分的 Electron 應用程式。

### 主要除錯配置

1. **Electron: All** (複合配置)
   - 同時啟動主進程和渲染進程的除錯
   - 最常用的整合性除錯方式
   - 使用方式：在除錯面板選擇此配置後按 F5 開始除錯

2. **Electron: Main**
   - 僅針對 Electron 主進程 (main.ts) 的除錯
   - 設定 `--remote-debugging-port=9223` 以允許渲染進程遠端除錯
   - 在啟動前自動運行 `Start Vite Dev` 任務

3. **Electron: Renderer**
   - 針對 React 渲染進程的除錯
   - 連接到主進程開啟的除錯端口 (9223)
   - 支援在 React 代碼中設置斷點

### 打包與發佈配置

4. **Electron: Forge Package**
   - 用於除錯打包過程
   - 執行 `electron-forge package` 命令並支援除錯

5. **Electron: Forge Make**
   - 用於除錯建置發佈版本的過程
   - 執行 `electron-forge make` 命令並支援除錯

## tasks.json 配置說明

`tasks.json` 定義了與除錯相關的背景任務，配合 `launch.json` 使用。

### 主要任務

1. **Start Vite Dev**
   - 啟動 Vite 開發伺服器
   - 作為背景任務運行，為渲染進程提供熱重載功能
   - 自動監測 Vite 是否準備就緒 (`ready in ...` 輸出)

2. **Package App**
   - 執行 `npm run package` 命令
   - 將應用程式打包但不創建安裝程式

3. **Make App**
   - 執行 `npm run make` 命令
   - 建立完整的應用程式發佈包，包括安裝程式

## 如何使用除錯功能

### 基本除錯步驟

1. 在 VSCode/Cursor 中打開除錯面板 (快捷鍵 Ctrl+Shift+D 或 Cmd+Shift+D)
2. 從下拉選單中選擇 "Electron: All"
3. 按下 F5 或點擊綠色的開始按鈕開始除錯
4. 應用程式將啟動，並且可以在主進程和渲染進程中設置斷點

### 設置斷點

- 在主進程文件 (如 `src/main.ts`) 中，在行號旁邊點擊設置斷點
- 在渲染進程文件 (如 `src/renderer/App.tsx`) 中同樣可以設置斷點
- 程式執行到斷點時會暫停，可以查看變數、調用堆疊等

### 控制台輸出

- 主進程的日誌會顯示在除錯控制台中
- 渲染進程的日誌會顯示在開發者工具的控制台中 (可以通過 F12 開啟)

### 進階技巧

- 使用 Watch 視窗監視變數值
- 使用條件斷點 (右鍵點擊斷點設置條件)
- 使用 Call Stack 視窗查看調用堆疊
- 使用 logpoints 輸出日誌而不暫停程式 (右鍵點擊斷點選擇 Add Logpoint)

## 常見問題與解決方案

1. **無法連接到渲染進程**
   - 確保 `--remote-debugging-port=9223` 參數設置正確
   - 檢查防火牆是否阻擋了 9223 端口

2. **Start Vite Dev 任務無法正確啟動**
   - 確認 `package.json` 中的 start 命令設置正確
   - 檢查 endsPattern 是否匹配 Vite 的輸出

3. **Windows 平台無法啟動**
   - 確保使用了正確的 `.cmd` 副檔名
   - 檢查路徑中是否有空格或特殊字符

4. **中斷點無效**
   - 檢查源碼映射是否正確配置
   - 嘗試重新啟動除錯會話

5. **關閉視窗後又出現新視窗**
   - 這主要是 macOS 上 Electron 應用的特性，關閉視窗不會結束應用程式
   - 我們的解決方案同時適用於 macOS 和 Windows/Linux 平台
   - 修改方案：在 main.ts 添加 `isAppQuitting` 標記變數，並在 `before-quit` 事件中設置它
   - 在 `activate` 事件處理中檢查此標記，只在非退出狀態下才重新創建視窗
   - 雖然這主要解決 macOS 上的問題，但不會對 Windows 和 Linux 平台有任何負面影響
   - 代碼參考：
     ```typescript
     // 以下代碼主要解決 macOS 上的特殊問題，但對 Windows 和 Linux 平台沒有負面影響
     let isAppQuitting = false;
     
     app.on('before-quit', () => {
       isAppQuitting = true;
     });
     
     app.on('activate', () => {
       // 此事件主要在 macOS 上觸發，當點擊 dock 圖示且沒有其他視窗打開時
       if (!isAppQuitting && BrowserWindow.getAllWindows().length === 0) {
         createWindow();
       }
     });
     ```

## 自定義配置

您可以根據需要修改這些檔案以適應特定的開發環境：

- 調整 `runtimeArgs` 增加額外的 Electron 啟動參數
- 修改 `preLaunchTask` 以執行其他前置任務
- 添加更多的除錯配置以支援不同場景

## 參考資源

- [VSCode 除錯文檔](https://code.visualstudio.com/docs/editor/debugging)
- [Electron 除錯文檔](https://www.electronjs.org/docs/latest/tutorial/debugging-main-process)
- [Vite 開發伺服器配置](https://vitejs.dev/config/server-options.html) 