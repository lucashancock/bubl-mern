import React, { useState, useEffect } from "react";
import axios from "axios";
import { hostname } from "./App";
import toast, { Toaster } from "react-hot-toast";

function OptionsMenuRequests({ handleGetBubls, bubl_id }) {
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
      toast.error("Error occurred fetching requests. Try again later.");
    }
  };

  const acceptRequest = async (email) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        `http://${hostname}:3000/acceptrequest`,
        { bubl_id, email },
        { headers: { Authorization: token } }
      );
      fetchRequests();
      handleGetBubls();
      toast.success("Successfuly accepted request.");
    } catch (error) {
      toast.error("Error occurred accepting request.");
    }
  };

  const rejectRequest = async (email) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        `http://${hostname}:3000/rejectrequest`,
        { bubl_id, email },
        { headers: { Authorization: token } }
      );
      fetchRequests();
      handleGetBubls();
      toast.success("Successfully rejected request.");
    } catch (error) {
      console.log(error);
      toast.error("Error occurred rejecting request.");
    }
  };

  useEffect(() => {
    // Fetch data using Axios
    fetchRequests();
  }, []); // Empty dependency array ensures useEffect runs once on component mount

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
      {emails.length === 0 ? (
        <>
          <div className="m-2 border rounded-2xl text-center p-3">
            no requests found!
          </div>
        </>
      ) : (
        <>
          <div className="m-3 border rounded-2xl p-3">
            {emails.map((email, index) => (
              <div key={index} className="flex w-full h-full rounded-2xl my-2">
                <div className="flex py-1 px-2 border rounded-2xl flex-grow">
                  {email}
                </div>
                <button
                  className="flex-initial w-40 h-full"
                  onClick={() => acceptRequest(email)}
                >
                  <div className="flex-1 mx-2 bg-black text-white  py-1 border rounded-2xl items-center justify-center">
                    accept
                  </div>
                </button>
                <button
                  className="flex-initial w-36 h-full"
                  onClick={() => rejectRequest(email)}
                >
                  <div className=" flex-1  bg-white text-black py-1 border rounded-2xl items-center justify-center">
                    reject
                  </div>
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default OptionsMenuRequests;
