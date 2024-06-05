import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CreateBubl({ username }) {
    const [newBublName, setNewBublName] = useState('');
    const [endDate, setEndDate] = useState('');
    const [bubls, setBubls] = useState([]);
    const [error, setError] = useState('');

    const handleCreateBubl = async (e) => {
        e.preventDefault();
        try {
          const token = localStorage.getItem('token');
          const currentDate = new Date().toISOString();
          const profile_id_resp = await axios.post('http://localhost:3000/idfromuser',
            { username: username },
            { headers: { Authorization: token } }
          );
          const profile_id = profile_id_resp.data;
          console.log(profile_id)
          if (!newBublName || !endDate) {
            throw new Error("No username or end date provided.")
          }
          const response = await axios.post('http://localhost:3000/bublcreate',
            {
              name: newBublName,
              creator_id: profile_id, // Assuming creator_id is the username
              start_date: currentDate,
              end_date: endDate,  // Example end_date
              role: "creator"
            },
            { headers: { Authorization: token } }
          );
          setBubls([...bubls, response.data.bubl]); // Add the new bubl to the list
          setNewBublName(''); // Clear the input field
          setError('');
        } catch (error) {
          setError('Error creating new bubl.');
        }
      };

    return (
        <form onSubmit={handleCreateBubl}>
        <h1 className="text-center font-bold m-5 text-2xl">welcome, {username}!</h1>
        <div className="flex m-3 drop-shadow-xl bg-white p-3 rounded-3xl transition duration-300 transform hover:drop-shadow-lg">
            <div className='flex-1 text-center'>
                <span>bubl name: </span>
                <input className=""
                type="text"
                placeholder="new bubl Name"
                value={newBublName}
                onChange={(e) => setNewBublName(e.target.value)}
                />
            </div>
            <div className='flex-1 text-center'>
                <span>end date: </span> 
                <input className=" opacity-40"
                type="date"
                placeholder="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required // Make end date field required
                />
            </div>
            <div className = "flex-1 text-center">
              <button type="submit" className='bg-black text-white py-1 px-2 w-48 rounded-xl'>create bubl</button>
            </div>
        </div>
        </form>
    )
};

export default CreateBubl;