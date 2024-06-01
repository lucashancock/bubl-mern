// Profile.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newUsername, setNewUsername] = useState('');
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
        setNewEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.response && error.response.status === 403) {
          navigate('/login');
        }
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div>
      <Link to="/bubls">Back</Link>
      <br />
      <h1>Profile Page</h1>
      <p><strong>User ID:</strong> {profile.profile_id}</p>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>

      <h2>Update Profile</h2>
      <label>
        New Username:
        <input 
          type="text" 
          value={newUsername} 
          onChange={(e) => setNewUsername(e.target.value)} 
        />
      </label>
      <br />
      <label>
        New Email:
        <input 
          type="email" 
          value={newEmail} 
          onChange={(e) => setNewEmail(e.target.value)} 
        />
      </label>
      <br />
      <button onClick={handleUpdateProfile}>Update Profile</button>
      <p>{updateMessage}</p>
    </div>
  );
};

export default Profile;
