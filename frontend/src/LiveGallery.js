import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

function LiveGallery({ bubl_id }) {
  const [photos, setPhotos] = useState("");

  useEffect(() => {
    // Join the room based on bubl_id
    socket.emit("joinRoom", bubl_id);

    // Listen for photo updates in the specific room
    socket.on("photoUpdate", (updatedPhotos) => {
      setPhotos("photos updated");
      console.log(updatedPhotos);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("photoUpdate");
      // You might want to leave the room when the component unmounts
      socket.emit("leaveRoom", bubl_id);
    };
  }, [bubl_id]); // Re-run effect when bubl_id changes

  return (
    <div>
      <h1>Live Photo Gallery</h1>
      <div>{photos}</div>
    </div>
  );
}

export default LiveGallery;
