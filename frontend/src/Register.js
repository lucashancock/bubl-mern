import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Banner from "./Components/Banner";
import { hostname } from "./App";
import { useLocation } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");
  const bubl_id = query.get("bubl_id");

  const handleRegister = async () => {
    try {
      const response = await axios.post(`http://${hostname}:3000/register`, {
        username,
        password,
        email,
        token,
        bubl_id,
      });
      setMessage(response.data.message + ". Redirecting to Login page.");
      setError("");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      setMessage("");
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <>
      <Banner />
      <div className="container mt-3 p-0 rounded-lg">
        <span
          href="/"
          className="flex items-center w-max font-bold hover:bg-gray-300 rounded-2xl px-2 pr-4 py-1 ml-3 transition duration-300 ease-in-out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
          <Link to="/">back to home</Link>
        </span>
      </div>

      <div className="h-full mt-24 flex justify-center items-center">
        <div className="container w-1/2 min-w-max border border-gray-300 rounded-md p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
          <form className="space-y-6">
            <div className="mb-10">
              <h3 className="text-3xl font-extrabold">register</h3>
            </div>
            <div>
              <label className="text-sm mb-2 block">username</label>
              <div className="relative flex items-center">
                <input
                  name="username"
                  type="text"
                  required
                  className="w-full text-sm border border-gray-300 px-4 py-3 rounded-md outline-[#333]"
                  placeholder="enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-sm mb-2 block">password</label>
              <div className="relative flex items-center">
                <input
                  className="w-full text-sm border border-gray-300 px-4 py-3 rounded-md outline-[#333]"
                  type="password"
                  placeholder="enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-sm mb-2 block">email</label>
              <div className="relative flex items-center">
                <input
                  className="w-full text-sm border border-gray-300 px-4 py-3 rounded-md outline-[#333]"
                  type="email"
                  placeholder="enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="!mt-10">
              <button
                type="button"
                className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-[#333] hover:bg-black focus:outline-none"
                onClick={handleRegister}
              >
                register
              </button>
            </div>
            <p className="text-sm !mt-10 text-center">
              have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:underline ml-1 whitespace-nowrap"
              >
                log in here
              </a>
            </p>
          </form>
        </div>
      </div>
      <div className="mt-5 text-red-500 text-center">
        {error && <p>{error}</p>}
        {message && <p>{message}</p>}
      </div>
    </>
  );
}

export default Register;
