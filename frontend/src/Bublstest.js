import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CreateJoinModal from './CreateJoinModal';

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
    }, 1500);

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
                <div key={index} className="bg-white rounded-3xl border flex items-center justify-center aspect-[3/4] drop-shadow-xl transition duration-300 transform hover:drop-shadow-lg">
                  <div className="p-4">
                    {item.bubl_id === "addorjoincard" ? (
                      <button className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full hover:bg-gray-300 hover:w-20 hover:h-20 transform transition-all duration-300" onClick={openModal}>
                        <span className="text-2xl font-bold text-gray-700">+</span>
                      </button>
                    ) : (
                      <>
                        <strong>{item.name}</strong>
                        <ul>
                          <li>Bubl Id: {item.bubl_id}</li>
                          <li>Role: {item.role}</li>
                          <li>Members: [ {item.members} ]</li>
                          <li>Admins: [ {item.admins} ]</li>
                          <li>Start Date: {item.start_date}</li>
                          <li>End Date: {item.end_date}</li>
                          <li>
                            <Link to={`/gallery/${item.bubl_id}`}><span className="text-red-500">Look Inside!</span></Link>
                          </li>
                        </ul>
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
