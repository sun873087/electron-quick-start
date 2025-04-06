import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';

const App = () => {
  // 应用主题状态
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    // 初始化时从偏好设置加载主题
    const loadThemePreference = async () => {
      try {
        const savedTheme = await window.electron.preferences.get<'light' | 'dark' | 'system'>('theme', 'system');
        setTheme(savedTheme);
        applyTheme(savedTheme);
      } catch (error) {
        console.error('加载主题偏好设置失败:', error);
      }
    };

    loadThemePreference();

    // 监听主题变更事件（如果实现了主题切换功能）
    const cleanup = window.electron.on('app:theme-changed', (newTheme: 'light' | 'dark' | 'system') => {
      setTheme(newTheme);
      applyTheme(newTheme);
    });

    return cleanup;
  }, []);

  // 应用主题到DOM
  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    const root = window.document.documentElement;
    
    if (theme === 'system') {
      // 使用系统主题
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      // 使用用户指定主题
      root.classList.toggle('dark', theme === 'dark');
    }
  };

  // 窗口控制
  const minimizeWindow = () => {
    window.electron.window.minimize();
  };

  const maximizeWindow = () => {
    window.electron.window.maximize();
  };

  const closeWindow = () => {
    window.electron.window.close();
  };

  return (
    <>
      {/* 窗口控制按钮 */}
      <div className="fixed top-0 right-0 p-2 flex gap-2 z-50">
        <button 
          onClick={minimizeWindow}
          className="w-5 h-5 flex items-center justify-center rounded-full bg-yellow-400 hover:bg-yellow-500"
          title="最小化"
        >
          <span className="sr-only">最小化</span>
          <span className="inline-block w-2 h-0.5 bg-yellow-900 opacity-0 group-hover:opacity-100"></span>
        </button>
        
        <button 
          onClick={maximizeWindow}
          className="w-5 h-5 flex items-center justify-center rounded-full bg-green-400 hover:bg-green-500"
          title="最大化"
        >
          <span className="sr-only">最大化</span>
          <span className="inline-block w-2 h-2 border border-green-900 opacity-0 group-hover:opacity-100"></span>
        </button>
        
        <button 
          onClick={closeWindow}
          className="w-5 h-5 flex items-center justify-center rounded-full bg-red-400 hover:bg-red-500"
          title="關閉"
        >
          <span className="sr-only">關閉</span>
          <span className="inline-block w-2 h-2 opacity-0 group-hover:opacity-100 relative">
            <span className="absolute w-2.5 h-0.5 bg-red-900 transform rotate-45 translate-x-[-4px] translate-y-[3px]"></span>
            <span className="absolute w-2.5 h-0.5 bg-red-900 transform -rotate-45 translate-x-[-4px] translate-y-[3px]"></span>
          </span>
        </button>
      </div>
      
      {/* 應用路由 */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* 可添加更多路由 */}
        </Routes>
      </Router>
    </>
  );
};

export default App;