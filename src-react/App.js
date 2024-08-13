import React, { useEffect, useState } from 'react';

const App = () => {
  // 使用 useState 钩子来管理计数器状态
  const [count, setCount] = useState(0);

  // 处理加法操作
  const handleIncrement = () => {
    setCount(count + 1);
  };

  useEffect(() => {
    console.log("useEffect...");
  }, [])

  return (
    <div>
      {/* <span>React Hook 示例</span> */}
      <p>当前计数: {count}</p>
      <button onClick={handleIncrement}>增加</button>
    </div>
  );
};

export default App;
