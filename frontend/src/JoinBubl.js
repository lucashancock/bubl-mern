import React, { useState } from "react";
import axios from "axios";
import { hostname } from "./App";
import toast from "react-hot-toast";

function JoinBubl({ onSuccess }) {
  const [bubl_id, setBublId] = useState("");

  const handleJoinBubl = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://${hostname}:3000/bubljoin`, // response not used as of now
        { bubl_id: bubl_id },
        { headers: { Authorization: token } }
      );
      // If join is successful, invoke onSuccess callback
      if (response.data.message === "requested") {
        toast.success("Requested to join private bubl.");
      } else {
        toast.success("Successfuly joined bubl!");
        onSuccess();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Error joining bubl. Please try again.");
      }
    }
  };

  return (
    <>
      <form onSubmit={handleJoinBubl} className="h-full flex flex-col">
        <div className="flex flex-col m-3 border bg-white p-4 rounded-3xl transition duration-300 transform hover:drop-shadow-lg">
          <div className="mb-4">
            <label htmlFor="bublId" className="block mb-2">
              bubl id:
            </label>
            <input
              id="bublId"
              className="w-full p-2 px-3 border rounded-2xl"
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
        </div>
      </form>
    </>
  );
}

export default JoinBubl;
