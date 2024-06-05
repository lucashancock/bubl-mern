import React from "react";
import './Bubble.css'

const Bubble = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center mt-20 px-4 md:mt-40">
        <div className="relative flex justify-center items-center mb-8 md:mb-16">
          <div className="bubble w-64 md:w-80 h-64 md:h-80 rounded-full flex flex-col items-center justify-center px-4">
            <div className="text-center text-2xl md:text-3xl font-bold text-gray-700 mb-2">
              <span>welcome to </span>
              <span className="text-gradient">bubl.</span>
            </div>
            <div className="text-center text-gray-600">
              the photo sharing app made for you.
            </div>
          </div>
        </div>
        <div className="text-center text-base md:text-lg text-gray-600 px-4">
          please sign in or create an account above.
        </div>
      </div>
      <div className="w-full text-center text-sm md:text-base text-gray-600 absolute bottom-2 px-4">
        created by lucas hancock
      </div>
    </>
  );
};

export default Bubble;
