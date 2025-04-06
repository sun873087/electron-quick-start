import React from 'react';
import './MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="main-layout">
      <header className="header">
        <h1>Electron + React + TypeScript + Vite</h1>
      </header>
      <main className="content">
        {children}
      </main>
      <footer className="footer">
        <p className="read-the-docs">
          點擊 Electron 圖示以了解更多
        </p>
      </footer>
    </div>
  );
};

export default MainLayout; 