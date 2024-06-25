import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { hostname } from "./App";

function JoinBubl({ onSuccess }) {
  const [bubl_id, setBublId] = useState("");

  const handleJoinBubl = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://${hostname}:3000/bubljoin`,
        { bubl_id: bubl_id },
        { headers: { Authorization: token } }
      );
      if (response.data.message === "requested") {
        toast.success("Requested to join private bubl.");
      } else {
        toast.success("Successfully joined bubl!");
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
    <form onSubmit={handleJoinBubl} className="flex flex-col">
      <div className="m-3 border bg-white p-4 rounded-3xl transition duration-300 transform flex">
        <input
          id="bublId"
          className="flex flex-grow py-2 px-3 border rounded-2xl mr-2"
          type="text"
          placeholder="enter bubl id to request/join"
          value={bubl_id}
          onChange={(e) => setBublId(e.target.value)}
        />
        <button type="submit" className="bg-black text-white  px-4 rounded-2xl">
          send
        </button>
      </div>
    </form>
  );
}

export default JoinBubl;
