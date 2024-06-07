import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UploadPhotoModal({ handleCloseUploadModal, bubl_id }) {
  const [selectedName, setSelectedName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [previewURL, setPreviewURL] = useState('');

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result);
      }
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result);
      }
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (selectedFile && selectedName) {
      uploadPhoto(selectedFile);
    } else {
      console.error('No file/name selected');
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => handleCloseUploadModal(), 300);
  }

  const uploadPhoto = async (photoFile) => {
    const formData = new FormData();
    formData.append('photo', photoFile);
    formData.append('photoname', selectedName);
    formData.append('bubl_id', bubl_id);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:3000/photoupload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token,
        },
      });
      console.log('Photo upload successful:', response.data);
      handleClose();
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className={`bg-white p-6 rounded-3xl shadow-lg md:w-9/12 lg:w-6/12 w-11/12 h-4/6 flex flex-col transition-transform duration-300 ${isVisible ? 'scale-100' : 'scale-95'}`} onDrop={handleDrop} onDragOver={handleDragOver}>
        <h2 className="text-lg text-center bg-black text-white rounded-2xl mb-2 p-1">upload photo</h2>
        
        <div className="flex flex-col items-center justify-center flex-grow border-4 border-dotted border-gray-300 border-opacity-70 rounded-2xl mb-4 mt-4 cursor-pointer">
          <p className="mb-1 text-gray-500 opacity-50">drag and drop a file here</p>
          <p className="mb-2 text-gray-500 opacity-50">or</p>
          <label htmlFor="fileInput" className="px-4 py-2 border border-black border-opacity-50 text-black rounded-2xl hover:border-4 transition-all duration-300 cursor-pointer">
            Browse
            <input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
        
        {previewURL && (
          <div className="relative w-full h-2/6 m-auto mb-3">
            <img
              src={previewURL}
              alt="Preview"
              className="h-full w-full overflow-clip object-cover rounded-3xl"
            />
            <div className="flex justify-center">
              <div className="absolute w-11/12 text-center top-2 bg-white pl-2 pb-1 pr-2 rounded-full">photo preview</div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto">
          <input 
            type="text" 
            placeholder="Photo Name" 
            value={selectedName} 
            onChange={(e) => setSelectedName(e.target.value)} 
            className="flex-grow mr-2 px-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
          />
          <button 
            onClick={handleSubmit} 
            className="relative flex items-center px-2 py-2 border border-black rounded-full focus:outline-none transition-all duration-300 group"
          >
            <span className="material-symbols-outlined transition-all duration-300">upload</span>
            <span className="opacity-0 w-0 text-white transition-all duration-300 group-hover:w-20 group-hover:opacity-100 group-hover:text-black">Upload</span>
          </button>
          <button 
            onClick={handleClose} 
            className="relative flex items-center px-2 py-2 ml-2 bg-gray-500 text-white rounded-full focus:outline-none transition-all duration-300 group"
          >
            <span className="material-symbols-outlined transition-all duration-300">close</span>
            <span className="opacity-0 w-0 transition-all duration-300 group-hover:w-20 group-hover:opacity-100">Close</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default UploadPhotoModal;
