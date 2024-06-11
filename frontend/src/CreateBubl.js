import React, { useState } from "react";
import axios from "axios";
import { hostname } from "./App";

function CreateBubl({ onSuccess }) {
  const [newBublName, setNewBublName] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState(2);
  const [selectedDescription, setSelectedDescription] = useState("");

  const handleCreateBubl = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");

      if (!newBublName || !endDate) {
        throw new Error("No username or end date provided.");
      }

      await axios.post(
        `http://${hostname}:3000/bublcreate`, // response not used as of now
        {
          name: newBublName,
          capacity: selectedSize,
          description: selectedDescription,
          start_date: new Date().toISOString(),
          end_date: endDate,
        },
        { headers: { Authorization: token } }
      );

      setNewBublName(""); // Clear the input field
      setError("");
      onSuccess(); // Invoke onSuccess callback when successful
    } catch (error) {
      setError("Error creating new bubl.");
    }
  };

  return (
    <form onSubmit={handleCreateBubl} className="h-full flex flex-col">
      <div className="flex flex-col flex-grow m-3 drop-shadow-xl bg-white p-4 rounded-3xl transition duration-300 transform hover:drop-shadow-lg">
        <div className="mb-4">
          <label className="block mb-2">bubl name:</label>
          <input
            className="w-full p-2 border rounded"
            type="text"
            placeholder="New Bubl Name"
            value={newBublName}
            onChange={(e) => setNewBublName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">end date:</label>
          <input
            className="w-full p-2 border rounded opacity-40"
            type="datetime-local"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required // Make end date field required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">description: </label>
          <input
            className="w-full p-2 border rounded opacity-40"
            type="text"
            placeholder="optional description"
            value={selectedDescription}
            onChange={(e) => setSelectedDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">
            Size: <span>{selectedSize}</span> {/* Display the selected value */}
          </label>
          <input
            type="range"
            value={selectedSize} // Set the value attribute to display the selected value
            onChange={(e) => setSelectedSize(e.target.value)} // Use e.target.value to get the selected value and update the state
            min="2"
            max="10"
            step="1"
            className="w-full rounded-full appearance-none cursor-pointer accent-gray-600 dark:bg-gray-200"
          />
        </div>

        <div className="mt-auto">
          <button
            type="submit"
            className="bg-black text-white py-2 px-4 w-full rounded-xl hover:bg-gray-800 transition duration-300"
          >
            create bubl
          </button>
        </div>
        {error && <div className="text-red-500 mt-3">{error}</div>}
      </div>
    </form>
  );
}

export default CreateBubl;
