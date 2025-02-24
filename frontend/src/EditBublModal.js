import React, { useState, useEffect } from "react";
import axios from "axios";
import { hostname } from "./App";
import OptionsMenuInvite from "./OptionsMenuInvite";
import OptionsMenuRequests from "./OptionsMenuRequests";
import toast, { Toaster } from "react-hot-toast";
import CopyButton from "./Components/CopyButton";

function EditBublModal({ closeModal, handleGetBubls, bublId }) {
  const [isVisible, setIsVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrivacy, setNewPrivacy] = useState("");

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
      toast.success("Bubl edit successful.");
      handleClose(); // Close modal after successful submission
      handleGetBubls();
    } catch (error) {
      toast.error("Error editing bubl. Try again.");
    }
  };

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
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div
          className={`bg-white p-6 rounded-3xl  z-10 w-full md:w-4/6 h-5/6 flex flex-col transition-transform duration-300 ${
            isVisible ? "scale-100" : "scale-95"
          }`}
        >
          <div className="flex-grow overflow-y-auto">
            <div>
              <h2 className="text-xl text-center font-bold mb-2 ">
                public bubl_id for {bublId.split("_")[0]}
              </h2>
              <h3 className="text-sm text-center font-light opacity-70">
                share this bubl_id key to allow users to join/request to join
                your bubl!
              </h3>
            </div>
            <div className="border rounded-2xl p-2 m-3 text-center font-medium">
              <span className="mr-2">{bublId}</span>
              <CopyButton textToCopy={bublId} />
            </div>
            <br />
            <div>
              <h2 className="text-xl text-center font-bold mb-2">
                edit {bublId.split("_")[0]}
              </h2>
              <h3 className="text-sm text-center font-light opacity-70">
                to edit this bubl, fill out the form below with changes and hit
                save.
              </h3>
            </div>
            <form onSubmit={handleEditBubl} className="h-fit flex flex-col">
              <div className="flex flex-col flex-grow m-3 border bg-white p-4 rounded-3xl transition duration-300 transform ">
                <div className="mb-4">
                  <label className="block mb-2">bubl Name:</label>
                  <input
                    className="w-full p-2 px-3 border rounded-2xl"
                    type="text"
                    placeholder="optional new bubl name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">description: </label>
                  <input
                    className="w-full p-2 px-3 border rounded-2xl"
                    type="text"
                    placeholder="optional new description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>

                <div className="flex-col border rounded-2xl p-3 mb-4">
                  <span>choose privacy setting: </span>
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
                        public
                      </label>
                      <p
                        id="helper-radio-text"
                        className="text-xs font-normal text-gray-500"
                      >
                        anyone can join.
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
                        private
                      </label>
                      <p
                        id="helper-radio-text"
                        className="text-xs font-normal text-gray-500"
                      >
                        only join through request or invite.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="">
                  <button
                    type="submit"
                    className="bg-black text-white py-2 px-4 w-full rounded-2xl hover:bg-gray-800 transition duration-300"
                  >
                    save
                  </button>
                </div>
              </div>
            </form>
          </div>
          <br />
          <div className="">
            <button
              onClick={handleClose}
              className="bg-white text-black outline outline-black outline-2 px-4 py-2 w-full rounded-2xl transition duration-300"
            >
              close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default EditBublModal;
