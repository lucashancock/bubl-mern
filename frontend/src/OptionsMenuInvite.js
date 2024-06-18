import React, { useState, useEffect } from "react";
import { hostname } from "./App";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function OptionsMenuInvite({ bubl_id }) {
  const [email, setEmail] = useState("");
  const [link, setLink] = useState("");

  const handleInvite = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://${hostname}:3000/invite`,
        { email: email, bubl_id: bubl_id },
        { headers: { Authorization: token } }
      );
      toast.success("Successful invite");
      setLink(response.data.link);
    } catch (error) {
      setLink("");
      const errorMessage =
        error.response?.data?.error || "Invitation failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div>
        <Toaster
          toastOptions={{
            className: "",
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
      </div>
      <div className="m-2 border rounded-2xl p-3">
        <div className="flex flex-col items-center ">
          <div className="w-full drop-shadow-none">
            <input
              className="w-full border m-1 rounded-2xl px-3 py-2"
              type="email"
              placeholder="enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="w-full">
            <button
              className="m-2 w-full px-3 py-2 bg-black text-white rounded-2xl"
              onClick={() => handleInvite()}
            >
              invite
            </button>
          </div>
        </div>
        <div className="flex w-5/6 ml-4 rounded-full">
          {link && (
            <>
              <span className="mr-2 mb-2">
                eventually share this link with receiver thru email:
              </span>
              <a
                className="text-blue-500 underline underline-offset-2"
                href={link}
              >
                link
              </a>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default OptionsMenuInvite;
