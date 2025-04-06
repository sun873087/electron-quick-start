import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

// 獲取渲染的目標元素
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('找不到 root 元素');
}

// 創建 React 根實例並渲染應用
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('👋 這個訊息是由 "renderer/index.tsx" 記錄的，通過 Vite 引入'); 