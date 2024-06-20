import React, { useState } from "react";

function EditPopupModal({ handleEdit, handleClose }) {
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 border-2 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">edit details</h2>
        <div className="mb-4">
          <label htmlFor="newName" className="block mb-2">
            new name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="new name (required)"
            id="newName"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="newDescription" className="block mb-2">
            new description
          </label>
          <textarea
            id="newDescription"
            placeholder="new description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows="4"
            className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => handleEdit(newName, newDescription)}
            className="bg-black text-white px-4 py-2 rounded-3xl mr-2   "
          >
            save
          </button>
          <button
            onClick={handleClose}
            className="bg-white text-black border border-black px-4 py-2 rounded-3xl hover:bg-gray-100 "
          >
            close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPopupModal;
