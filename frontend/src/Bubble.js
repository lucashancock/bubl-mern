import React from "react";
import './Bubble.css'

const Bubble = () => {
  return (<>
    <div className="flex flex-col items-center justify-center mt-40">
      <div className="relative flex justify-center items-center mb-16">
        <div className="bubble w-80 min-w-64 h-80 rounded-full flex flex-col items-center justify-center">
          <div className="text-center text-3xl font-bold text-gray-700 mb-2">
            <span>welcome to </span>
            <span className="text-gradient">bubl.</span>
          </div>
          <div className="text-center text-gray-600">
            the photo sharing app made for you.
          </div>
        </div>
      </div>
      <div className="text-lg text-gray-600">
        please sign in or create an account above.
      </div>
    </div>
    <div>
        <div className="absolute bottom-2 w-full text-center">created by lucas hancock</div>
    </div>
    </>
  );
};

export default Bubble;
