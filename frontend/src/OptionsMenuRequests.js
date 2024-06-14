import React, { useState, useEffect } from "react";
import axios from "axios";
import { hostname } from "./App";

function OptionsMenuRequests({ fetchUsers, bubl_id }) {
  const [emails, setProfileIds] = useState([]);

  const fetchRequests = async () => {
    // Fetch data using Axios
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://${hostname}:3000/bublrequests`,
        { bubl_id },
        { headers: { Authorization: token } }
      );
      setProfileIds(response.data);
    } catch (error) {
      console.log("error happened");
    }
  };

  const acceptRequest = async (email) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://${hostname}:3000/acceptrequest`,
        { bubl_id, email },
        { headers: { Authorization: token } }
      );
      console.log("accept successful");
      fetchRequests();
      fetchUsers();
    } catch (error) {
      console.log("error happened");
    }
  };

  const rejectRequest = async (email) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://${hostname}:3000/rejectrequest`,
        { bubl_id, email },
        { headers: { Authorization: token } }
      );
      console.log("reject successful");
      fetchRequests();
      fetchUsers();
    } catch (error) {
      console.log("error happened");
    }
  };

  useEffect(() => {
    // Fetch data using Axios
    fetchRequests();
  }, []); // Empty dependency array ensures useEffect runs once on component mount

  return (
    <>
      <span className="m-2 font-semibold">requests to join this bubl:</span>
      <div className="m-2">
        {emails.map((email, index) => (
          <div key={index} className="flex border rounded-2xl my-2">
            <div className="flex ml-2 py-1 px-2 flex-grow">{email}</div>
            <button onClick={() => acceptRequest(email)}>
              <div className="flex flex-initial mx-2 items-center justify-center">
                accept
              </div>
            </button>
            <button onClick={() => rejectRequest(email)}>
              <div className="flex flex-initial mx-4 items-center justify-center">
                reject
              </div>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default OptionsMenuRequests;
