import React, { useState, useEffect } from "react";
import CreateBubl from "./CreateBubl";
import JoinBubl from "./JoinBubl";

function CreateJoinModal({ closeModal, handleGetBubls }) {
  const [activeTab, setActiveTab] = useState("create");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => closeModal(), 300); // Duration should match the transition duration
  };

  const handleCreateSuccess = () => {
    handleClose();
    handleGetBubls();
  };

  const handleJoinSuccess = () => {
    handleClose();
    handleGetBubls();
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div
        className={`bg-white p-6 rounded-3xl shadow-lg z-10 w-full md:w-4/6 h-5/6 flex flex-col transition-transform duration-300 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
      >
        <div className="relative mb-4 flex">
          <div
            className={`absolute inset-y-0 left-0 transition-transform duration-300 ease-in-out w-1/2 bg-black rounded-2xl ${
              activeTab === "create"
                ? "transform translate-x-0"
                : "transform translate-x-full"
            }`}
          />
          <button
            onClick={() => setActiveTab("create")}
            className={`relative w-1/2 text-center py-2 transition-colors duration-300 ease-in-out z-10 ${
              activeTab === "create" ? "text-white" : "text-gray-700"
            }`}
          >
            create
          </button>
          <button
            onClick={() => setActiveTab("join")}
            className={`relative w-1/2 text-center py-2 transition-colors duration-300 ease-in-out z-10 ${
              activeTab === "join" ? "text-white" : "text-gray-700"
            }`}
          >
            join
          </button>
        </div>
        <div className="flex-grow overflow-y-auto">
          {activeTab === "create" ? (
            <div>
              <h2 className="text-xl text-center font-bold mb-2">
                create a new bubl
              </h2>
              <h3 className="text-sm text-center font-light opacity-70">
                to create a new bubl, fill out below
              </h3>

              <CreateBubl onSuccess={handleCreateSuccess} />
            </div>
          ) : (
            <div>
              <h2 className="text-xl text-center font-bold mb-2">
                join an existing bubl
              </h2>
              <h3 className="text-sm text-center font-light opacity-70">
                to join a bubl, get the bubl id from the creator (or an admin)
              </h3>
              <JoinBubl onSuccess={handleJoinSuccess} />
            </div>
          )}
        </div>
        <div className="mt-auto">
          <button
            onClick={handleClose}
            className="bg-white m-1 text-black outline z-50  outline-black outline-2  px-4 py-2 w-full rounded-2xl transition duration-300"
          >
            close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateJoinModal;
