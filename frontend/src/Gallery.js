import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Banner2 from './Banner2';

function Gallery() {
  const { bubl_id } = useParams(); // Access bubl_id from the route params
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedName, setSelectedName] = useState('');
  const [likedPhotos, setLikedPhotos] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isUploadModalVisible, setUploadModalVisible] = useState(false);

  const fetchPhotos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/bublphotos', 
      { bubl_id: bubl_id },
      { headers: { Authorization: token } });
      setPhotos([ { picture_id: "uploadcard" }, ...response.data ]); // Add the "upload card" only once here
      setError("");
    } catch (error) {
      setError("Error");
    }
  };

  const fetchLikedPhotos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/likedphotos', { headers: { Authorization: token } });
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
  }, [bubl_id]);

  const handleImageClick = (photo) => {
    setSelectedImage(photo);
    setTimeout(() => setIsVisible(true),0);
  }

  const handleCloseModal = () => {
    setIsVisible(false);
    setTimeout(() => closeModal(), 300);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const openUploadModal = () => {
    setUploadModalVisible(true);
  };

  const handleCloseUploadModal = () => {
    setUploadModalVisible(false);
  }

  const handleDownload = (photo) => {
    console.log("Downloading: " + photo);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = () => {
    if (selectedFile && selectedName) {
      uploadPhoto(selectedFile);
    } else {
      console.error('No file/name selected');
    }
  };

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
      // After successful upload, fetch photos again to update the gallery
      fetchPhotos();
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };


  const handleLike = async (photoId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:3000/like/${photoId}`, {}, { headers: { Authorization: token } });
      // Add the photoId to likedPhotos state
      setLikedPhotos(prevLikedPhotos => [...prevLikedPhotos, photoId]);
    } catch (error) {
      console.error('Error liking photo:', error);
    }
  }

  const handleUnlike = async (photoId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:3000/unlike/${photoId}`, {}, { headers: { Authorization: token } });
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
            <div className="mx-4 text-xl font-semibold">photo gallery</div>
            <div className="border-t border-gray-600 flex-grow"></div>
          </div>
          <div className="container mb-6 rounded-lg">
            <span className="flex items-center w-max font-bold hover:bg-gray-300 rounded-2xl px-2 pr-4 py-1 ml-3 transition duration-300 ease-in-out">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              <Link to="/bubls">back to bubls</Link>
            </span>
          </div>
           <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo) => (
                photo.picture_id === "uploadcard" ? (
                  <div key={photo.picture_id} className="bg-white rounded-3xl border flex items-center justify-center aspect-[4/4] drop-shadow-xl transition duration-300 transform hover:drop-shadow-lg">
                    <div className="p-4">
                      <button className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full hover:bg-gray-300 hover:w-20 hover:h-20 transform transition-all duration-300" onClick={openUploadModal}>
                        <span className="text-2xl font-bold text-gray-700">+</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div key={photo.picture_id} className=" flex flex-col bg-white rounded-3xl border aspect-[4/4] items-center justify-center overflow-hidden shadow-lg transition duration-300 transform hover:shadow-xl">
                    <div className="outline-dashed flex-grow">
                      <img
                        className="object-cover w-full h-full rounded-3xl drop-shadow-lg"
                        src={`data:${photo.data.mimeType};base64,${photo.data.bytes}`}
                        alt={photo.data.filename}
                        onClick={() => handleImageClick(photo)}
                      />
                    </div>
                    <div className="absolute bg-white bottom-3 outline-dashed w-11/12 rounded-full p-0 text-center bg-opacity-90">
                      <div className="font-semibold">{photo.photoname}</div>
                      <div onClick={() => handleImageClick(photo)}>
                      <i class="fa-regular fa-heart mr-1"></i>
                      {photo.likes.length}</div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
          {/* Modal for displaying full-size image */}
          {selectedImage && (
            <div className={`fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <div className={`max-w-3xl max-h-full overflow-auto p-6 bg-white rounded-2xl transition-transform duration-300 ${isVisible ? 'scale-100' : 'scale-95'}`}>
                <div className="relative">
                  <div className="absolute w-12 h-12 -top-4 right-10 text-white bg-gray-700 hover:bg-black transition duration-300 rounded-full p-3 flex items-center justify-center">
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
                  <button className="absolute -top-4 -right-4 text-white bg-gray-700 hover:bg-black transition duration-300 rounded-full p-3" onClick={handleCloseModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <button type="button" className="absolute -top-4 right-24 w-12 h-12 text-white bg-gray-700 hover:bg-black transition duration-300 rounded-full p-3" onClick={() => handleDownload(selectedImage)}>
                    <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-4 bi bi-box-arrow-down" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M3.5 10a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 0 0 1h2A1.5 1.5 0 0 0 14 9.5v-8A1.5 1.5 0 0 0 12.5 0h-9A1.5 1.5 0 0 0 2 1.5v8A1.5 1.5 0 0 0 3.5 11h2a.5.5 0 0 0 0-1z"/>
                      <path fill-rule="evenodd" d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708z"/>
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
          {isUploadModalVisible && <div className={`fixed inset-0 flex items-center justify-center transition-opacity duration-300 ${isUploadModalVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className={`bg-white p-6 rounded-3xl shadow-lg md:w-9/12 lg:w-6/12 w-11/12 h-4/6 flex flex-col transition-transform duration-300 ${isUploadModalVisible ? 'scale-100' : 'scale-95'}`}>
            <h2 className="text-xl text-center font-bold mb-2">Upload Photo</h2>
            <input type="file" onChange={handleFileChange} />
            <input type="text" placeholder="Photo Name" value={selectedName} onChange={(e) => setSelectedName(e.target.value)} />
            <button onClick={handleSubmit}>Upload</button>
            <button onClick={handleCloseUploadModal}>Close</button>
          </div>
        </div>}
        </>
      )}
    </>
  );
}

export default Gallery;
