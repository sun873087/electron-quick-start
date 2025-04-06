import React, { useState } from 'react';
import './Counter.css';

interface CounterProps {
  initialCount?: number;
}

const Counter: React.FC<CounterProps> = ({ initialCount = 0 }) => {
  const [count, setCount] = useState(initialCount);

  return (
    <div className="counter">
      <button onClick={() => setCount(count => count + 1)}>
        計數: {count}
      </button>
      <p>
        編輯 <code>src/renderer/components/Counter/Counter.tsx</code> 並儲存以測試 HMR
      </p>
    </div>
  );
};

export default Counter; 