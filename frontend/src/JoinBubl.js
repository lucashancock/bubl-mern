import React, { useState, useEffect } from "react";
import axios from "axios";
import { hostname } from "./App";
function JoinBubl({ onSuccess }) {
  const [bubl_id, setBublId] = useState("");
  const [error, setError] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    let timer;

    if (error) {
      // Show the error message
      setShowMessage(true);

      // Set a timer to hide the message after 5 seconds
      timer = setTimeout(() => {
        setShowMessage(false);
        setError("");
      }, 5000);
    }

    // Clear the timer when the component unmounts or when the message disappears
    return () => clearTimeout(timer);
  }, [error]);

  const handleJoinBubl = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        `http://${hostname}:3000/bubljoin`, // response not used as of now
        { bubl_id: bubl_id },
        { headers: { Authorization: token } }
      );
      // If join is successful, invoke onSuccess callback
      onSuccess();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleJoinBubl} className="h-full flex flex-col">
      <div className="flex flex-col m-3 drop-shadow-xl bg-white p-3 rounded-3xl transition duration-300 transform hover:drop-shadow-lg">
        <div className="mb-4">
          <label htmlFor="bublId" className="block mb-2">
            bubl id:
          </label>
          <input
            id="bublId"
            className="w-full p-2 border rounded"
            type="text"
            placeholder="join bubl id"
            value={bubl_id}
            onChange={(e) => setBublId(e.target.value)}
          />
        </div>
        <div className="mt-auto">
          <button
            type="submit"
            className="bg-black text-white py-2 px-4 w-full rounded-xl hover:bg-gray-800 transition duration-300"
          >
            join bubl
          </button>
        </div>
        {showMessage && (
          <p className="text-center text-red-400 mt-3">{error}</p>
        )}
      </div>
    </form>
  );
}

export default JoinBubl;
