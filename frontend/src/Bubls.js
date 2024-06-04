// Bubls.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Banner2 from './Banner2'

function Bubls({ username }) {
  const [bubls, setBubls] = useState([]);
  const [error, setError] = useState('');
  const [newBublName, setNewBublName] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSignOut = () => {
    localStorage.removeItem('token');
    // Redirect to the login page or any other page after signout
    window.location.href = '/login'; // Redirect to login page after signout
  };

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

  const handleCreateBubl = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const currentDate = new Date().toISOString();
      const profile_id_resp = await axios.post('http://localhost:3000/idfromuser',
        { username: username },
        { headers: { Authorization: token } }
      );
      const profile_id = profile_id_resp.data;
      console.log(profile_id)
      const response = await axios.post('http://localhost:3000/bublcreate',
        {
          name: newBublName,
          creator_id: profile_id, // Assuming creator_id is the username
          start_date: currentDate,
          end_date: endDate  // Example end_date
        },
        { headers: { Authorization: token } }
      );
      setBubls([...bubls, response.data.bubl]); // Add the new bubl to the list
      setNewBublName(''); // Clear the input field
      setError('');
    } catch (error) {
      setError('Error creating new bubl.');
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
    <div>
      <h1>Welcome, {username}!</h1>
      <button onClick={handleSignOut}>Sign Out</button>
      <br />
      <Link to="/profile">Profile</Link>
      <h1>Your Bubls:</h1>
      {error && <p>{error}</p>}
      {bubls.length === 0 ? 
        (<p>Loading... / No bubls found.</p>) 
        : 
        (<ul>
          {bubls.map(bubl => (
            <li key={bubl.bubl_id}>
              <strong>{bubl.name}</strong>
              <br />
              Bubl Id: {bubl.bubl_id}
              <br />
              Members: [ {bubl.members} ]
              <br />
              Admins: [ {bubl.admins} ]
              <br />
              Start Date: {bubl.start_date}
              <br />
              End Date: {bubl.end_date}
              <br />
              <Link to={`/gallery/${bubl.bubl_id}`}>Look Inside!</Link>
            </li>
          ))}
        </ul>)}
      <h2>Create a New Bubl:</h2>
      <form onSubmit={handleCreateBubl}>
        <input
          type="text"
          placeholder="Bubl Name"
          value={newBublName}
          onChange={(e) => setNewBublName(e.target.value)}
        />
        <input
          type="datetime-local"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required // Make end date field required
        />
        <button type="submit">Create Bubl</button>
      </form>
    </div>
    </>
  );
}

export default Bubls;