import React, { useState, useEffect } from "react";
import axios from "axios";
import { hostname } from "./App";

function EditBublModal({ closeModal, handleGetBubls, bublId }) {
  const [isVisible, setIsVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrivacy, setNewPrivacy] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => closeModal(), 300);
  };

  const handleEditBubl = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        `http://${hostname}:3000/bubledit`,
        {
          bubl_id: bublId,
          name: newName,
          description: newDescription,
          privacy: newPrivacy,
        },
        { headers: { Authorization: token } }
      );

      setNewName("");
      setNewDescription("");
      setNewPrivacy("");
      setError("");
      handleClose(); // Close modal after successful submission
      handleGetBubls();
    } catch (error) {
      setError("Error editing the bubl.");
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div
        className={`bg-white p-6 rounded-3xl shadow-lg z-10 md:w-9/12 lg:w-6/12 w-11/12 h-4/6 flex flex-col transition-transform duration-300 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
      >
        <div className="flex-grow overflow-y-auto">
          <div>
            <h2 className="text-xl text-center font-bold mb-2">
              Edit {bublId.split("_")[0]}
            </h2>
            <h3 className="text-sm text-center font-light opacity-70">
              To edit this bubl, fill out the form below with changes and hit
              save.
            </h3>
          </div>
          <form onSubmit={handleEditBubl} className="h-fit flex flex-col">
            <div className="flex flex-col flex-grow m-3 border bg-white p-4 rounded-3xl transition duration-300 transform hover:drop-shadow-lg">
              <div className="mb-4">
                <label className="block mb-2">Bubl Name:</label>
                <input
                  className="w-full p-2 px-3 border rounded-2xl"
                  type="text"
                  placeholder="Optional new bubl name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Description: </label>
                <input
                  className="w-full p-2 px-3 border rounded-2xl"
                  type="text"
                  placeholder="Optional new description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>

              <div className="flex-col border rounded-2xl p-3 mb-4">
                <span>Choose privacy setting: </span>
                <div className="flex items-center h-fit my-3">
                  <input
                    id="public"
                    type="radio"
                    name="privacy"
                    value="public"
                    className="w-4 h-4"
                    checked={newPrivacy === "public"}
                    onChange={() => setNewPrivacy("public")}
                  />
                  <div className="ms-2 text-sm">
                    <label htmlFor="public" className="font-medium ">
                      Public
                    </label>
                    <p
                      id="helper-radio-text"
                      className="text-xs font-normal text-gray-500"
                    >
                      Anyone can join.
                    </p>
                  </div>
                </div>
                <div className="flex items-center h-fit mt-3 mb-1">
                  <input
                    id="private"
                    type="radio"
                    name="privacy"
                    value="private"
                    className="w-4 h-4 "
                    checked={newPrivacy === "private"}
                    onChange={() => setNewPrivacy("private")}
                  />
                  <div className="ms-2 text-sm">
                    <label htmlFor="private" className="font-medium">
                      Private
                    </label>
                    <p
                      id="helper-radio-text"
                      className="text-xs font-normal text-gray-500"
                    >
                      Only join through request or invite.
                    </p>
                  </div>
                </div>
              </div>
              <div className="">
                <button
                  type="submit"
                  className="bg-black text-white py-2 px-4 w-full rounded-xl hover:bg-gray-800 transition duration-300"
                >
                  Save
                </button>
              </div>
              {error && <div className="text-red-500 mt-3">{error}</div>}
            </div>
          </form>
        </div>
        <div className="">
          <button
            onClick={handleClose}
            className="bg-gray-500 text-white px-4 py-2 w-full rounded-2xl hover:bg-gray-700 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
export default EditBublModal;
