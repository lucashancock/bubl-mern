// Gallery.js
import React from 'react';
import { useParams } from 'react-router-dom';

function Gallery() {
  const { bubl_id } = useParams(); // Access bubl_id from the route params
  console.log(bubl_id); // Log bubl_id to check if it's correctly received

  return (
    <div>
      <h2>Gallery for Bubl {bubl_id}</h2>
      {/* Add gallery content here */}
    </div>
  );
}

export default Gallery;
