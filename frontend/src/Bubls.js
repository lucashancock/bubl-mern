// Bubls.js

import React from 'react';
import { Link } from 'react-router-dom';

function Bubls() {
  const handleSignOut = () => {
    localStorage.removeItem('token');
    // Redirect to the login page or any other page after signout
    window.location.href = '/login'; // Redirect to login page after signout
  };

  return (
    <div>
      <button onClick={handleSignOut}>Sign Out</button>
      <br />
      <Link to="/profile">Profile</Link>
      <h1>Your Bubls:</h1>
      {/* Add content for the Bubls page here */}
    </div>
  );
}

export default Bubls;
