import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Bubls from './Bubls';
import Profile from './Profile';
import Gallery from './Gallery';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  const handleLogin = (token, username) => {
    setToken(token);
    setUsername(username);
    console.log("username: " + username);
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
  };

  const handleLogout = () => {
    setToken('');
    setUsername('');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setToken(token);
      setUsername(localStorage.getItem('username') || '');
    }
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={token ? <Navigate to="/bubls" username={username}/> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bubls" element={token ? <Bubls username={username} /> : <Navigate to="/login" />} />
        <Route path="/profile" element={token ? <Profile onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/gallery/:bubl_id" element={<Gallery />} /> 
      </Routes>
    </Router>
  );
}

export default App;
