import React, { useState, useEffect } from "react";
import axios from "axios";
import { hostname } from "./App";

function InvitesDisplay() {
  const [invites, setInvites] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `http://${hostname}:3000/usersinvites`,
          {
            headers: {
              Authorization: token, // Add token if needed
            },
          }
        );
        setInvites(response.data);
      } catch (error) {
        if (error.response) {
          setMessage(error.response.data.message || "Failed to fetch invites");
        } else {
          setMessage("An error occurred while fetching invites");
        }
        console.error("Error:", error);
      }
    };

    fetchInvites(); // Initial fetch

    const interval = setInterval(fetchInvites, 1500); // Set interval to 1.5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handleAccept = async (bubl_id) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://${hostname}:3000/acceptinvite`,
        { bubl_id },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log(response.data.message); // Log success message
      // Optionally, update UI to reflect acceptance
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
  };

  const handleReject = async (bubl_id) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://${hostname}:3000/rejectinvite`,
        { bubl_id },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log(response.data.message); // Log success message
      // Optionally, update UI to reflect rejection
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {loading ? (
        <div className="mt-24">
          <div className="flex items-center justify-between bg-white py-5 px-4">
            <div className="border-t border-gray-600 flex-grow"></div>
            <div className="mx-4 text-xl font-semibold">loading invites...</div>
            <div className="border-t border-gray-600 flex-grow"></div>
          </div>
          <div className="flex justify-center items-start mt-10">
            <div className="animate-pulse rounded-full h-12 w-12 bg-gray-300"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-24">
            <div className="flex items-center justify-between bg-white py-5 px-4">
              <div className="border-t border-gray-600 flex-grow"></div>
              <div className="mx-4 text-xl font-semibold">invites</div>
              <div className="border-t border-gray-600 flex-grow"></div>
            </div>
            <div className="mx-6">
              {invites.length > 0 ? (
                invites.map((invite) => (
                  <>
                    <div className="items-center m-2 flex flex-initial justify-between">
                      <div className="flex items-center h-min flex-grow mr-1 px-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300">
                        <div className="flex-grow font-semibold">
                          <span>{invite.invitor}</span>
                          <span className="text-gray-400 font-normal mx-2">
                            invited you to
                          </span>
                          <span>{invite.name}</span>
                        </div>
                      </div>
                      <div>
                        <button
                          className="relative flex ml-1 mr-1 items-center px-2 py-2 border border-black rounded-full focus:outline-none transition-all duration-300 group"
                          onClick={() => handleAccept(invite.bubl_id)}
                        >
                          <span className="material-symbols-outlined transition-all duration-300">
                            check
                          </span>
                          <span className="opacity-0 w-0 text-white transition-all duration-300 group-hover:w-20 group-hover:opacity-100 group-hover:text-black">
                            <span>accept</span>
                          </span>
                        </button>
                      </div>
                      <div>
                        <button
                          className="relative flex items-center px-2 py-2 ml-2 bg-red-600 text-white rounded-full focus:outline-none transition-all duration-300 group"
                          onClick={() => handleReject(invite.bubl_id)}
                        >
                          <span className="material-symbols-outlined transition-all duration-300">
                            close
                          </span>
                          <span className="opacity-0 w-0 transition-all duration-300 group-hover:w-20 group-hover:opacity-100">
                            reject
                          </span>
                        </button>
                      </div>
                    </div>
                  </>
                ))
              ) : (
                <div className="text-center w-full font-semibold text-gray-500 opacity-70 mt-5">
                  no invites found
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default InvitesDisplay;
