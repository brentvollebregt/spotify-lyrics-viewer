import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

const App: React.FC = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/ping')
      .then(r => r.text())
      .then(msg => setMessage(msg));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div>{message}</div>
      </header>
    </div>
  );
}

export default App;
