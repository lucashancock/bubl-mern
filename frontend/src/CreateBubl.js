import React, { useState } from 'react';
import axios from 'axios';

function CreateBubl({ onSuccess }) {
  const [newBublName, setNewBublName] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const handleCreateBubl = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      if (!newBublName || !endDate) {
        throw new Error("No username or end date provided.")
      }
      
      await axios.post('http://localhost:3000/bublcreate', // response not used as of now
        {
          name: newBublName,
          start_date: new Date().toISOString(),
          end_date: endDate
        },
        { headers: { Authorization: token } }
      );

      setNewBublName(''); // Clear the input field
      setError('');
      onSuccess(); // Invoke onSuccess callback when successful
    } catch (error) {
      setError('Error creating new bubl.');
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
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">end date:</label>
          <input 
            className="w-full p-2 border rounded opacity-40"
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required // Make end date field required
          />
        </div>
        <div className="mt-auto">
          <button type="submit" className="bg-black text-white py-2 px-4 w-full rounded-xl hover:bg-gray-800 transition duration-300">
            create bubl
          </button>
        </div>
        {error && <div className="text-red-500 mt-3">{error}</div>}
      </div>
    </form>
  );
}

export default CreateBubl;
