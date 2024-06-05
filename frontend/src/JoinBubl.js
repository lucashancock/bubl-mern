import React, { useState, useEffect } from 'react';
import axios from 'axios';

function JoinBubl( { username }) {
    const [bubl_id, setBublId] = useState('');
    const [user_id, setUserId] = useState('');
    const [error, setError] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        const fetchId = async () => {
            console.log("running")
            const token = localStorage.getItem('token');
            const profile_id_resp = await axios.post('http://localhost:3000/idfromuser',
                { username: username },
                { headers: { Authorization: token } }
            );
            const profile_id = profile_id_resp.data;
            setUserId(profile_id);
        }
        fetchId();
    }, [])

    useEffect(() => {
        let timer;
    
        if (error) {
          // Show the error message
          setShowMessage(true);
    
          // Set a timer to hide the message after 5 seconds
          timer = setTimeout(() => {
            setShowMessage(false);
            setError('');
          }, 5000);
        }
    
        // Clear the timer when the component unmounts or when the message disappears
        return () => clearTimeout(timer);
      }, [error]);

    const handleJoinBubl = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3000/bubljoin',
                { 
                  bubl_id: bubl_id, 
                  user_id: user_id
                },
                { headers: { Authorization: token } }
            );
            console.log("here2")
        } catch (error) {
            setError("Error joining bubl. Try a different ID.");
        }

    }

    return (
        <>
        <form onSubmit={handleJoinBubl}>
        <div className="flex m-3 drop-shadow-xl bg-white p-3 rounded-3xl transition duration-300 transform hover:drop-shadow-lg">
            <div className='flex-1 text-center '>
                <span>bubl id: </span>
                <input className="rounded-md"
                type="text"
                placeholder="join bubl id"
                value = {bubl_id}
                onChange={(e) => setBublId(e.target.value)}
                />
            </div>
            <div className='flex-1 text-center'></div>
            <div className = "flex-1 text-center ">
              <button type="submit" className='bg-black text-white py-1 px-2 w-48 rounded-xl'>join bubl</button>
            </div>
        </div>
        </form>
        <p className="text-center m-3 text-red-400">{error}</p>
        </>
    )
}

export default JoinBubl