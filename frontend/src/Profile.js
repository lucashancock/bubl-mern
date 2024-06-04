// Profile.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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

  const handleProfileDelete = async () => { // TO-DO make so that input for password is not filled in and hash password
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/profiledelete', 
        { username: newUsername, 
          password: newPassword }, 
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
      <br /><br />
      <button onClick={handleUpdateProfile}>Update Profile</button>
      <br /><br />
      <h2>Delete Profile</h2>
      <label>
        Password:
        <input 
          type="password" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
        />
      </label>
      <br /><br />
      <button onClick={handleProfileDelete}>Delete Profile</button>
      <p>{updateMessage}</p>
    </div>
  );
};

export default Profile;
