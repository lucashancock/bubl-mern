import React from "react";

function BublHeader({ username }) {
  return (
    <div className="flex items-center justify-between bg-white py-5 px-4">
      <div className="border-t border-gray-600 flex-grow"></div>
      <div className="mx-4 text-xl font-semibold">bubls</div>
      <div className="border-t border-gray-600 flex-grow"></div>
    </div>
  );
}

export default BublHeader;
