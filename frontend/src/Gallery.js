import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Banner2 from "./Components/Banner2";
import axios from "axios";
import { hostname } from "./App";
import toast, { Toaster } from "react-hot-toast";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import io from "socket.io-client";
import Options from "./Options";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Download from "yet-another-react-lightbox/plugins/download";
import Share from "yet-another-react-lightbox/plugins/share";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import ButtonSwitch from "./Components/ButtonSwitch";
import ButtonSwitch2 from "./Components/ButtonSwitch2";
import SublsDisplay from "./SublsDisplay";

const socket = io("http://localhost:3000");

function PreGalleryTest() {
  const location = useLocation();
  const { bubl_id } = location.state || "";
  const [photoGroups, setPhotoGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedFile, setSelectedFile] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [photos, setPhotos] = useState([]);
  const [likedPhotos, setLikedPhotos] = useState([]);
  const [searchGroupName, setSearchGroupname] = useState("");
  const [slideOutVisible, setSlideOutVisible] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [sortOrder, setSortOrder] = useState("likesDesc");
  const [sublModalVisible, setSublModalVisible] = useState(false);
  const [profileId, setProfileId] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [role, setRole] = useState("");
  const [toggleState, setToggleState] = useState("subls");
  const [toggleState2, setToggleState2] = useState("on");

  const [selectedBubl, setSelectedBubl] = useState(null);
  const placeholder = [
    { text: "A", size: 50 },
    { text: "B", size: 200 },
    { text: "C", size: 200 },
    { text: "D", size: 100 },
    { text: "E", size: 50 },
  ];

  const handleFileChange = (fileItems) => {
    setSelectedFile(fileItems.map((fileItem) => fileItem.file));
  };

  const handleToggle = (newState) => {
    setToggleState(newState);
    // console.log("Toggle state in parent:", newState);
  };
  const handleToggle2 = (newState) => {
    setToggleState2(newState);
  };
  // Fetch photoGroups function remains the same
  const fetchPhotoGroups = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://${hostname}:3000/getbublphotogroups`,
        { bubl_id: bubl_id },
        { headers: { Authorization: token } }
      );
      setPhotoGroups(response.data.returnArr);
      // console.log(response.data.returnArr);
    } catch (error) {
      toast.error("Error getting photoGroups. Try refreshing the page.");
    }
  };

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
      setLikedPhotos(response.data.likedPhotos);
      setRole(response.data.role);
      setProfileId(response.data.profile_id);
    } catch (error) {
      toast.error("Error getting photos. Try refreshing the page.");
    }
  };

  const createGroup = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://${hostname}:3000/addphotogroup`,
        { bubl_id: bubl_id, group_name: groupName },
        { headers: { Authorization: token } }
      );
      // console.log("success");
      toast.success("Successfully created new group.");

      toast.success("Successfully liked photo!");
    } catch (error) {
      toast.error("Error creating new photo group. Try again.");
    }
  };

  const deleteGroup = async () => {
    try {
      const token = sessionStorage.getItem("token");
      // console.log(selectedGroup);
      const response = await axios.post(
        `http://${hostname}:3000/deletephotogroup`,
        { bubl_id: bubl_id, group_name: selectedGroup },
        { headers: { Authorization: token } }
      );
      // console.log(response.data.message);
      // console.log("success");
      toast.success("Successfully deleted group.");
    } catch (error) {
      toast.error("Error deleting photo group. Try again.");
    }
  };

  const filteredPhotoGroups = () => {
    return photoGroups.filter((group) =>
      group.photo_group.includes(searchGroupName)
    );
  };

  const sortedPhotos = (filteredPhotos) => {
    switch (sortOrder) {
      case "likesAsc":
        return filteredPhotos.sort((a, b) => a.likes.length - b.likes.length);
      case "likesDesc":
        return filteredPhotos.sort((a, b) => b.likes.length - a.likes.length);
      case "dateAddedAsc":
        return filteredPhotos.sort(
          (a, b) => new Date(b.start_date) - new Date(a.start_date)
        );
      case "dateAddedDesc":
        return filteredPhotos.sort(
          (a, b) => new Date(a.start_date) - new Date(b.start_date)
        );
      case "myPhotos":
        return filteredPhotos.filter(
          (photo) => photo.creator_id === photo.profile_id
        );
      default:
        return filteredPhotos;
    }
  };

  const handleCreateGroup = (e) => {
    e.preventDefault();
    // console.log("Group name: ", groupName);
    createGroup();
    setSublModalVisible(false);
    setGroupName("");
  };

  const handleDeleteGroup = (e) => {
    e.preventDefault();
    // console.log("Group name: ", selectedGroup);
    deleteGroup();
    setSelectedGroup(null);
  };

  const handleDeletePhoto = async (selectedImage) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        `http://${hostname}:3000/photodelete`,
        { picture_id: selectedImage.picture_id },
        {
          headers: { Authorization: token },
        }
      );
      toast.success("Photo delete success!");
    } catch (error) {
      toast.error("Error deleting photo. Try again.");
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
      toast.success("Successful unlike!");
    } catch (error) {
      toast.error("Failed to unlike. Try again.");
    }
  };

  const handleProcessFile = (error, file) => {
    if (!error) {
      setSelectedFile((prevFiles) => prevFiles.filter((f) => f !== file.file));
    } else {
      console.error("Error processing file:", error);
    }
  };

  useEffect(() => {
    fetchPhotoGroups();
    fetchPhotos();
    socket.emit("joinRoom", bubl_id);
    socket.on("photoUpdate", () => {
      fetchPhotos();
      fetchPhotoGroups();
    });
  }, []);

  // Function to handle circle click
  const handleCircleClick = (input) => {
    setSelectedGroup(input);
  };

  const handleBublClick = (bubbleLabel) => {
    setSelectedBubl(bubbleLabel);
    setSelectedGroup(bubbleLabel);
    // console.log(`Bubble clicked: ${bubbleLabel}`);
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
      <Banner2 />
      <div className="flex items-center justify-between bg-white py-5 px-4">
        <div className="border-t border-gray-600 flex-grow"></div>
        <div className="mx-4 text-xl font-semibold">{displayName}</div>
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
              onClick={() => setSublModalVisible(true)}
            >
              <span className="material-symbols-outlined">add</span>
              <span className="opacity-0 w-0 text-nowrap transition-all duration-300 group-hover:w-36 sm:group-hover:w-44 group-hover:opacity-100">
                create a new subl
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
      {/* Create group form */}
      <div className="flex mb-2 flex-col sm:flex-row">
        <div className=" flex flex-grow w-full ">
          <input
            className="border p-2 pl-4 rounded-full mx-3 flex-grow "
            type="text"
            placeholder="search subls"
            value={searchGroupName}
            onChange={(e) => setSearchGroupname(e.target.value)}
            disabled={
              toggleState === "photos" || toggleState2 === "live" ? true : false
            }
          />
        </div>
        {toggleState === "photos" ? (
          <>
            <div className="mr-2 flex justify-left mt-3 ml-3 sm:mt-0 sm:ml-0 ">
              <select
                className="border h-10 p-2 w-auto focus:border-blue-500 focus:ring-blue-500 rounded-full"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="likesAsc">likes (ascending)</option>
                <option value="likesDesc">likes (descending)</option>
                <option value="dateAddedAsc">date added (latest first)</option>
                <option value="dateAddedDesc">
                  date added (earliest first)
                </option>
                <option value="myPhotos">my photos</option>
              </select>
            </div>
          </>
        ) : (
          <div className="mr-2 flex">
            <ButtonSwitch2 onToggle={handleToggle2} />
          </div>
        )}
        <div className="mr-2 sm:mt-0 sm:ml-0 ml-3 mt-3">
          <ButtonSwitch onToggle={handleToggle} />
        </div>
      </div>

      {toggleState === "subls" ? (
        <>
          {toggleState2 === "live" ? (
            <SublsDisplay
              bubbles={photoGroups}
              onBubbleClick={handleBublClick}
            />
          ) : (
            <>
              {/* Grid display of all groups */}
              <div className="mt-2 grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-4 w-full ">
                {filteredPhotoGroups().map((group, index) => (
                  <div
                    key={index}
                    className={`aspect-square flex-col w-full bg-white border-4 rounded-full flex items-center justify-center cursor-pointer `}
                    onClick={() => handleCircleClick(group.photo_group)}
                  >
                    <span className="text-3xl font-light">
                      {group.photo_group}
                    </span>
                    <div className="mt-2 flex">
                      <i className="flex items-center justify-center fa-regular fa-images text-xl mr-2"></i>
                      <span className="flex text-xl font-light">
                        {group.numPhotos}
                      </span>
                    </div>
                    {/* {/* Display the number of likes for each subl functionality. Currently kinda slows down the liking process.  */}
                    <div className="mt-1 flex">
                      <i className="flex items-center justify-center fa-regular fa-heart text-xl mr-2"></i>
                      <span className="flex text-xl font-light">
                        {group.numLikes}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Selected group popup/gallery */}
          {selectedGroup && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex flex-col justify-center items-center">
              <div className="flex flex-col bg-white w-10/12 h-[90vh] p-2 rounded-2xl">
                {/* Close button */}
                <div className="flex flex-initial justify-between p-2 ">
                  <div
                    className="flex flex-initial items-center justify-center cursor-pointer "
                    onClick={() => {
                      setSelectedGroup(null);
                    }}
                  >
                    <i className="fas fa-times ml-2 w-12 h-12 justify-center items-center flex text-center text-black hover:rotate-90 transition-all duration-300 border p-2 rounded-full"></i>
                  </div>
                  <select
                    className="border h-12 p-2 focus:border-blue-500 focus:ring-blue-500 rounded-full"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="likesAsc">likes (ascending)</option>
                    <option value="likesDesc">likes (descending)</option>
                    <option value="dateAddedAsc">
                      date added (latest first)
                    </option>
                    <option value="dateAddedDesc">
                      date added (earliest first)
                    </option>
                    <option value="myPhotos">my photos</option>
                  </select>
                  {role === "admin" ? (
                    <div
                      className="flex items-center mr-2 justify-center rounded-full  cursor-pointer border "
                      onClick={handleDeleteGroup}
                    >
                      <i className="cursor-pointer w-12 h-12 justify-center items-center flex text-center fas fa-trash text-black hover:text-red-600 "></i>
                    </div>
                  ) : null}
                </div>

                <div className="flex-grow w-full h-full grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-2 overflow-y-scroll no-scrollbar">
                  {sortedPhotos(photos).map((photo, index) =>
                    photo.photo_group === selectedGroup ? (
                      <div key={index} className="relative m-2 flex-grow">
                        <div
                          onClick={() => {
                            setLightboxIndex(index);
                            setLightboxOpen(true);
                          }}
                          className="flex cursor-pointer p-3 h-12 w-12 rounded-full absolute z-50 top-5 left-5 bg-white text-center items-center justify-between "
                        >
                          <i className="flex items-center w-full justify-center fa-solid fa-up-right-and-down-left-from-center"></i>
                        </div>
                        {photo.creator_id === profileId || role === "admin" ? (
                          <div
                            className="flex p-3 h-12 w-12 rounded-full absolute text-center items-center justify-center cursor-pointer z-50 top-5 left-20 bg-white"
                            onClick={() => {
                              handleDeletePhoto(photo);
                            }}
                          >
                            <i className="flex items-center justify-center fa-solid fa-trash"></i>
                          </div>
                        ) : (
                          <></>
                        )}
                        {likedPhotos.includes(photo.picture_id) ? (
                          <div className="absolute flex justify-between z-50 right-5 top-5 bg-white rounded-full p-3">
                            <i className="flex items-center mr-1 w-full justify-center text-red-500 fa-solid fa-heart "></i>
                            <span className="flex items-center ml-1 justify-center text-center w-full">
                              {photo.likes.length}
                            </span>
                          </div>
                        ) : (
                          <div className="absolute flex justify-between z-50 right-5 top-5 bg-white rounded-full p-3">
                            <i className="flex items-center mr-1 w-full justify-center fa-regular fa-heart "></i>
                            <span className="flex items-center ml-1 justify-center text-center w-full">
                              {photo.likes.length}
                            </span>
                          </div>
                        )}
                        <div className="aspect-[3/4]">
                          <img
                            onDoubleClick={() => {
                              if (likedPhotos.includes(photo.picture_id)) {
                                handleUnlike(photo.picture_id);
                              } else {
                                handleLike(photo.picture_id);
                              }
                            }}
                            className="object-cover w-full h-full rounded-3xl drop-shadow-lg"
                            src={`data:${photo.data.mimeType};base64,${photo.data.bytes}`}
                            alt={photo.data.filename}
                          />
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
                <Lightbox
                  open={lightboxOpen}
                  index={lightboxIndex}
                  close={() => setLightboxOpen(false)}
                  slides={sortedPhotos(photos)
                    .filter((photo) => photo.photo_group === selectedGroup)
                    .map((photo) => ({
                      src: `data:${photo.data.mimeType};base64,${photo.data.bytes}`,
                      caption: `${photo.likes.length} likes`,
                    }))}
                  plugins={[
                    Captions,
                    Fullscreen,
                    Zoom,
                    Slideshow,
                    Thumbnails,
                    Download,
                    Share,
                  ]}
                  controller={{
                    closeOnBackdropClick: false,
                    closeOnPullDown: true,
                    closeOnPullUp: true,
                  }}
                />
                <div className="m-2">
                  <FilePond
                    files={selectedFile}
                    onupdatefiles={handleFileChange}
                    maxFiles={5}
                    maxParallelUploads={3}
                    allowImagePreview={false}
                    allowProcess={true}
                    allowMultiple={true}
                    allowReorder={true}
                    allowRevert={false}
                    dropOnPage={true}
                    onprocessfile={handleProcessFile}
                    allow
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
                          console.error(
                            "Error uploading photoGroups:",
                            response
                          ),
                        ondata: (formData) => {
                          formData.append("photoname", "placeholder name");
                          formData.append("bubl_id", bubl_id);
                          formData.append(
                            "photodesc",
                            "placeholder description"
                          );
                          formData.append("photo_group", selectedGroup);
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
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex-grow w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 overflow-y-scroll no-scrollbar">
            {photos.map((photo, index) => (
              <div key={index} className="relative m-2 flex-grow">
                <div
                  onClick={() => {
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  }}
                  className="flex cursor-pointer p-3 h-12 w-12 rounded-full absolute z-50 top-5 left-5 bg-white text-center items-center justify-between "
                >
                  <i className="flex items-center w-full justify-center fa-solid fa-up-right-and-down-left-from-center"></i>
                </div>
                {photo.creator_id === profileId || role === "admin" ? (
                  <div
                    className="flex p-3 h-12 w-12 rounded-full absolute text-center items-center justify-center cursor-pointer z-50 top-5 left-20 bg-white"
                    onClick={() => {
                      handleDeletePhoto(photo);
                    }}
                  >
                    <i className="flex items-center justify-center fa-solid fa-trash"></i>
                  </div>
                ) : (
                  <></>
                )}
                {likedPhotos.includes(photo.picture_id) ? (
                  <div className="absolute flex justify-between z-10 right-5 top-5 bg-white rounded-full p-3">
                    <i className="flex items-center mr-1 w-full justify-center text-red-500 fa-solid fa-heart "></i>
                    <span className="flex items-center ml-1 justify-center text-center w-full">
                      {photo.likes.length}
                    </span>
                  </div>
                ) : (
                  <div className="absolute flex justify-between z-10 right-5 top-5 bg-white rounded-full p-3">
                    <i className="flex items-center mr-1 w-full justify-center fa-regular fa-heart "></i>
                    <span className="flex items-center ml-1 justify-center text-center w-full">
                      {photo.likes.length}
                    </span>
                  </div>
                )}
                <div className="aspect-[3/4]">
                  <img
                    onDoubleClick={() => {
                      if (likedPhotos.includes(photo.picture_id)) {
                        handleUnlike(photo.picture_id);
                      } else {
                        handleLike(photo.picture_id);
                      }
                    }}
                    className="object-cover w-full h-full rounded-3xl drop-shadow-lg"
                    src={`data:${photo.data.mimeType};base64,${photo.data.bytes}`}
                    alt={photo.data.filename}
                  />
                </div>
              </div>
            ))}
          </div>
          <Lightbox
            open={lightboxOpen}
            index={lightboxIndex}
            close={() => setLightboxOpen(false)}
            slides={sortedPhotos(photos).map((photo) => ({
              src: `data:${photo.data.mimeType};base64,${photo.data.bytes}`,
              caption: `${photo.likes.length} likes`,
            }))}
            plugins={[
              Captions,
              Fullscreen,
              Zoom,
              Slideshow,
              Thumbnails,
              Download,
              Share,
            ]}
            controller={{
              closeOnBackdropClick: false,
              closeOnPullDown: true,
              closeOnPullUp: true,
            }}
          />
        </>
      )}

      {slideOutVisible && (
        <Options bubl_id={bubl_id} onClose={() => setSlideOutVisible(false)} />
      )}
      {sublModalVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex flex-col justify-center items-center">
          <div className="bg-white w-1/2 h-max p-2 rounded-2xl">
            <h1 className="text-center font-semibold mb-2">
              create a new subl
            </h1>
            <form className="flex w-full" onSubmit={handleCreateGroup}>
              <div className="flex-grow">
                <input
                  className="border w-full h-12 pl-3 p-2 rounded-full"
                  type="text"
                  placeholder="new subl name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                />
              </div>
              <div className="flex-initial">
                <button type="submit">
                  <i className="flex items-center justify-center fas fa-check ml-2 w-12 h-12 text-center text-black hover:text-green-600 border p-2 rounded-full"></i>
                </button>
              </div>
              <div
                className="flex-initial items-center justify-center cursor-pointer "
                onClick={() => setSublModalVisible(false)}
              >
                <i className="flex items-center justify-center fas fa-times ml-2 w-12 h-12 text-center text-black hover:text-red-600 border p-2 rounded-full"></i>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default PreGalleryTest;
