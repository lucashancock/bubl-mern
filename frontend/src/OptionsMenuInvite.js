import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { hostname } from "./App";

function OptionsMenuInvite() {
  const [email, setEmail] = useState("");
  const [link, setLink] = useState("");
  const [selectedBubl, setSelectedBubl] = useState("");
  const [bubls, setBubls] = useState([]);

  const handleInvite = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://${hostname}:3000/invite`,
        { email: email, bubl_id: selectedBubl },
        { headers: { Authorization: token } }
      );
      toast.dismiss();
      toast.success("Successful invite");

      setLink(response.data.link);
    } catch (error) {
      setLink("");
      const errorMessage =
        error.response?.data?.error || "Invitation failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleGetBubls = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://${hostname}:3000/mybubls`,
        {},
        { headers: { Authorization: token } }
      );
      setBubls(response.data.owned_bubls);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Fetching bubls failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    handleGetBubls();
  }, []);

  return (
    <div className="m-2 border rounded-2xl p-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleInvite(selectedBubl);
          setEmail("");
        }}
      >
        <div className="flex items-center">
          <div className="flex flex-grow w-full">
            <input
              className=" flex-grow w-full border m-1 rounded-2xl px-3 py-2"
              type="email"
              placeholder="enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex ">
            <select
              className="flex-initial w-max border m-1 rounded-2xl px-3 py-2"
              value={selectedBubl}
              onChange={(e) => setSelectedBubl(e.target.value)}
              required
            >
              <option value="">select a bubl</option>
              {bubls.map((bubl) => (
                <option key={bubl.bubl_id} value={bubl.bubl_id}>
                  {bubl.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex">
            <button
              type="submit"
              className="m-2 w-max px-4 py-2 bg-black text-white rounded-2xl"
            >
              invite
            </button>
          </div>
        </div>
      </form>
      <div className="flex w-full ml-4 rounded-full">
        {link && (
          <>
            <span className="mr-2 mb-2">
              Eventually share this link with the receiver through email:
            </span>
            <a
              className="text-blue-500 underline underline-offset-2"
              href={link}
            >
              Link
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default OptionsMenuInvite;
