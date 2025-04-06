# KubePilot

這是一個使用自然語言處理技術的 Kubernetes 資源管理工具，旨在簡化 Kubernetes 的資源管理和操作。它提供了聊天機器人功能，使用戶能夠通過自然語言與 Kubernetes 進行互動。用戶可以使用簡單的語句來查詢、創建、更新和刪除 Kubernetes 資源，從而提高工作效率。

```bash
src/preload/
  ├── index.ts            # 主入口
  ├── channels.ts         # 通道定義
  ├── apis/
  │   ├── base.ts         # 基本通信 API
  │   ├── window.ts       # 窗口控制 API
  │   ├── environment.ts  # 環境變數 API
  │   ├── updates.ts      # 更新相關 API
  │   └── preferences.ts  # 用戶偏好設置 API
  └── types/
      └── index.ts        # API 類型定義
```
