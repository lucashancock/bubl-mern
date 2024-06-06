// Bubls.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Banner2 from './Banner2';
import BublsTest from './Bublstest';
import BublHeader from './BublHeader';

function Bubls({ username }) {
  const [bubls, setBubls] = useState([]);
  const [error, setError] = useState('');

  const handleGetBubls = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/mybubls', 
        {}, 
        { headers: { Authorization: token } }
      );
      setBubls(response.data);
      setError('');
    } catch (error) {
      setError('Error getting your bubls.');
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleGetBubls();
    }, 1000); // Refreshed the bubls page every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
    <p>{error}</p>
    <Banner2 />    
    <BublHeader username={username}/>
    <BublsTest items={bubls}/>
    </>
  );
}

export default Bubls;