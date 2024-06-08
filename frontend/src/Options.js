import React, { useEffect, useState } from 'react';

function Options({ isOpen, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  return (
    <div className={`fixed inset-0 overflow-hidden transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="fixed inset-0 bg-black opacity-50" onClick={handleClose}></div>
      
      <div className="absolute inset-5">
        <div className={`absolute top-0 right-0 h-full  bg-white w-full md:w-2/5 transform rounded-3xl shadow-lg transition-transform duration-300`} style={{ transform: `translateX(${isVisible ? 0 : '100%'})`}}>
          <div className="p-4 flex items-center justify-between">
            {/* Content of the slide-out window */}
            <span className="flex flex-grow bg-black text-white justify-center py-1 rounded-3xl text-lg ml-1">options menu</span>
            <button 
              onClick={handleClose} 
              className="relative flex justify-end px-2 py-2 ml-2 bg-gray-500 text-white rounded-full focus:outline-none transition-all duration-300 group"
            >
              <span className="material-symbols-outlined transition-all duration-300">close</span>
              <span className="opacity-0 w-0 transition-all duration-300 group-hover:w-20 group-hover:opacity-100">close</span>
            </button>
          </div>
          <div className="m-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 9rem)' }}>
          <p>You are a: owner</p>
          <p>Members</p>
          <p>Admins</p>
          <p>Bubl name: </p>
          <p>You are a: owner</p>
          <p>Members</p>
          <p>Admins</p>
          <p>Bubl name: </p>
          <p>You are a: owner</p>
          <p>Members</p>
          <p>Admins</p>
          <p>Bubl name: </p>
          <p>You are a: owner</p>
          <p>Members</p>
          <p>Admins</p>
          <p>Bubl name: </p>
          <p>You are a: owner</p>
          <p>Members</p>
          <p>Admins</p>
          <p>Bubl name: </p>
          <p>You are a: owner</p>
          <p>Members</p>
          <p>Admins</p>
          <p>Bubl name: </p>
          <p>You are a: owner</p>
          <p>Members</p>
          <p>Admins</p>
          <p>Bubl name: </p>
          <p>You are a: owner</p>
          <p>Members</p>
          <p>Admins</p>
          <p>Bubl name: </p>
          <p>You are a: owner</p>
          <p>Members</p>
          <p>Admins</p>
          <p>Bubl name: </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Options;
