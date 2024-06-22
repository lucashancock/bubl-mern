import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Banner2 from "./Components/Banner2";
import axios from "axios";
import { hostname } from "./App";
import toast from "react-hot-toast";
import UploadPhotoModal from "./UploadPhotoModal";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

function PreGalleryTest() {
  const location = useLocation();
  const { bubl_id } = location.state || "";
  const [photos, setPhotos] = useState([]);
  const [selectedBubl, setSelectedBubl] = useState(null);
  const [selectedFile, setSelectedFile] = useState([]);
  const handleFileChange = (fileItems) => {
    setSelectedFile(fileItems.map((fileItem) => fileItem.file));
  };
  // Fetch photos function remains the same
  const fetchPhotos = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://${hostname}:3000/bublphotos`,
        { bubl_id: bubl_id },
        { headers: { Authorization: token } }
      );
      setPhotos(response.data.returnArr);
    } catch (error) {
      toast.error("Error getting photos. Try refreshing the page.");
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Function to handle circle click
  const handleCircleClick = (index) => {
    setSelectedBubl("group_" + (index + 1));
  };

  return (
    <>
      <Banner2 />
      <div className="flex my-6">
        <div className="flex flex-initial w-44 justify-start ml-1">
          <span className="flex items-center font-semibold hover:bg-gray-300 rounded-2xl px-4 py-1 ml-3 transition duration-300 ease-in-out">
            <i className="fas fa-chevron-left mr-2"></i>
            <Link to="/bubls">back to bubls</Link>
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 justify-items-center">
        {[...Array(12)].map((_, index) => (
          <div
            key={index}
            className={`aspect-square w-full bg-gray-300 rounded-full flex items-center justify-center cursor-pointer `}
            onClick={() => handleCircleClick(index)}
          >
            <span className="text-lg font-bold">photo group {index + 1}</span>
          </div>
        ))}
      </div>
      {selectedBubl && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex flex-col justify-center items-center">
          <div className="bg-white p-4 rounded-lg">
            <div
              className="absolute top-0 right-0 m-2 cursor-pointer"
              onClick={() => setSelectedBubl(null)}
            >
              <i className="fas fa-times text-gray-600 hover:text-gray-800"></i>
            </div>
            <p>Selected photo group: {selectedBubl}</p>
            {/* Render additional details or actions here */}
          </div>
          <div>Upload photos to this photo group!</div>
          <div className=" bg-gray-100 h-fit text-center justify-center  w-52">
            <FilePond
              files={selectedFile}
              onupdatefiles={handleFileChange}
              maxFiles={3}
              allowProcess={true}
              allowMultiple={true}
              allowReorder={true}
              server={{
                url: `http://${hostname}:3000`,
                process: {
                  url: "/photoupload",
                  method: "POST",
                  headers: {
                    Authorization: sessionStorage.getItem("token"),
                  },
                  withCredentials: false,
                  onerror: (response) =>
                    console.error("Error uploading photos:", response),
                  ondata: (formData) => {
                    formData.append("photoname", "placeholder name");
                    formData.append("bubl_id", bubl_id);
                    formData.append("photodesc", "placeholder description");
                    formData.append("photo_group", selectedBubl);
                    return formData;
                  },
                },
              }}
              instantUpload={false}
              name="photos"
              styleButtonRemoveItemPosition={"left"}
              labelIdle='drag & drop up to 3 files or <span class="filepond--label-action">browse</span>'
              credits={false}
            />
          </div>
          {photos.map((photo) =>
            photo.photo_group === selectedBubl ? (
              <>
                <img
                  className="object-cover w-24 h-24 rounded-3xl drop-shadow-lg"
                  src={`data:${photo.data.mimeType};base64,${photo.data.bytes}`}
                  alt={photo.data.filename}
                />
              </>
            ) : (
              <></>
            )
          )}
        </div>
      )}
    </>
  );
}

export default PreGalleryTest;
