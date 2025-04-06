import React from 'react';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';

const App: React.FC = () => {
  return (
    <MainLayout>
      <Home />
    </MainLayout>
  );
};

export default App; 