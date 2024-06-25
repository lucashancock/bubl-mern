import React, { useState, useEffect } from "react";
import Banner2 from "./Components/Banner2";
import NavMenu from "./Components/NavMenu";
import { hostname } from "./App";
import axios from "axios";
import toast from "react-hot-toast";

function AdminPage() {
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [bubls, setBubls] = useState([]);
  const [selectedBubl, setSelectedBubl] = useState(""); // State to hold the selected bubl

  const handleGetBubls = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://${hostname}:3000/mybubls`,
        {},
        { headers: { Authorization: token } }
      );
      setBubls(response.data.owned_bubls);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Fetching bubls failed. Please try again.";
      toast.error(errorMessage);
    }
  };

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
      handleGetBubls();
      toast.success("Bubl delete successful.");
    } catch (error) {
      toast.error("Error deleting bubl. Try again.");
    }
  };

  const handleDeleteClick = (bubl_id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this bubl? This cannot be undone."
    );
    if (confirmed) {
      deleteBubl(bubl_id);
    }
  };

  useEffect(() => {
    handleGetBubls();
  }, []);

  const handleChangeBubl = (e) => {
    setSelectedBubl(e.target.value);
    // You can perform any additional actions here based on the selected bubl
  };

  return (
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
          <div className="flex items-center justify-between bg-white py-5 px-4">
            <div className="border-t border-gray-600 flex-grow"></div>
            <div className="mx-4 text-xl font-semibold">Admin</div>
            <div className="border-t border-gray-600 flex-grow"></div>
          </div>

          <div className="mt-4">
            <label htmlFor="bublSelect" className="mr-2">
              Select Bubl:
            </label>
            <select
              id="bublSelect"
              className="border rounded px-3 py-2"
              value={selectedBubl}
              onChange={handleChangeBubl}
              required
            >
              <option value="">Select a bubl</option>
              {bubls.map((bubl) => (
                <option key={bubl.bubl_id} value={bubl.bubl_id}>
                  {bubl.name}
                </option>
              ))}
            </select>
          </div>

          {/* Render content related to selectedBubl */}
          {selectedBubl && (
            <>
              <div>
                <h2 className="text-xl text-center font-bold mb-2 mt-5">
                  Promote/Demote Users in {selectedBubl.split("_")[0]}
                </h2>
                <h3 className="text-sm text-center font-light opacity-70">
                  As an admin, you can promote or demote users in your bubl.
                </h3>
              </div>
              <div className="text-center bg-yellow-300">
                Promotion and Demotions TO-DO
              </div>
              <div>
                <h2 className="text-xl text-center font-bold mb-2 mt-5">
                  Change Permissions in {selectedBubl.split("_")[0]}
                </h2>
                <h3 className="text-sm text-center font-light opacity-70">
                  As an admin, you can change the permissions of the users in
                  your bubl.
                </h3>
              </div>
              <div className="text-center bg-yellow-300">
                Permissions (Upload/View) TO-DO
              </div>
              <div>
                <h2 className="text-xl text-center font-bold mb-2 mt-5">
                  Delete {selectedBubl.split("_")[0]}
                </h2>
                <h3 className="text-sm text-center font-light opacity-70">
                  To delete this bubl, click the button below. This cannot be
                  undone!
                </h3>
              </div>
              <div className="">
                <div className="border m-2 rounded-2xl p-3 px-4 hover:drop-shadow-lg">
                  <button
                    onClick={() => handleDeleteClick(selectedBubl)}
                    className="bg-red-500 text-white px-4 py-2 w-full rounded-2xl hover:bg-red-700 transition duration-300"
                  >
                    Delete Bubl
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
