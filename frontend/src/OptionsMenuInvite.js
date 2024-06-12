import React, { useState, useEffect } from "react";
import { hostname } from "./App";
import axios from "axios";

function OptionsMenuInvite({ bubl_id }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");

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
      await axios.post(
        `http://${hostname}:3000/invite`,
        { email: email, bubl_id: bubl_id },
        { headers: { Authorization: token } }
      );
      setMessage("Successful invite");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div>
      <div className="font-semibold ml-2 ">invite to this bubl:</div>
      {role === "creator" || role === "admin" ? (
        <>
          <div className="flex items-center">
            <div className="flex-grow">
              <input
                className="w-full border m-1 rounded-2xl px-3 py-1"
                type="email"
                placeholder="enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex ml-1">
              <button
                className="m-2 px-3 py-1 bg-black text-white rounded-2xl"
                onClick={handleInvite}
              >
                invite
              </button>
            </div>
            {message && <p>{message}</p>}
          </div>
        </>
      ) : (
        <>
          <div className="m-2 border p-3 rounded-2xl">
            you cannot invite anyone to this bubl. you are not a creator nor
            admin.
          </div>
        </>
      )}
    </div>
  );
}

export default OptionsMenuInvite;
