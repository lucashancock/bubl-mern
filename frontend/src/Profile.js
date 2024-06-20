// Profile.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Banner2 from "./Components/Banner2";
import { hostname } from "./App";
import toast, { Toaster } from "react-hot-toast";

const Profile = ({ onLogout }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`http://${hostname}:3000/profile`, {
          headers: { Authorization: token },
        });
        setProfile(response.data);
        setNewUsername(response.data.username);
        setNewPassword(response.data.password);
        setNewEmail(response.data.email);
      } catch (error) {
        console.error("Error fetching profile:", error);
        sessionStorage.setItem("token", "");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdateProfile = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `http://${hostname}:3000/profile`,
        { newUsername, newEmail },
        { headers: { Authorization: token } }
      );

      setProfile(response.data.profile);
      toast.success("Profile updated successfully");

      // Update the token in sessionStorage
      sessionStorage.setItem("token", response.data.token);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Profile update failed. Try a different username/email.");
    }
  };

  const handleProfileDelete = async () => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        `http://${hostname}:3000/profiledelete`, // response not used as of now
        { password: newPassword },
        { headers: { Authorization: token } }
      );
      toast.success("Profile delete success. Redirecting to home.");
      onLogout();
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast.error("Profile delete failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <>
        <Banner2 />
        <div>Loading...</div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Banner2 />
        <div>Profile not found</div>;
      </>
    );
  }

  return (
    <>
      <Toaster
        toastOptions={{
          className: "",
          id: "toast",
          success: {
            style: {
              border: "1px solid #000000",
              padding: "16px",
              color: "#000000",
            },
          },
          error: {
            style: {
              border: "1px solid #000000",
              padding: "16px",
              color: "#000000",
            },
          },
        }}
      />
      <Banner2 />
      <div className="flex items-center justify-between bg-white py-5 px-4">
        <div className="border-t border-gray-600 flex-grow"></div>
        <div className="mx-4 text-xl font-semibold">profile</div>
        <div className="border-t border-gray-600 flex-grow"></div>
      </div>
      {/* Back arrow */}
      <div className="flex mb-3">
        <div className="flex flex-1 w-auto justify-start ml-1">
          <span className="flex items-center font-semibold hover:bg-gray-300 rounded-2xl px-4 py-2 ml-3 transition duration-300 ease-in-out">
            <i className="fas fa-chevron-left mr-2"></i>
            <Link to="/bubls">back to bubls</Link>
          </span>
        </div>
      </div>
      <div className="p-4 border rounded-2xl m-2 ">
        <h1 className="text-xl font-bold text-center ml-2 mb-4">user info</h1>
        <div className="mb-4 border rounded-2xl p-3">
          {/* <p><strong>user ID:</strong> {profile.profile_id}</p> */}
          <p>
            <strong>username:</strong> {profile.username}
          </p>
          <p>
            <strong>email:</strong> {profile.email}
          </p>
          <p>
            <strong>tier:</strong> platinum
          </p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl text-center font-bold ml-2 mb-2">
            update profile
          </h2>
          <label className="block ml-2">new username:</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="border border-gray-300 rounded-2xl px-3 py-2 mt-1 mb-4 w-full"
          />
          <label className="block ml-2">new email:</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="border border-gray-300 rounded-2xl px-3 py-2 mt-1 mb-4 w-full"
          />
          <button
            onClick={handleUpdateProfile}
            className="text-white bg-black border rounded-2xl font-bold py-2 px-4 transition duration-300"
          >
            update profile
          </button>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold ml-2 mb-2">delete profile</h2>
          <label className="block ml-2">password:</label>
          <input
            type="password"
            placeholder="please retype your password to confirm deletion"
            onChange={(e) => setNewPassword(e.target.value)}
            className="border border-gray-300 rounded-2xl px-3 py-2 mt-1 mb-4 w-full"
          />
          <button
            onClick={handleProfileDelete}
            className="bg-red-950 hover:bg-red-950 text-white font-bold py-2 px-4 rounded-2xl transition duration-300"
          >
            delete profile
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;
