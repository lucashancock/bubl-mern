import React, { useState } from "react";
import Banner2 from "./Components/Banner2";
import BublsTest from "./Bublstest";
import BublHeader from "./Components/BublHeader";
import NavMenu from "./Components/NavMenu";

function Bubls() {
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <Banner2 />
      <div className="flex flex-grow">
        <div
          className={`bg-gray-700 text-white transition-all duration-300 ${
            isMenuExpanded ? "w-56" : "w-16"
          }`}
        >
          <NavMenu
            isMenuExpanded={isMenuExpanded}
            setIsMenuExpanded={setIsMenuExpanded}
          />
        </div>
        <div className="flex-col flex-grow p-4 overflow-auto">
          <BublHeader />
          <BublsTest />
        </div>
      </div>
    </div>
  );
}

export default Bubls;
