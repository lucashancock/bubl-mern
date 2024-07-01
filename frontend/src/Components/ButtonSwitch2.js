import React, { useState } from "react";

const ToggleButton = ({ onToggle }) => {
  const [isActive, setIsActive] = useState("grid");

  const toggleButton = () => {
    const newState = isActive === "grid" ? "live" : "grid";
    setIsActive(newState);
    onToggle(newState);
  };

  return (
    <div className="w-48 h-full ">
      <div className="flex relative border rounded-full h-full w-full">
        {/* Background slider */}
        <div
          className={`absolute -z-10 top-0 left-0 w-1/2 h-full rounded-full bg-black duration-300 transition-transform ${
            isActive === "grid"
              ? "transform translate-x-full"
              : "transform translate-x-0"
          }`}
        ></div>

        {/* Option 1 */}
        <button
          className={` flex-auto flex items-center justify-center text-sm py-2 px-4 w-1/2 h-full rounded-l-full text-center transition-all duration-300 ${
            isActive === "grid" ? " text-gray-800" : " text-white"
          }`}
          onClick={toggleButton}
        >
          live
        </button>

        {/* Option 2 */}
        <button
          className={`flex-auto flex items-center justify-center text-sm py-2 px-4 w-1/2 h-full rounded-r-full text-center transition-all duration-300  ${
            isActive === "grid" ? " text-white" : " text-gray-800"
          }`}
          onClick={toggleButton}
        >
          grid
        </button>
      </div>
    </div>
  );
};

export default ToggleButton;
