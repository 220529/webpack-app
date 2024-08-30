import React, { useEffect, useState } from "react";

const App = () => {
  const [state, setState] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setState((state) => state + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <span onClick={() => setState((c) => c + 1)}>Count: {state}</span>;
};

export default App;
