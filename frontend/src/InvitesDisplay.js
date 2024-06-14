import React, { useState, useEffect } from "react";
import axios from "axios";
import { hostname } from "./App";

function InvitesDisplay({ handleGetBubls }) {
  const [invites, setInvites] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchInvites = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`http://${hostname}:3000/usersinvites`, {
        headers: {
          Authorization: token,
        },
      });
      setInvites(response.data);
    } catch (error) {
      setMessage(
        error.response?.data.message ||
          "An error occurred while fetching invites"
      );
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const handleInviteAction = async (bubl_id, action) => {
    try {
      const token = sessionStorage.getItem("token");
      const endpoint = action === "accept" ? "acceptinvite" : "rejectinvite";
      const response = await axios.post(
        `http://${hostname}:3000/${endpoint}`,
        { bubl_id },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response.data.message);
      fetchInvites();
      handleGetBubls();
    } catch (error) {
      console.error(`Error ${action}ing invite.`);
    }
  };

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
        <div className="mt-10">
          <div className="flex items-center justify-between bg-white py-5 px-4">
            <div className="border-t border-gray-600 flex-grow"></div>
            <div className="mx-4 text-xl font-semibold">invites</div>
            <div className="border-t border-gray-600 flex-grow"></div>
          </div>
          <div className="mx-6">
            {invites.length > 0 ? (
              invites.map((invite) => (
                <>
                  <div className="flex flex-1 text-gray-500 items-center justify-center ">
                    <button onClick={fetchInvites}>
                      <span className="material-symbols-outlined outline outline-white hover:outline-gray-500 hover:rotate-[360deg] p-2 rounded-full transition-all duration-300">
                        refresh
                      </span>
                    </button>
                  </div>
                  <div
                    key={invite.bubl_id}
                    className="items-center m-2 flex flex-initial justify-between"
                  >
                    <div className="flex items-center h-min flex-grow mr-1 px-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300">
                      <div className="flex-grow font-semibold">
                        <span>{invite.invitor_username}</span>
                        <span className="text-gray-400 font-normal mx-2">
                          invited you to
                        </span>
                        <span>{invite.bubl_name}</span>
                      </div>
                    </div>
                    <div>
                      <button
                        className="relative flex ml-1 mr-1 items-center px-2 py-2 border border-black rounded-full focus:outline-none transition-all duration-300 group"
                        onClick={() =>
                          handleInviteAction(invite.bubl_id, "accept")
                        }
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
                        onClick={() =>
                          handleInviteAction(invite.bubl_id, "reject")
                        }
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
              <>
                <div className="flex flex-col">
                  <div className="flex flex-1 text-gray-500 items-center justify-center ">
                    <button onClick={fetchInvites}>
                      <span className="material-symbols-outlined outline outline-white hover:outline-gray-500 hover:rotate-[360deg] p-2 rounded-full transition-all duration-300">
                        refresh
                      </span>
                    </button>
                  </div>
                  <div className="flex flex-1 text-center w-full font-semibold text-gray-500 opacity-70 justify-center">
                    no invites found
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default InvitesDisplay;
