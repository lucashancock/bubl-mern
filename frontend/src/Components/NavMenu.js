import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaUser,
  FaEnvelope,
  FaBell,
  FaSignOutAlt,
  FaCircle,
  FaWrench,
} from "react-icons/fa";

function NavMenu({ isMenuExpanded, setIsMenuExpanded }) {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const handleSignOut = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/login"; // redirect to login page after logging out
  };

  return (
    <div className="flex flex-col h-full p-2">
      <div
        className="flex items-center justify-center mt-3 mb-6 cursor-pointer"
        onClick={() => setIsMenuExpanded(!isMenuExpanded)}
      >
        <FaBars className="mx-2" />
        {isMenuExpanded && <span className="text-lg font-semibold">menu</span>}
      </div>
      <div className="flex-auto mb-4">
        <Link
          to={token ? "/bubls" : "/login"}
          className="flex items-center justify-center mb-4 hover:bg-gray-600 p-2 rounded cursor-pointer whitespace-nowrap"
        >
          <FaCircle className="mx-2" />
          {isMenuExpanded && <span>bubls</span>}
        </Link>
        <Link
          to={token ? "/invites" : "/login"}
          className="flex items-center justify-center mb-4 hover:bg-gray-600 p-2 rounded cursor-pointer whitespace-nowrap"
        >
          <FaEnvelope className="mx-2" />
          {isMenuExpanded && <span>invites</span>}
        </Link>
        <Link
          to={token ? "/requests" : "/login"}
          className="flex items-center justify-center mb-4 hover:bg-gray-600 p-2 rounded cursor-pointer whitespace-nowrap"
        >
          <FaBell className="mx-2" />
          {isMenuExpanded && <span>requests</span>}
        </Link>
        <Link
          to="/admin"
          className="flex items-center justify-center mb-4 hover:bg-gray-600 p-2 rounded cursor-pointer whitespace-nowrap"
        >
          <FaWrench className="mx-2" />
          {isMenuExpanded && <span>admin</span>}
        </Link>
        <Link
          to="/profile"
          className="flex items-center justify-center mb-4 hover:bg-gray-600 p-2 rounded cursor-pointer whitespace-nowrap"
        >
          <FaUser className="mx-2" />
          {isMenuExpanded && <span>profile</span>}
        </Link>
      </div>
      <button
        onClick={handleSignOut}
        className="flex items-center justify-center hover:bg-gray-600 p-2 rounded cursor-pointer whitespace-nowrap"
      >
        <FaSignOutAlt className="mx-2" />
        {isMenuExpanded && <span>log out</span>}
      </button>
    </div>
  );
}

export default NavMenu;
