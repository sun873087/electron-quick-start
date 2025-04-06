import React from 'react';
import Counter from '../../components/Counter';
import EnvironmentInfo from '../../components/EnvironmentInfo';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <h2>歡迎使用</h2>
      <Counter />
      <EnvironmentInfo />
    </div>
  );
};

export default Home; 