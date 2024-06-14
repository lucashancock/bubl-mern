import React, { useEffect, useState } from "react";
import OptionsMenuInvite from "./OptionsMenuInvite";
import OptionsMenuMembers from "./OptionsMenuMembers";
import OptionsMenuLeave from "./OptionsMenuLeave";
import OptionsMenuInfo from "./OptionsMenuInfo";

function Options({ bubl_id, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  return (
    <div
      className={`fixed inset-0 overflow-hidden transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={handleClose}
      ></div>
      <div className="absolute inset-5">
        <div
          className={`absolute top-0 right-0 h-full  bg-white w-full md:w-2/5 transform rounded-3xl shadow-lg transition-transform duration-300`}
          style={{ transform: `translateX(${isVisible ? 0 : "100%"})` }}
        >
          <div className="p-4 flex items-center justify-between">
            <span className="flex flex-grow bg-black text-white justify-center py-1 rounded-3xl text-lg ml-1">
              options menu
            </span>
            <button
              onClick={handleClose}
              className="relative flex justify-end px-2 py-2 ml-2 bg-gray-500 text-white rounded-full focus:outline-none transition-all duration-300 group"
            >
              <span className="material-symbols-outlined transition-all duration-300">
                close
              </span>
              <span className="opacity-0 w-0 transition-all duration-300 group-hover:w-20 group-hover:opacity-100">
                close
              </span>
            </button>
          </div>
          <div
            className="m-3 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 9rem)" }}
          >
            {/* Content of the slide out window here */}
            <div className="flex flex-col justify-between h-full">
              <div className="flex-initial">
                <OptionsMenuInvite bubl_id={bubl_id} />
              </div>
              <div className="flex-inital">
                <OptionsMenuInfo bubl_id={bubl_id} />
              </div>
              <div className="flex-grow">
                <OptionsMenuMembers bubl_id={bubl_id} />
              </div>

              <div className="items-center justify-center">
                <OptionsMenuLeave bubl_id={bubl_id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Options;
