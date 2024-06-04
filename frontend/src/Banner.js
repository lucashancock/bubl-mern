// src/Banner.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Banner() {
  const [IsLoggedIn, setIsLoggedIn] = useState(false);


  return (
    <div className="bg-black text-white w-full top-0 drop-shadow-md">
      <div className="flex justify-between">
        <div className='flex justify-between space-x-5 items-center ml-4 m-3 min-w-max'>
          <h1 className="text-xl font-bold m-0">bubl.</h1>
          <h2 className="text-sm m-0">the photo sharing app made for you.</h2>
        </div>
        <nav className ="flex items-center mr-4">
          <ul className="flex space-x-4">
            <li>
              <Link to='/login'>
                <div className="py-1 px-2 text-center bg-white w-44 text-black hover:bg-gray-300 transition duration-200 rounded-xl min-w-max">
                  login
                </div>
              </Link>
            </li>
            <li>
              <Link to='/register'>
                <div className="py-1 px-2 text-center bg-white w-44 text-black hover:bg-gray-300 transition duration-200 rounded-xl min-w-max">
                  register
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Banner;
