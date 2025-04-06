# 專案推薦擴展說明

本文件描述了 `.vscode/extensions.json` 中推薦的所有 VSCode/Cursor 擴展及其用途。

## 開發工具類

- **dbaeumer.vscode-eslint**：ESLint 支援，用於代碼品質檢查，確保代碼風格一致性
- **esbenp.prettier-vscode**：Prettier 代碼格式化工具，自動格式化 JavaScript、TypeScript、CSS 等
- **ms-vscode.vscode-typescript-tslint-plugin**：TypeScript 語法檢查工具
- **editorconfig.editorconfig**：EditorConfig 支援，確保團隊代碼風格一致

## React & TypeScript 擴展

- **dsznajder.es7-react-js-snippets**：React 代碼片段，提高開發效率
- **burkeholland.simple-react-snippets**：簡單的 React 代碼片段
- **mgmcdermott.vscode-language-babel**：Babel JavaScript 支援，更好地處理 JSX/TSX 語法
- **xabikos.JavaScriptSnippets**：JavaScript 代碼片段

## Electron 相關

- **ms-vscode.electron-debug**：Electron 應用程式除錯工具，方便直接在 VSCode 中除錯 Electron 應用

## 輔助工具

- **formulahendry.auto-rename-tag**：自動重命名配對的 HTML/XML/JSX 標籤
- **christian-kohler.path-intellisense**：路徑自動完成工具，輸入文件路徑時提供建議
- **naumovs.color-highlight**：顯示 CSS 顏色預覽，直接在編輯器中看到顏色效果
- **streetsidesoftware.code-spell-checker**：拼寫檢查工具，避免變量名稱或註釋中的拼寫錯誤
- **mikestead.dotenv**：.env 檔案語法高亮，環境變數管理
- **PKief.material-icon-theme**：文件圖標主題，為不同檔案類型顯示專屬圖示

## 團隊協作與版本控制

- **eamodio.gitlens**：Git 增強工具，提供更詳細的 Git 信息，查看文件的修改歷史
- **mhutchie.git-graph**：Git 圖形介面，視覺化提交歷史
- **gruntfuggly.todo-tree**：TODO 注釋高亮與導航，快速找到待辦事項

## 安裝方式

這些擴展可以通過以下方式安裝：

1. 使用專案提供的 `open-ide.sh` 腳本，會自動將擴展安裝到 `.vscode/extensions` 目錄
2. 在 VSCode/Cursor 中打開專案後，會提示安裝推薦的擴展
3. 手動在擴展面板中搜索並安裝

## 注意事項

- `coenraads.bracket-pair-colorizer-2` 已被 VSCode 內建的括號配對功能取代，但仍保留在列表中以兼容舊版 VSCode
- 如果擴展有衝突或導致性能問題，可以有選擇性地禁用部分擴展 