#!/bin/bash

# 設定顏色
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# 創建 VSCode 擴展目錄（如果不存在）
mkdir -p ./.vscode/extensions

# 檢查 Cursor 是否安裝
if command -v cursor &> /dev/null; then
    echo -e "${GREEN}使用 Cursor 打開專案...${NC}"
    cursor --extensions-dir=./.vscode/extensions .
    exit 0
fi

# 檢查 VSCode 是否安裝
if command -v code &> /dev/null; then
    echo -e "${GREEN}使用 VSCode 打開專案...${NC}"
    code --extensions-dir=./.vscode/extensions .
    exit 0
fi

# 如果都沒有安裝
echo -e "${RED}錯誤: 未找到 Cursor 或 VSCode。${NC}"
echo -e "請安裝以下其中一個 IDE:"
echo -e "1. Cursor: https://cursor.sh/"
echo -e "2. VSCode: https://code.visualstudio.com/"
exit 1
