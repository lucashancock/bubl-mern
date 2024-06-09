// Bubls.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Banner2 from './Banner2';
import BublsTest from './Bublstest';
import BublHeader from './BublHeader';
import { hostname } from './App';

function Bubls() {
  const [bubls, setBubls] = useState([]);
  const [error, setError] = useState('');
  const [displayName, setDisplayName] = useState('loading...');

  const handleGetBubls = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`http://${hostname}:3000/mybubls`, 
        {}, 
        { headers: { Authorization: token } }
      );
      setBubls(response.data.bubls_profile);
      setDisplayName(response.data.displayName);
      setError('');
    } catch (error) {
      setError('Error getting your bubls.');
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleGetBubls();
    }, 1000); // Refreshed the bubls page every 1 second(s)
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
    <p>{error}</p>
    <Banner2 />    
    <BublHeader username={displayName}/>
    <BublsTest items={bubls}/>
    </>
  );
}

export default Bubls;