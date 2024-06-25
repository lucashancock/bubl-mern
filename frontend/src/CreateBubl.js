import React, { useState } from "react";
import axios from "axios";
import { hostname } from "./App";
import toast from "react-hot-toast";

function CreateBubl({ onSuccess }) {
  const [newBublName, setNewBublName] = useState("");
  const [selectedPrivacy, setSelectedPrivacy] = useState(""); // Initialize selectedPrivacy state
  const [selectedSize, setSelectedSize] = useState(""); // Initialize selectedSize state
  const [selectedDescription, setSelectedDescription] = useState("");

  const handleCreateBubl = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");

      let capacity = 5;
      let endDate = new Date();
      if (selectedSize === "medium") {
        capacity = 15;
        endDate.setDate(endDate.getDate() + 14);
      }
      if (selectedSize === "large") {
        capacity = 15;
        endDate.setMonth(endDate.getMonth() + 1);
      }
      if (selectedSize === "small") {
        capacity = 5; // redundant
        endDate.setDate(endDate.getDate() + 3);
      }

      await axios.post(
        `http://${hostname}:3000/bublcreate`, // response not used as of now
        {
          name: newBublName,
          capacity: capacity,
          privacy: selectedPrivacy,
          description: selectedDescription,
          start_date: new Date().toISOString(),
          end_date: endDate.toISOString(),
        },
        { headers: { Authorization: token } }
      );

      toast.success("Successful bubl creation!");
      onSuccess(); // Invoke onSuccess callback when successful
    } catch (error) {
      toast.error("Failed to create bubl. Try again.");
    }
  };

  return (
    <>
      <form onSubmit={handleCreateBubl} className=" flex flex-col">
        <div className="flex flex-col flex-grow m-3 border bg-white p-4 rounded-3xl transition duration-300 transform hover:drop-shadow-lg">
          <div className="mb-4">
            <label className="block mb-2">bubl name:</label>
            <input
              className="w-full p-2 px-3 border rounded-2xl"
              type="text"
              placeholder="new bubl name"
              value={newBublName}
              onChange={(e) => setNewBublName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">description: </label>
            <input
              className="w-full p-2 px-3 border rounded-2xl"
              type="text"
              placeholder="optional description"
              value={selectedDescription}
              onChange={(e) => setSelectedDescription(e.target.value)}
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
                checked={selectedPrivacy === "public"}
                onChange={() => setSelectedPrivacy("public")}
                required
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
                checked={selectedPrivacy === "private"}
                onChange={() => setSelectedPrivacy("private")}
                required
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
          <div className="flex-col border rounded-2xl p-3 mb-4">
            <span>choose size:</span>
            <div className="flex items-center h-fit my-3">
              <input
                id="small"
                aria-describedby="helper-radio-text"
                type="radio"
                name="size"
                value="small"
                className="w-4 h-4"
                checked={selectedSize === "small"}
                onChange={() => setSelectedSize("small")}
                required
              />
              <div className="ms-2 text-sm">
                <label htmlFor="small" className="font-medium ">
                  small
                </label>
                <p
                  id="helper-radio-text"
                  className="text-xs font-normal text-gray-500"
                >
                  free with ads, 5 people, 1 GB, 3 days.
                </p>
              </div>
            </div>
            <div className="flex items-center h-fit my-3">
              <input
                id="helper-radio3"
                aria-describedby="helper-radio-text"
                type="radio"
                name="size"
                value="medium"
                className="w-4 h-4 "
                checked={selectedSize === "medium"}
                onChange={() => setSelectedSize("medium")}
                disabled // TO-DO undisable if they are correct tier
              />
              <div className="ms-2 text-sm">
                <label
                  htmlFor="helper-radio3"
                  className="font-medium text-gray-900"
                >
                  medium
                </label>
                <p
                  id="helper-radio-text"
                  className="text-xs font-normal text-gray-500"
                >
                  see profile for more information about upgrading.
                </p>
              </div>
            </div>
            <div className="flex items-center h-fit mt-4 mb-2">
              <input
                id="helper-radio4"
                aria-describedby="helper-radio-text"
                type="radio"
                name="size"
                value="large"
                className="w-4 h-4 "
                checked={selectedSize === "large"}
                onChange={() => setSelectedSize("large")}
                disabled // TO-DO undisable if correct tier
              />
              <div className="ms-2 text-sm">
                <label
                  htmlFor="helper-radio4"
                  className="font-medium text-gray-900 "
                >
                  large
                </label>
                <p
                  id="helper-radio-text"
                  className="text-xs font-normal text-gray-500"
                >
                  see profile for more information about upgrading.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <button
              type="submit"
              className="bg-black text-white py-2 px-4 w-full rounded-xl hover:bg-gray-800 transition duration-300"
            >
              create bubl
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default CreateBubl;
