// Profile.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Banner3 from './Banner3'

const Profile = ({ onLogout }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/profile', {
          headers: { Authorization: token }
        });
        setProfile(response.data);
        setNewUsername(response.data.username);
        setNewPassword(response.data.password);
        setNewEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching profile:', error);
        localStorage.setItem('token', '');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:3000/profile', 
        { newUsername, newEmail }, 
        { headers: { Authorization: token } }
      );

      setProfile(response.data.profile);
      setUpdateMessage('Profile updated successfully');

      // Update the token in localStorage
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateMessage('Profile update failed. Try a different username/email.');
    }
  };

  const handleProfileDelete = async () => { // TO-DO make so that input for password is not filled in and hash password
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/profiledelete', // response not used as of now
        { password: newPassword }, 
        { headers: { Authorization: token } }
      );
      setUpdateMessage('Profile delete success. Redirecting to home.')
      onLogout();
    } catch (error) {
      console.error('Error deleting profile:', error);
      setUpdateMessage('Profile delete failed. Please try again.');
    }
  }

  if (loading) {
    return <>
      <Banner3 />
      <div>Loading...</div>
    </>;
  }

  if (!profile) {
    return <>
    <Banner3 />
    <div>Profile not found</div>;
    </>
  }

  return (
    <>
    <Banner3 />
    {/* Back arrow */}
    <div className="container mt-3 p-0 rounded-lg">
      <span href="/" className="flex items-center w-max font-bold hover:bg-gray-300 rounded-2xl px-2 pr-4 py-1 ml-3 transition duration-300 ease-in-out">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
         </svg>
        <Link to="/bubls">back to bubls</Link>
      </span>
    </div>
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">profile page</h1>
      <div className="mb-4">
        {/* <p><strong>user ID:</strong> {profile.profile_id}</p> */}
        <p><strong>username:</strong> {profile.username}</p>
        <p><strong>email:</strong> {profile.email}</p>
        <p><strong>tier:</strong> platinum</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">update profile</h2>
        <label className="block mb-2">
          new username:
          <input 
            type="text" 
            value={newUsername} 
            onChange={(e) => setNewUsername(e.target.value)} 
            className="border border-gray-300 rounded-2xl px-3 py-2 mt-1 w-full"
          />
        </label>
        <label className="block mb-2">
          new email:
          <input 
            type="email" 
            value={newEmail} 
            onChange={(e) => setNewEmail(e.target.value)} 
            className="border border-gray-300 rounded-2xl px-3 py-2 mt-1 w-full"
          />
        </label>
        <button 
          onClick={handleUpdateProfile} 
          className="bg-blue-900 hover:bg-blue-950 rounded-2xl text-white font-bold py-2 px-4 transition duration-300">
          update profile
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">delete profile</h2>
        <label className="block mb-2">
          password:
          <input 
            type="password" 
            placeholder="password"
            onChange={(e) => setNewPassword(e.target.value)} 
            className="border border-gray-300 rounded-2xl px-3 py-2 mt-1 w-full"
          />
        </label>
        <button 
          onClick={handleProfileDelete} 
          className="bg-red-900 hover:bg-red-950 text-white font-bold py-2 px-4 rounded-2xl transition duration-300"
        >
          delete profile
        </button>
      </div>
      
      <p className="text-red-500">{updateMessage}</p>
    </div>
    </>
  );
};

export default Profile;
