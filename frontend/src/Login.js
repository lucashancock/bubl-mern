// Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/login', {
        username,
        password
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      onLogin(token);
      setError('');
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <div>
      <Link to="/">Back to Home</Link>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Login;
