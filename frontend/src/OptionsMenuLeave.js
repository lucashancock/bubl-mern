import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { hostname } from "./App";
import toast, { Toaster } from "react-hot-toast";

function OptionsMenuLeave({ bubl_id }) {
  const navigate = useNavigate();

  const handleLeave = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://${hostname}:3000/bublleave`,
        { bubl_id: bubl_id },
        { headers: { Authorization: token } }
      );

      if (response.status === 200) {
        navigate("/bubls");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Couldn't leave bubl. try again.");
      }
    }
  };

  return (
    <div className="m-2">
      <Toaster
        toastOptions={{
          className: "",
          success: {
            style: {
              border: "1px solid #000000",
              padding: "16px",
              color: "#000000",
            },
          },
          error: {
            style: {
              border: "1px solid #000000",
              padding: "16px",
              color: "#000000",
            },
          },
        }}
      />
      <button
        className="bg-gray-400 text-white text-base rounded-full w-full py-1 outline-2 hover:bg-red-600 hover:text-white transition duration-300"
        onClick={handleLeave}
      >
        leave bubl
      </button>
    </div>
  );
}

export default OptionsMenuLeave;
