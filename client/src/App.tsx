import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/ping')
      .then(r => r.text())
      .then(msg => setMessage(msg));
  }, []);

  return (
    <div>
      <div>Response: {message}</div>
    </div>
  );
};

export default App;
