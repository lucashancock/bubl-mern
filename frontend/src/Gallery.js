import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Banner2 from "./Components/Banner2";
import UploadPhotoModal from "./UploadPhotoModal";
import Options from "./Options";
import { hostname } from "./App";
import io from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";

const socket = io("http://localhost:3000");

function Gallery() {
  const { bubl_id } = useParams();
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [likedPhotos, setLikedPhotos] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [slideOutVisible, setSlideOutVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    socket.emit("joinRoom", bubl_id);

    socket.on("photoUpdate", () => {
      fetchPhotos();
      fetchLikedPhotos();
    });

    return () => {
      socket.off("photoUpdate");
      socket.emit("leaveRoom", bubl_id);
    };
  }, []);

  const fetchPhotos = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://${hostname}:3000/bublphotos`,
        { bubl_id: bubl_id },
        { headers: { Authorization: token } }
      );
      setPhotos(response.data.returnArr);
      if (!displayName) setDisplayName(response.data.displayName);
      setError("");
    } catch (error) {
      toast.error("Error getting photos. Try refreshing the page.");
    }
  };

  const fetchLikedPhotos = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`http://${hostname}:3000/likedphotos`, {
        headers: { Authorization: token },
      });
      setLikedPhotos(response.data.likedp);
    } catch (error) {
      console.error("Error fetching liked photos.");
    }
  };

  const handleDelete = async (selectedImage) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://${hostname}:3000/photodelete`,
        { picture_id: selectedImage.picture_id },
        {
          headers: { Authorization: token },
        }
      );
      handleCloseImage();
      toast.success("Photo delete success!");
    } catch (error) {
      console.error(
        "Error deleting picture. You may not be the uploader or an admin."
      );
      toast.error("Error deleting photo. Try again.");
    }
  };

  useEffect(() => {
    fetchPhotos();
    fetchLikedPhotos();
  }, []);

  const handleImageOpen = (photo) => {
    setSelectedImage(photo);
    setTimeout(() => setIsVisible(true), 0);
  };

  const handleCloseImage = () => {
    setIsVisible(false);
    setTimeout(() => setSelectedImage(null), 300);
  };

  const handleDownload = (photo) => {
    try {
      const byteCharacters = atob(photo.data.bytes);
      const byteNumbers = new Uint8Array(
        Array.from(byteCharacters, (char) => char.charCodeAt(0))
      );
      const blob = new Blob([byteNumbers], { type: photo.data.mimeType });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", photo.data.filename);
      link.click();
      URL.revokeObjectURL(link.href);
      toast.success("Successful download. Check your downloads folder.");
    } catch (error) {
      toast.error("Error downloading file. Try again.");
    }
  };

  const handleLike = async (photoId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        `http://${hostname}:3000/like/${photoId}`,
        {},
        { headers: { Authorization: token } }
      );
      setLikedPhotos((prevLikedPhotos) => [...prevLikedPhotos, photoId]);
      toast.success("Successfully liked photo!");
    } catch (error) {
      toast.error("Error liking photo. Try again.");
    }
  };

  const handleUnlike = async (photoId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        `http://${hostname}:3000/unlike/${photoId}`,
        {},
        { headers: { Authorization: token } }
      );
      setLikedPhotos((prevLikedPhotos) =>
        prevLikedPhotos.filter((id) => id !== photoId)
      );
      toast.success("Successful unlike!");
    } catch (error) {
      toast.error("Failed to unlike. Try again.");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (e) => {
    setSortOrder(e.target.value);
  };

  const filteredAndSortedPhotos = () => {
    let filteredPhotos = photos.filter(
      (photo) =>
        photo.photoname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortOrder) {
      case "likesAsc":
        return filteredPhotos.sort((a, b) => a.likes.length - b.likes.length);
      case "likesDesc":
        return filteredPhotos.sort((a, b) => b.likes.length - a.likes.length);
      case "alphabetical":
        return filteredPhotos.sort((a, b) =>
          a.photoname.localeCompare(b.photoname)
        );
      case "dateAddedAsc":
        return filteredPhotos.sort(
          (a, b) => new Date(b.start_date) - new Date(a.start_date)
        );
      case "dateAddedDesc":
        return filteredPhotos.sort(
          (a, b) => new Date(a.start_date) - new Date(b.start_date)
        );
      default:
        return filteredPhotos;
    }
  };

  return (
    <>
      <Toaster
        toastOptions={{
          className: "",
          success: {
            style: {
              border: "1px solid #000000",
              padding: "16px",
              color: "#000000",
            },
          },
          error: {
            style: {
              border: "1px solid #000000",
              padding: "16px",
              color: "#000000",
            },
          },
        }}
      />
      {error !== "" ? (
        <p>404 Not found.</p>
      ) : (
        <>
          <Banner2 />
          <div className="flex items-center justify-between bg-white py-5 px-4">
            <div className="border-t border-gray-600 flex-grow"></div>
            <div className="mx-4 text-xl font-semibold">
              {displayName}'s photo gallery
            </div>
            <div className="border-t border-gray-600 flex-grow"></div>
          </div>
          <div className="flex mb-6">
            <div className="flex flex-initial w-44 justify-start ml-1">
              <span className="flex items-center font-semibold hover:bg-gray-300 rounded-2xl px-4 py-1 ml-3 transition duration-300 ease-in-out">
                <i className="fas fa-chevron-left mr-2"></i>
                <Link to="/bubls">back to bubls</Link>
              </span>
            </div>
            <div className="flex-grow flex justify-center">
              <div className="items-center">
                <button
                  className="flex items-center px-2 py-2 bg-black text-white rounded-full transition-all duration-300 group"
                  onClick={() => setUploadModalVisible(true)}
                >
                  <span className="material-symbols-outlined">add</span>
                  <span className="opacity-0 w-0 text-nowrap transition-all duration-300 group-hover:w-36 sm:group-hover:w-44 group-hover:opacity-100">
                    upload a photo
                  </span>
                </button>
              </div>
            </div>
            <button onClick={() => setSlideOutVisible(true)}>
              <div className="flex flex-1 w-44 justify-end mr-1">
                <span className="flex items-center font-semibold hover:bg-gray-300 px-4 py-2 mr-3 rounded-2xl transition duration-300 ease-in-out">
                  more
                  <i className="fa-solid fa-bars ml-2"></i>
                </span>
              </div>
            </button>
          </div>

          <div className="flex mb-6">
            <input
              type="text"
              className="border p-2 pl-4 rounded-2xl ml-3 flex-grow"
              placeholder="search photos"
              value={searchTerm}
              onChange={handleSearch}
            />
            <select
              className="border block border-gray-400 p-2 pl-4 w-min focus:border-blue-500 focus:ring-blue-500 rounded-2xl mx-3 "
              value={sortOrder}
              onChange={handleSort}
            >
              <option value="">sort by</option>
              <option value="likesAsc">likes (ascending)</option>
              <option value="likesDesc">likes (descending)</option>
              <option value="alphabetical">alphabetical</option>
              <option value="dateAddedAsc">date added (latest first)</option>
              <option value="dateAddedDesc">date added (earliest first)</option>
            </select>
          </div>

          {photos.length === 0 ? (
            <div>
              <p className="text-center w-full"> no photos! </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 p-3 md:grid-cols-3 gap-4">
              {filteredAndSortedPhotos().map((photo) => (
                <div
                  key={photo.picture_id}
                  className="cursor-pointer flex flex-col rounded-3xl border aspect-[16:9] items-center justify-center overflow-hidden transition duration-300 transform hover:shadow-xl"
                >
                  <div className="flex-grow">
                    <img
                      className="object-cover w-full h-full rounded-3xl drop-shadow-lg"
                      src={`data:${photo.data.mimeType};base64,${photo.data.bytes}`}
                      alt={photo.data.filename}
                      onClick={() => handleImageOpen(photo)}
                    />
                  </div>
                  <div className="absolute flex bg-white bottom-3 w-11/12 outline-black border rounded-full bg-opacity-60">
                    <div
                      className="flex flex-auto justify-center items-center font-semibold"
                      onClick={() => handleImageOpen(photo)}
                    >
                      <span className="mr-3 text-center items-center justify-center">
                        {photo.photoname}
                      </span>
                      <i className="fa-regular fa-heart mr-1"></i>
                      {photo.likes.length}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {uploadModalVisible && (
            <UploadPhotoModal
              handleCloseUploadModal={() => setUploadModalVisible(false)}
              bubl_id={bubl_id}
            />
          )}

          {selectedImage && (
            <div
              className={`fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center transition-opacity duration-300 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className={`w-max h-max overflow-auto p-2 bg-white rounded-2xl transition-transform duration-300 ${
                  isVisible ? "scale-100" : "scale-75"
                }`}
              >
                <div className="absolute left-2 top-2 h-fit flex mb-3 bg-white p-2 rounded-br-2xl">
                  <div className="flex-initial p-2 w-10  mr-2 text-white bg-black rounded-full flex justify-center items-center transition-all duration-300">
                    {likedPhotos.includes(selectedImage.picture_id) ? (
                      <button
                        className="text-red-500 hover:text-red-700 w-full transition-all duration-300"
                        onClick={() => handleUnlike(selectedImage.picture_id)}
                      >
                        <i className="fa-solid fa-heart"></i>
                      </button>
                    ) : (
                      <button
                        className="text-white w-full transition-all duration-300"
                        onClick={() => handleLike(selectedImage.picture_id)}
                      >
                        <div>
                          <i className="fa-solid fa-heart"></i>
                        </div>
                      </button>
                    )}
                  </div>
                  <div className="flex-initial p-2 w-10  mr-2 text-white bg-black rounded-full flex justify-center items-center transition-all duration-300">
                    <button
                      className="text-white transition duration-300 w-full"
                      onClick={handleCloseImage}
                    >
                      <i className="fa-solid fa-x"></i>
                    </button>
                  </div>
                  <div className="flex-initial p-2 w-10  mr-2 text-white bg-black rounded-full flex justify-center items-center transition-all duration-300">
                    <button
                      type="button"
                      className="text-white transition duration-300 w-full"
                      onClick={() => handleDownload(selectedImage)}
                    >
                      <i className="fa-solid fa-arrow-down"></i>
                    </button>
                  </div>
                  <div className="flex-initial p-2 w-10  mr-2 text-white bg-black rounded-full flex justify-center items-center transition-all duration-300">
                    <button
                      type="button"
                      className="text-white transition-all duration-300 w-full"
                      onClick={() => handleDelete(selectedImage)}
                    >
                      <i className="fa-solid fa-trash mx-1"></i>
                    </button>
                  </div>
                </div>

                <img
                  className="mx-auto rounded-2xl"
                  src={`data:${selectedImage.data.mimeType};base64,${selectedImage.data.bytes}`}
                  alt={selectedImage.data.filename}
                />
                <div className="m-2">
                  <h3 className="text-2xl font-medium">
                    {selectedImage.photoname}
                  </h3>
                  <p className="text-sm">
                    <span className="font-semibold">uploader: </span>
                    {selectedImage.creator_username}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">description: </span>
                    {selectedImage.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {slideOutVisible && (
        <Options bubl_id={bubl_id} onClose={() => setSlideOutVisible(false)} />
      )}
    </>
  );
}

export default Gallery;
