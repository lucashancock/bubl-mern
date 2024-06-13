import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CreateJoinModal from "./CreateJoinModal";
import CountdownTimer from "./Components/CountdownTimer";
import { hostname } from "./App";
import axios from "axios";
import { format } from "date-fns";
import InvitesDisplay from "./InvitesDisplay";
import EditBublModal from "./EditBublModal";

function BublsTest() {
  const [showModal, setShowModal] = useState(false);
  const [dateSwitch, setDateSwitch] = useState(true);
  const [bubls, setBubls] = useState([]);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentBublId, setCurrentBublId] = useState(null);

  const openEditModal = (bublId) => {
    setCurrentBublId(bublId);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setCurrentBublId(null);
  };

  const handleGetBubls = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://${hostname}:3000/mybubls`,
        {},
        { headers: { Authorization: token } }
      );
      setBubls(response.data.bubls_profile);
      setError("");
    } catch (error) {
      setError("Error getting your bubls.");
    }
  };

  useEffect(() => {
    handleGetBubls(); // initial fetch
  }, []);

  const deleteBubl = async (bubl_id) => {
    const token = sessionStorage.getItem("token");
    try {
      await axios.post(
        `http://${hostname}:3000/bubldelete`,
        { bubl_id: bubl_id },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("Bubl delete successful.");
      handleGetBubls();
    } catch (error) {
      console.error("Bubl delete failed.");
    }
  };

  return (
    <>
      <div className="relative flex justify-center">
        <button
          className="relative flex items-center px-2 py-2 bg-black text-white rounded-full transition-all duration-300 group mr-2"
          onClick={() => setShowModal(true)}
        >
          <span className="material-symbols-outlined">add</span>
          <span className="opacity-0 w-0 text-nowrap transition-all duration-300 group-hover:w-40 group-hover:opacity-100">
            create or join a bubl
          </span>
        </button>
        <button
          className="relative flex items-center px-2 py-2 bg-white text-black outline outline-1 rounded-full transition-all duration-300 group ml-2"
          onClick={handleGetBubls}
        >
          <span className="material-symbols-outlined">refresh</span>
          <span className="opacity-0 w-0 text-nowrap transition-all duration-300 group-hover:w-40 group-hover:opacity-100">
            refresh bubls
          </span>
        </button>
      </div>
      <>
        {bubls.length === 0 ? (
          <div className="flex justify-center items-start mt-10">
            <div className="animate-pulse rounded-full h-12 w-12 bg-gray-300"></div>
          </div>
        ) : (
          <div className="m-2">
            <div className="w-full p-0 m-0 grid grid-cols-1 md:grid-cols-1">
              {bubls.map((item, index) => (
                <div key={index} className="m-4 bg-white flex flex-col">
                  <>
                    <div className="flex-grow">
                      <div className="flex justify-center mt-1">
                        <div className="flex items-center text-center justify-end material-symbols-outlined">
                          schedule
                        </div>
                        <div
                          className="ml-2 flex"
                          onClick={() => setDateSwitch(!dateSwitch)}
                        >
                          {dateSwitch ? (
                            <CountdownTimer
                              endDate={item.end_date}
                              bubl_id={item.bubl_id}
                            />
                          ) : (
                            <p>{format(new Date(item.end_date), "PPpp")}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="items-center m-2 flex flex-initial justify-between">
                      <div className="flex items-center h-min flex-grow mr-1 px-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300">
                        <div className="flex-grow font-semibold">
                          <span>{item.name}</span>
                          <span className="text-gray-400 font-normal ml-2">
                            {item.role}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <i className="fa-solid fa-user" />
                          <p className="font-semibold ml-2">
                            {item.members.length + item.admins.length} /{" "}
                            {item.capacity}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Link to={`/gallery/${item.bubl_id}`}>
                          <button className="relative flex ml-1 mr-1 items-center px-2 py-2 border border-black rounded-full focus:outline-none transition-all duration-300 group">
                            <span className="material-symbols-outlined transition-all duration-300">
                              arrow_forward
                            </span>
                            <span className="opacity-0 w-0 text-white transition-all duration-300 group-hover:w-20 group-hover:opacity-100 group-hover:text-black">
                              <span>enter</span>
                            </span>
                          </button>
                        </Link>
                      </div>
                      {item.role === "creator" && (
                        <div className="flex">
                          <button
                            className="relative flex items-center px-2 py-2 ml-1 bg-gray-500 text-white hover:bg-gray-700 rounded-full transition-all duration-300 group"
                            onClick={() => openEditModal(item.bubl_id)}
                          >
                            <i className="fa-solid fa-edit mx-1"></i>
                            <span className="opacity-0 w-0 transition-all duration-300 group-hover:w-20 group-hover:opacity-100">
                              edit
                            </span>
                          </button>
                          <div className="flex">
                            <button
                              className="relative flex items-center px-2 py-2 ml-1 bg-gray-500 text-white hover:bg-red-600 rounded-full transition-all duration-300 group"
                              onClick={() => deleteBubl(item.bubl_id)}
                            >
                              <i className="fa-solid fa-trash mx-1"></i>
                              <span className="opacity-0 w-0 transition-all duration-300 group-hover:w-20 group-hover:opacity-100">
                                delete
                              </span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                </div>
              ))}
            </div>
          </div>
        )}
        {showModal && (
          <CreateJoinModal
            closeModal={() => setShowModal(false)}
            handleGetBubls={handleGetBubls}
          />
        )}
        {showEditModal && (
          <EditBublModal
            closeModal={closeEditModal}
            handleGetBubls={handleGetBubls}
            bublId={currentBublId}
          />
        )}
      </>

      <InvitesDisplay handleGetBubls={handleGetBubls} />
    </>
  );
}

export default BublsTest;
