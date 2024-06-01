import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:3000/register', {
        username,
        password,
        email
      });
      setMessage(response.data.message + ". Redirecting to Login page.");
      setError('');

      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);

    } catch (error) {
      setMessage('');
      setError("Registration failed.");
    }
  };

  return (
    <div>
      <Link to="/">Back to Home</Link>
      <h2>Register</h2>
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
      <input
        type="email"
        placeholder="Email (optional)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default Register;
