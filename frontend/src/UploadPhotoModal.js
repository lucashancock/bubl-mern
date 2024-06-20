import React, { useState, useEffect } from "react";
import axios from "axios";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import toast, { Toaster } from "react-hot-toast";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { hostname } from "./App";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

function UploadPhotoModal({ handleCloseUploadModal, bubl_id }) {
  const [selectedName, setSelectedName] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleFileChange = (fileItems) => {
    setSelectedFile(fileItems.map((fileItem) => fileItem.file));
  };

  const handleSubmit = async () => {
    const token = sessionStorage.getItem("token");

    try {
      if (selectedFile.length > 0 && selectedName) {
        toast.loading("Uploading photos...");
        const formData = new FormData();
        formData.append("photoname", selectedName);
        formData.append("photodesc", selectedDescription);
        formData.append("bubl_id", bubl_id);

        selectedFile.forEach((file) => {
          formData.append("photos", file);
        });

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

        // console.log("Photos upload successful:", response.data);
        toast.dismiss();
        toast.success("Photos uploaded successfully!");
        handleClose();
      } else {
        toast.error("Please select a file and provide a name.");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to upload photos.");
      //console.error("Error uploading photos:", error);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => handleCloseUploadModal(), 300);
  };

  return (
    <>
      <Toaster
        toastOptions={{
          className: "",
          id: "toast",
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
      <div
        className={`fixed inset-0 flex items-center justify-center transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div
          className={`bg-white p-6 rounded-3xl shadow-lg md:w-9/12 lg:w-6/12 w-11/12 h-auto flex flex-col transition-transform duration-300 ${
            isVisible ? "scale-100" : "scale-95"
          }`}
        >
          <h2 className="text-lg text-center bg-black text-white rounded-2xl mb-2 p-1">
            Upload Photos
          </h2>

          <div className="my-2 h-96 overflow-y-scroll">
            <div className="flex-col bg-gray-100 h-full text-center justify-center  w-full">
              <FilePond
                files={selectedFile}
                onupdatefiles={handleFileChange}
                maxFiles={3}
                allowProcess={false}
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
                    onload: (response) => handleClose(),
                    onerror: (response) =>
                      console.error("Error uploading photos:", response),
                    ondata: (formData) => {
                      formData.append("photoname", selectedName);
                      formData.append("bubl_id", bubl_id);
                      formData.append("photodesc", selectedDescription);
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
          </div>

          <div className="flex items-center justify-between mt-auto">
            <input
              type="text"
              placeholder="photo name (applies to all, can edit later)"
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
              className="flex-grow mr-2 px-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
            />
            <button
              onClick={handleSubmit}
              className="relative flex items-center px-2 py-2 border border-black rounded-full focus:outline-none transition-all duration-300 group"
            >
              <span className="material-symbols-outlined transition-all duration-300">
                Upload
              </span>
              <span className="opacity-0 w-0 text-white transition-all duration-300 group-hover:w-20 group-hover:opacity-100 group-hover:text-black">
                Upload
              </span>
            </button>
            <button
              onClick={handleClose}
              className="relative flex items-center px-2 py-2 ml-2 bg-gray-500 text-white rounded-full focus:outline-none transition-all duration-300 group"
            >
              <span className="material-symbols-outlined transition-all duration-300">
                Close
              </span>
              <span className="opacity-0 w-0 transition-all duration-300 group-hover:w-20 group-hover:opacity-100">
                Close
              </span>
            </button>
          </div>
          <div className="flex">
            <input
              type="text"
              placeholder="optional description (applies to all, can edit later)"
              value={selectedDescription}
              onChange={(e) => setSelectedDescription(e.target.value)}
              className="flex-grow mt-3 mr-2 px-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default UploadPhotoModal;
