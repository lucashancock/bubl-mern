import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Banner2 from './Banner2';
import UploadPhotoModal from './UploadPhotoModal';
import Options from './Options';
import { hostname } from './App';

function Gallery() {
  const { bubl_id } = useParams(); // Access bubl_id from the route params
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [likedPhotos, setLikedPhotos] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [slideOutVisible, setSlideOutVisible] = useState(false);

  const fetchPhotos = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`http://${hostname}:3000/bublphotos`, 
      { bubl_id: bubl_id },
      { headers: { Authorization: token } });
      setPhotos([ { picture_id: "uploadcard" }, ...response.data.returnArr ]); // Add the "upload card" only once here
      setDisplayName(response.data.displayName);
      setError("");
    } catch (error) {
      setError("Error");
    }
  };

  const fetchLikedPhotos = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`http://${hostname}:3000/likedphotos`, { headers: { Authorization: token } });
      setLikedPhotos(response.data.likedp);
      console.log(likedPhotos);
    } catch (error) {
      console.error('Error fetching liked photos:', error);
    }
  }

  useEffect(() => {
    fetchPhotos();
    fetchLikedPhotos();
    const interval = setInterval(fetchPhotos, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSlideOutOpen = () => {
    setSlideOutVisible(true);
  }

  const handleSlideOutClose = () => {
    setSlideOutVisible(false);
  }

  const handleImageOpen = (photo) => {
    setSelectedImage(photo);
    setTimeout(() => setIsVisible(true),0);
  }

  const handleCloseImage = () => {
    setIsVisible(false);
    setTimeout(() => setSelectedImage(null), 300);
  };
 
  const openUploadModal = () => {
    setUploadModalVisible(true);
  };
  
  const handleCloseUploadModal = () => {
    setUploadModalVisible(false);
  };

  const handleDownload = (photo) => {
    console.log("Downloading: " + photo);
    const byteCharacters = atob(photo.data.bytes);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: photo.data.mimeType });
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', photo.data.filename);
    
    // Simulate a click on the link to trigger the download
    link.click();
    
    // Clean up
    URL.revokeObjectURL(link.href);
    console.log("Done");
  };

  const handleLike = async (photoId) => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.post(`http://${hostname}:3000/like/${photoId}`, {}, { headers: { Authorization: token } });
      // Add the photoId to likedPhotos state
      setLikedPhotos(prevLikedPhotos => [...prevLikedPhotos, photoId]);
    } catch (error) {
      console.error('Error liking photo:', error);
    }
  }

  const handleUnlike = async (photoId) => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.post(`http://${hostname}:3000/unlike/${photoId}`, {}, { headers: { Authorization: token } });
      // Remove the photoId from likedPhotos state
      setLikedPhotos(prevLikedPhotos => prevLikedPhotos.filter(id => id !== photoId));
    } catch (error) {
      console.error('Error unliking photo:', error);
    }
  }


return (
  <>
    {error !== "" ? (
      <p>404 Not found.</p>
    ) : (
      <>
        <Banner2 />
        <div className="flex items-center justify-between bg-white py-5 px-4">
          <div className="border-t border-gray-600 flex-grow"></div>
          <div className="mx-4 text-xl font-semibold">{displayName}'s photo gallery</div>
          <div className="border-t border-gray-600 flex-grow"></div>
        </div>
        <div className="flex mb-6">
          <div className="flex flex-1 w-auto justify-start ml-1">
            <span className="flex items-center font-semibold hover:bg-gray-300 rounded-2xl px-4 py-1 ml-3 transition duration-300 ease-in-out">
              <i className="fas fa-chevron-left mr-2"></i>
              <Link to="/bubls">back to bubls</Link>
            </span>
          </div>
          <button onClick={handleSlideOutOpen}>
            <div className="flex flex-1 w-auto justify-end mr-1">
              <span className="flex items-center font-semibold hover:bg-gray-300 px-4 py-1 mr-3 rounded-2xl transition duration-300 ease-in-out">
                options menu
                <i className="fa-solid fa-bars ml-2"></i>
              </span>
            </div>
          </button>
        </div>
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              photo.picture_id === "uploadcard" ? (
                <div key={photo.picture_id} className="bg-white rounded-3xl border flex items-center justify-center aspect-[4/4] drop-shadow-xl transition duration-300 transform hover:drop-shadow-lg">
                  <div className="p-4">
                    <button className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full hover:bg-gray-400 hover:w-20 hover:h-20 transform transition-all duration-300" onClick={openUploadModal}>
                      <span className="text-2xl font-bold drop-shadow-lg text-gray-700">+</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div key={photo.picture_id} className="cursor-pointer flex flex-col bg-white rounded-3xl border border-black border-1 aspect-[4/4] items-center justify-center overflow-hidden shadow-lg transition duration-300 transform hover:shadow-xl">
                  <div className="flex-grow">
                    <img
                      className="object-cover w-full h-full rounded-3xl drop-shadow-lg"
                      src={`data:${photo.data.mimeType};base64,${photo.data.bytes}`}
                      alt={photo.data.filename}
                      onClick={() => handleImageOpen(photo)}
                    />
                  </div>
                  <div className="absolute bg-white bottom-3 w-11/12 outline-black outline outline-1 rounded-full p-0 text-center bg-opacity-90">
                    <div className="font-semibold">{photo.photoname}</div>
                    <div onClick={() => handleImageOpen(photo)}>
                      <i className="fa-regular fa-heart mr-1"></i>
                      {photo.likes.length}</div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
        {uploadModalVisible && <UploadPhotoModal handleCloseUploadModal={handleCloseUploadModal} bubl_id={bubl_id} />}
        {selectedImage && (
          <div className={`fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`max-w-3xl max-h-full overflow-auto p-6 bg-white rounded-2xl transition-transform duration-300 ${isVisible ? 'scale-100' : 'scale-95'}`}>
              <div className="relative">
                <div className="absolute w-12 h-12 -top-4 right-10 text-white bg-gray-500 hover:bg-gray-700 transition duration-300 rounded-full p-3 flex items-center justify-center">
                  {likedPhotos.includes(selectedImage.picture_id) ? (
                    <button className="align-middle text-red-500 hover:text-red-700 flex items-center justify-center" onClick={() => handleUnlike(selectedImage.picture_id)}>
                      <div className="inline-block text-center mt-1">
                        <i className="fa-solid fa-heart w-6 h-6"></i>
                      </div>
                    </button>
                  ) : (
                    <button className="text-center text-white hover:text-red-500 flex items-center justify-center" onClick={() => handleLike(selectedImage.picture_id)}>
                      <div className="inline-block text-center mt-1">
                        <i className="fa-regular fa-heart w-6 h-6"></i>
                      </div>
                    </button>
                  )}
                </div>
                <button className="absolute -top-4 -right-4 text-white bg-gray-500 hover:bg-gray-700 transition duration-300 rounded-full p-3" onClick={handleCloseImage}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <button type="button" className="absolute -top-4 right-24 w-12 h-12 text-white bg-gray-500 hover:bg-gray-700 transition duration-300 rounded-full p-3" onClick={() => handleDownload(selectedImage)}>
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-4 bi bi-box-arrow-down" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M3.5 10a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 0 0 1h2A1.5 1.5 0 0 0 14 9.5v-8A1.5 1.5 0 0 0 12.5 0h-9A1.5 1.5 0 0 0 2 1.5v8A1.5 1.5 0 0 0 3.5 11h2a.5.5 0 0 0 0-1z"/>
                      <path fillRule="evenodd" d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708z"/>
                    </svg>
                  </div>
                </button>
              </div>
              <img
                className="mx-auto rounded-2xl"
                src={`data:${selectedImage.data.mimeType};base64,${selectedImage.data.bytes}`}
                alt={selectedImage.data.filename}
              />
              <div className="mt-2">
                <h3 className="text-lg font-medium">{selectedImage.photoname}</h3>
                <p className="text-sm">uploader: {selectedImage.creator_username}</p>
                <p className="text-sm">bubl id: {selectedImage.bubl_id}</p>
              </div>
            </div>
          </div>
        )}
      </>
    )}

    {slideOutVisible && <Options isOpen={slideOutVisible} onClose={handleSlideOutClose} />}
  </>
);

}

export default Gallery;
