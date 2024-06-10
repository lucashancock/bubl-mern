import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { hostname } from "./App";

function OptionsMenuLeave({ bubl_id }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLeave = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://${hostname}:3000/bublleave`,
        { bubl_id: bubl_id },
        { headers: { Authorization: token } }
      );

      if (response.status === 200) {
        setError("");
        navigate("/bubls");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("couldnt leave bubl. try again.");
      }
    }
  };

  return (
    <div className="m-2">
      <button
        className="bg-gray-400 text-white text-base rounded-full w-full py-1 outline-2 hover:bg-red-600 hover:text-white transition duration-300"
        onClick={handleLeave}
      >
        leave bubl
      </button>
      {error && <div className="text-center mt-2">{error}</div>}
    </div>
  );
}

export default OptionsMenuLeave;
