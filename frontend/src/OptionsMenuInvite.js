import React, { useState, useEffect } from "react";
import { hostname } from "./App";
import axios from "axios";

function OptionsMenuInvite({ bubl_id }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");
  const [link, setLink] = useState("");

  const fetchRole = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://${hostname}:3000/getrole`,
        { bubl_id: bubl_id },
        { headers: { Authorization: token } }
      );
      setRole(response.data.role);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage("Error getting your role. Try again later.");
      }
    }
  };

  useEffect(() => {
    fetchRole();
  }, []);

  const handleInvite = async () => {
    if (!email || !bubl_id) {
      setMessage("All fields are required");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://${hostname}:3000/invite`,
        { email: email, bubl_id: bubl_id },
        { headers: { Authorization: token } }
      );
      setMessage("Successful invite");
      console.log(response.data.link + "Frontend");
      setLink(response.data.link);
    } catch (error) {
      setLink("");
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage("Registration failed. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="m-2 border rounded-2xl p-3">
        <div className="flex flex-col items-center ">
          <div className="w-full drop-shadow-none">
            <input
              className="w-full border m-1 rounded-2xl px-3 py-2"
              type="email"
              placeholder="enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="w-full">
            <button
              className="m-2 w-full px-3 py-2 bg-black text-white rounded-2xl"
              onClick={handleInvite}
            >
              invite
            </button>
          </div>
          {message && <p>{message}</p>}
        </div>
        <div className="flex w-5/6 ml-4 rounded-full">
          {link && (
            <>
              <span className="mr-2 mb-2">
                eventually share this link with receiver thru email:
              </span>
              <a
                className="text-blue-500 underline underline-offset-2"
                href={link}
              >
                link
              </a>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default OptionsMenuInvite;
