import React, { useState, useEffect } from "react";
import axios from "axios";
import { hostname } from "./App";
import toast, { Toaster } from "react-hot-toast";
import Banner2 from "./Components/Banner2";
import NavMenu from "./Components/NavMenu";
import JoinBubl from "./JoinBubl";

function OptionsMenuRequests() {
  const [emails, setProfileIds] = useState([]);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

  const fetchRequests = async () => {
    // Fetch data using Axios
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://${hostname}:3000/bublrequests`,
        {},
        { headers: { Authorization: token } }
      );
      setProfileIds(response.data);
      // console.log(response.data);
    } catch (error) {
      toast.error("Error occurred fetching requests. Try again later.");
    }
  };

  const acceptRequest = async (email, bubl_id) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        `http://${hostname}:3000/acceptrequest`,
        { bubl_id, email },
        { headers: { Authorization: token } }
      );
      fetchRequests();
      toast.success("Successfuly accepted request.");
    } catch (error) {
      toast.error("Error occurred accepting request.");
    }
  };

  const rejectRequest = async (email, bubl_id) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        `http://${hostname}:3000/rejectrequest`,
        { bubl_id, email },
        { headers: { Authorization: token } }
      );
      fetchRequests();
      toast.success("Successfully rejected request.");
    } catch (error) {
      // console.log(error);
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
          <div className="flex flex-col h-screen">
            <Banner2 />
            <div className="flex flex-grow">
              <div
                className={`bg-gray-700 text-white transition-all duration-300 ${
                  isMenuExpanded ? "w-56" : "w-16"
                }`}
              >
                <NavMenu
                  isMenuExpanded={isMenuExpanded}
                  setIsMenuExpanded={setIsMenuExpanded}
                />
              </div>
              <div className="flex-col flex-grow p-4 overflow-auto">
                <div>
                  <h2 className="text-xl text-center font-bold mb-2 mt-5">
                    request to join a bubls
                  </h2>
                  <h3 className="text-sm text-center font-light opacity-70">
                    public bubls will be joined automatically, private bubls
                    will be sent a request.
                  </h3>
                </div>
                <div>
                  <JoinBubl />
                </div>
                <div className="mt-0">
                  <div className="flex items-center justify-between bg-white py-5 px-4">
                    <div className="border-t border-gray-600 flex-grow"></div>
                    <div className="mx-4 text-xl font-semibold">requests</div>
                    <div className="border-t border-gray-600 flex-grow"></div>
                  </div>
                  <div className="flex flex-1 text-gray-500 items-center justify-center ">
                    <button onClick={fetchRequests}>
                      <span className="material-symbols-outlined outline outline-white hover:outline-gray-500 hover:rotate-[360deg] p-2 rounded-full transition-all duration-300">
                        refresh
                      </span>
                    </button>
                  </div>
                  <div className="flex justify-center items-start ">
                    <span className="text-gray-500 opacity-70 font-semibold">
                      no requests found.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col h-screen">
            <Banner2 />
            <div className="flex flex-grow">
              <div
                className={`bg-gray-700 text-white transition-all duration-300 ${
                  isMenuExpanded ? "w-56" : "w-16"
                }`}
              >
                <NavMenu
                  isMenuExpanded={isMenuExpanded}
                  setIsMenuExpanded={setIsMenuExpanded}
                />
              </div>
              <div className="flex-col flex-grow p-4 overflow-auto">
                <div>
                  <h2 className="text-xl text-center font-bold mb-2 mt-5">
                    request to join a bubls
                  </h2>
                  <h3 className="text-sm text-center font-light opacity-70">
                    public bubls will be joined automatically, private bubls
                    will be sent a request.
                  </h3>
                </div>
                <div>
                  <JoinBubl />
                </div>
                <div className="flex items-center justify-between bg-white py-5 px-4">
                  <div className="border-t border-gray-600 flex-grow"></div>
                  <div className="mx-4 text-xl font-semibold">requests</div>
                  <div className="border-t border-gray-600 flex-grow"></div>
                </div>
                <div className="m-3 border rounded-2xl p-3">
                  {emails.map((email, index) => (
                    <div
                      key={index}
                      className="flex w-full h-full rounded-2xl my-2"
                    >
                      <div className="flex py-1 px-2 border rounded-2xl flex-grow">
                        <span className="mr-1 font-semibold">
                          {email.sender}
                        </span>
                        wants to join
                        <span className="ml-1 font-semibold">{email.bubl}</span>
                      </div>
                      <button
                        className="flex-initial w-40 h-full"
                        onClick={() =>
                          acceptRequest(email.sender, email.bubl_id)
                        }
                      >
                        <div className="flex-1 mx-2 bg-black text-white  py-1 border rounded-2xl items-center justify-center">
                          accept
                        </div>
                      </button>
                      <button
                        className="flex-initial w-36 h-full"
                        onClick={() =>
                          rejectRequest(email.sender, email.bubl_id)
                        }
                      >
                        <div className=" flex-1  bg-white text-black py-1 border rounded-2xl items-center justify-center">
                          reject
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default OptionsMenuRequests;
