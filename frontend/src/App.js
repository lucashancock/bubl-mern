// App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Bubls from './Bubls';
import Profile from './Profile';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogin = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={token ? <Navigate to="/bubls" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bubls" element={token ? <Bubls /> : <Navigate to="/login" />} />
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login"/>}/>
      </Routes>
    </Router>
  );
}

export default App;
