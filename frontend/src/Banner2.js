// src/Banner.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom'


function Banner2() {
  const [IsLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    // Redirect to the login page or any other page after signout
    window.location.href = '/login'; // Redirect to login page after signout
  };

  return (
    <div className="bg-black text-white w-full top-0 drop-shadow-md">
      <div className="flex justify-between">
        <div className='flex justify-between space-x-5 items-center m-3 min-w-max'>
          <h1 className="text-xl font-bold m-0">bubl.</h1>
          <h2 className="text-sm m-0">the photo sharing app made for you.</h2>
        </div>
        <nav className ="flex items-center mr-4">
          <ul className="flex space-x-4">
            <li>
              <Link to="/profile">
                <div className='py-1 px-2 w-44 text-center  bg-white text-black hover:bg-gray-300 transition duration-200 rounded-xl min-w-max'>
                  profile
                </div>
              </Link>
            </li>
            <li>
              <button onClick={handleSignOut}>
                <div className="py-1 px-2 w-44 text-center bg-white text-black hover:bg-gray-300 transition duration-200 rounded-xl min-w-max">
                 log out
                </div>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Banner2;
