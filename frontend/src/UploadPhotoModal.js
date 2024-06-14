import React, { useState, useEffect } from "react";
import axios from "axios";
import { hostname } from "./App";
import ReactDOM from "react-dom";
import { FilePond, File, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";

import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

function UploadPhotoModal({ handleCloseUploadModal, bubl_id }) {
  const [selectedName, setSelectedName] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [previewURL, setPreviewURL] = useState("");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleFileChange = (fileItems) => {
    setSelectedFile(fileItems);
    if (fileItems.length > 0) {
      const file = fileItems[0].file;
      setPreviewURL(URL.createObjectURL(file));
    } else {
      setPreviewURL("");
    }
  };
  const handleSubmit = async () => {
    var button = document.getElementById("submitButton");
    button.disabled = true;
    if (selectedFile.length > 0 && selectedName) {
      const formData = new FormData();
      formData.append("photo", selectedFile[0].file);
      formData.append("photoname", selectedName);
      formData.append("photodesc", selectedDescription);
      formData.append("bubl_id", bubl_id);
      const token = sessionStorage.getItem("token");
      try {
        const response = await axios.post(
          `http://${hostname}:3000/photoupload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: token,
            },
          }
        );
        console.log("Photo upload successful:", response.data);
        handleClose();
        setTimeout(() => {
          button.disabled = false;
        }, 1000);
        // fetchPhotos();
        // fetchLikedPhotos();
      } catch (error) {
        button.disabled = false;
        console.error("Error uploading photo:", error);
      }
    } else {
      console.error("No file/name selected");
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => handleCloseUploadModal(), 300);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"
        }`}
    >
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div
        className={`bg-white p-6 rounded-3xl shadow-lg md:w-9/12 lg:w-6/12 w-11/12 h-auto flex flex-col transition-transform duration-300 ${isVisible ? "scale-100" : "scale-95"
          }`}
      >
        <h2 className="text-lg text-center bg-black text-white rounded-2xl mb-2 p-1">
          upload photo
        </h2>

        <div className="mt-2">
          <FilePond
            files={selectedFile}
            onupdatefiles={handleFileChange}
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
                onload: (response) => handleClose(),
                onerror: (response) =>
                  console.error("Error uploading photo:", response),
                ondata: (formData) => {
                  formData.append("photoname", selectedName);
                  formData.append("bubl_id", bubl_id);
                  formData.append("photodesc", selectedDescription);
                  return formData;
                },
              },
            }}
            instantUpload={false}
            name="photo"
            allowProcess={false}
            styleButtonRemoveItemPosition={"left"}
            labelIdle='drag & drop your files or <span class="filepond--label-action">browse</span>'
            credits={false}
          />
        </div>

        <div className="flex items-center justify-between mt-auto">
          <input
            type="text"
            placeholder="photo name"
            value={selectedName}
            onChange={(e) => setSelectedName(e.target.value)}
            className="flex-grow mr-2 px-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
          />
          <button
            id="submitButton"
            onClick={handleSubmit}
            className="relative flex items-center px-2 py-2 border border-black rounded-full focus:outline-none transition-all duration-300 group"
          >
            <span className="material-symbols-outlined transition-all duration-300">
              upload
            </span>
            <span className="opacity-0 w-0 text-white transition-all duration-300 group-hover:w-20 group-hover:opacity-100 group-hover:text-black">
              upload
            </span>
          </button>
          <button
            onClick={handleClose}
            className="relative flex items-center px-2 py-2 ml-2 bg-gray-500 text-white rounded-full focus:outline-none transition-all duration-300 group"
          >
            <span className="material-symbols-outlined transition-all duration-300">
              close
            </span>
            <span className="opacity-0 w-0 transition-all duration-300 group-hover:w-20 group-hover:opacity-100">
              close
            </span>
          </button>
        </div>
        <div className="flex">
          <input
            type="text"
            placeholder="optional description"
            value={selectedDescription}
            onChange={(e) => setSelectedDescription(e.target.value)}
            className="flex-grow mt-3 mr-2 px-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
}

export default UploadPhotoModal;
