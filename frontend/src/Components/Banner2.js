// src/Banner.js
import React from "react";
import { Link } from "react-router-dom";

function Banner2() {
  const handleSignOut = () => {
    sessionStorage.removeItem("token");
    // Redirect to the login page or any other page after signout
    window.location.href = "/login"; // Redirect to login page after signout
  };

  return (
    <div className="bg-black text-white w-full top-0 drop-shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center p-4">
        <div className="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0 md:space-x-5 items-center">
          <h1 className="text-xl font-bold">bubl.</h1>
          <h2 className="text-sm min-w-max">
            the photo sharing app made for you.
          </h2>
        </div>
        {/* <nav className ="flex flex-col md:flex-row items-center mt-2 md:mt-0 w-full md:w-auto space-y-2 md:space-y-0 md:space-x-4">
          <ul className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-4">
            <li className="w-full md:w-auto">
              <Link to="/profile">
                <div className='py-1 px-2 w-full md:w-44 text-center bg-white text-black hover:bg-gray-300 transition duration-200 rounded-xl'>
                  profile
                </div>
              </Link>
            </li>
            <li>
              <button className = "w-full md:w-auto"onClick={handleSignOut}>
                <div className="py-1 px-2 text-center bg-white w-full md:w-44 text-black hover:bg-gray-300 transition duration-200 rounded-xl">
                 log out
                </div>
              </button>
            </li>
          </ul>
        </nav> */}
      </div>
    </div>
  );
}

export default Banner2;
