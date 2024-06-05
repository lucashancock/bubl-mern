// Bubls.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Banner2 from './Banner2';
import BublsTest from './Bublstest';
import CreateBubl from './CreateBubl';
import JoinBubl from './JoinBubl';

function Bubls({ username }) {
  const [bubls, setBubls] = useState([]);
  const [error, setError] = useState('');

  const handleGetBubls = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/mybubls', 
        { username: username }, 
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
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
    <Banner2 />
    {/* Create a new Bubl */}
    <CreateBubl username={username}/>
    <JoinBubl username={username}/>
    {/* Display Bubls */}
    <BublsTest items={bubls}/>
    </>
  );
}

export default Bubls;