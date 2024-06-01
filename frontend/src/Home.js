// Home.js

import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>bubl.</h1>
      <h2>The photo sharing app made for you</h2>
      <Link to="/login">Login</Link>
      <br />
      <Link to="/register">Register</Link>
      {/* Add content for the home page here */}
    </div>
  );
}

export default Home;
