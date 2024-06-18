import React, { useState, useEffect } from "react";
import axios from "axios";
import { hostname } from "./App";
import toast, { Toaster } from "react-hot-toast";

function OptionsMenuMembers({ bubl_id }) {
  const [members, setMembers] = useState([]);
  const [admins, setAdmins] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://${hostname}:3000/bublmembers`,
        { bubl_id: bubl_id },
        { headers: { Authorization: token } }
      );
      setMembers(response.data.members);
      setAdmins(response.data.admins);
    } catch (error) {
      console.log("Error occurred fetching members.");
      toast.error("Error fetching members. Try again later.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
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
      <span className="m-2 font-semibold">people in this bubl:</span>
      <div className="m-2 border rounded-2xl p-3">
        <div>
          <h1 className="font-semibold">admins:</h1>
          <ul>
            {admins.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h1 className="font-semibold">members:</h1>
          <ul>
            {members.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default OptionsMenuMembers;
