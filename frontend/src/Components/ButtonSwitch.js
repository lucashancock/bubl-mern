import React, { useState } from "react";

const ToggleButton2 = ({ onToggle }) => {
  const [isActive, setIsActive] = useState("subls");

  const toggleButton = () => {
    const newState = isActive === "subls" ? "photos" : "subls";
    setIsActive(newState);
    onToggle(newState);
  };

  return (
    <div className="w-48 h-full ">
      <div className="relative inline-block border rounded-full h-full w-full">
        {/* Background slider */}
        <div
          className={`absolute -z-10 top-0 left-0 w-1/2 h-full rounded-full bg-black duration-300 transition-transform ${
            isActive === "photos"
              ? "transform translate-x-full"
              : "transform translate-x-0"
          }`}
        ></div>

        {/* Option 1 */}
        <button
          className={`text-sm py-2 px-4 w-1/2 h-full rounded-l-full transition-all duration-300 ${
            isActive === "photos" ? " text-gray-800" : " text-white"
          }`}
          onClick={toggleButton}
        >
          subls
        </button>

        {/* Option 2 */}
        <button
          className={`text-sm py-2 px-4 w-1/2 h-full rounded-r-full transition-all duration-300  ${
            isActive === "photos" ? " text-white" : " text-gray-800"
          }`}
          onClick={toggleButton}
        >
          photos
        </button>
      </div>
    </div>
  );
};

export default ToggleButton2;
