import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CreateJoinModal from './CreateJoinModal';
// import { format } from 'date-fns';
import CountdownTimer from './CountdownTimer';
// import { hostname } from './App';

function BublsTest({ items }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const openModal = () => {
    setShowModal(true);
  }

  const closeModal = () => {
    setShowModal(false);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

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
            <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 m-3">
              {items.map((item, index) => (
                <div key={index} className="bg-white rounded-3xl border flex items-center justify-center aspect-[4/4] drop-shadow-xl transition duration-300 transform hover:drop-shadow-lg">
                  <div className="p-4">
                    {item.bubl_id === "addorjoincard" ? (
                      <button className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full hover:bg-gray-300 hover:w-20 hover:h-20 transform transition-all duration-300" onClick={openModal}>
                        <span className="text-2xl font-bold text-gray-700">+</span>
                      </button>
                    ) : (
                      <>
                      <div className="w-full flex flex-col items-center">
                        <div className="w-full">
                          <div className="flex font-semibold underline underline-offset-4">
                            <span className="flex-auto text-center">{item.name}</span>
                          </div>
                          <ul className="text-center w-full">
                            <li className="w-full mt-3">{item.role}</li>
                            <li className="w-full mt-3">{item.bubl_id}</li>
                          </ul>
                        </div>
                        <div className="w-full mt-4">
                          <CountdownTimer endDate={item.end_date} />
                        </div>
                        <div className="w-48 text-center mt-5">
                          <Link to={`/gallery/${item.bubl_id}`}>
                            <div className="bg-gray-500 rounded-xl bg-opacity-30 hover:bg-opacity-50 transition duration-300 py-1">
                              <span>view</span>
                            </div>
                          </Link>
                        </div>
                      </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {showModal && <CreateJoinModal closeModal={closeModal} />}
        </>
      )}
    </>
  );
}

export default BublsTest;
