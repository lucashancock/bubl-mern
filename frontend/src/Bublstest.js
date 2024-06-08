import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CreateJoinModal from "./CreateJoinModal";
import CountdownTimer from "./CountdownTimer";
import { hostname } from "./App";
import axios from "axios";
import { format } from "date-fns";

function BublsTest({ items }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bannersArr, setBannersArr] = useState([]);
  const [error, setError] = useState("");
  const [dateSwitch, setDateSwitch] = useState(true);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    console.log("running");
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const deleteBubl = async (bubl_id) => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.post(
        `http://${hostname}:3000/bubldelete`,
        { bubl_id: bubl_id },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("Bubl delete successful.");
    } catch (error) {
      console.error("Bubl delete failed", error);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-start mt-10">
          <div className="animate-pulse rounded-full h-12 w-12 bg-gray-300"></div>
        </div>
      ) : (
        <>
          {items.length === 0 ? (
            <p className="text-center m-3"> No bubls found! </p>
          ) : (
            <div className="m-2">
              <div className=" w-full p-0 m-0 grid grid-cols-1 md:grid-cols-1">
                {items.map((item, index) => {
                  const banner = bannersArr.find(
                    (banner) => banner.bubl_id === item.bubl_id
                  );
                  return (
                    <div key={index} className="m-4 bg-white flex flex-col ">
                      {item.bubl_id === "addorjoincard" ? (
                        <div className="relative flex justify-center">
                          <button
                            className="relative flex items-center px-2 py-2 bg-black text-white rounded-full transition-all duration-300 group"
                            onClick={openModal}
                          >
                            <span className="material-symbols-outlined">
                              add
                            </span>
                            <span className="opacity-0 w-0 text-nowrap transition-all duration-300 group-hover:w-40 group-hover:opacity-100">
                              create or join a bubl
                            </span>
                          </button>
                        </div>
                      ) : (
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
                                  <CountdownTimer endDate={item.end_date} />
                                ) : (
                                  <p>
                                    {format(new Date(item.end_date), "PPpp")}
                                  </p>
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
                                  {item.members.length + item.admins.length}
                                </p>
                              </div>
                            </div>
                            {item.role === "creator" ? (
                              <>
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

                                <div>
                                  <button
                                    className="relative flex items-center px-2 py-2 ml-1 bg-gray-500 text-white hover:bg-red-600 rounded-full transition-all duration-300 group"
                                    onClick={() => {
                                      deleteBubl(item.bubl_id);
                                    }}
                                  >
                                    <i className="fa-solid fa-trash mx-1"></i>
                                    <span className="opacity-0 w-0 transition-all duration-300 group-hover:w-20 group-hover:opacity-100">
                                      delete
                                    </span>
                                  </button>
                                </div>
                              </>
                            ) : (
                              <div />
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {showModal && <CreateJoinModal closeModal={closeModal} />}
        </>
      )}
    </>
  );
}

export default BublsTest;
