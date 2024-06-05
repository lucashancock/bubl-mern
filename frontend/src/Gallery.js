// Gallery.js
import React , { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Gallery() {
  const { bubl_id } = useParams(); // Access bubl_id from the route params
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/bublphotos', 
        { bubl_id: bubl_id },
        { headers: { Authorization: token } })
        setPhotos(response.data);
      } catch (error) {
        console.error("Error fetching photos");
      }
    };

    fetchPhotos();
  }, []);

  return (
    <>
    <div>
      <h2>Gallery for Bubl {bubl_id}</h2>
      {/* Add gallery content here */}
    </div>
    <div>
      {photos.map((photo) => (
          <div key={photo.picture_id} style={{ marginBottom: '20px' }}>
              <h3>{photo.photoname}</h3>
              <img src={`data:${photo.data.mimeType};base64,${photo.data.bytes}`} alt={photo.data.filename} style={{ maxWidth: '100%' }} />
              <p>Creator ID: {photo.creator_id}</p>
              <p>Likes: {photo.likes}</p>
              <p>Bubl ID: {photo.bubl_id}</p>
          </div>
        ))}
    </div>
    </>
  );
}

export default Gallery;
