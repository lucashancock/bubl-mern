import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { hostname } from "./App";

function OptionsMenuInfo({ bubl_id }) {
  const [bublInfo, setBublInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch Bubl info
    const fetchBublInfo = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Assuming token is stored in sessionStorage
        const response = await axios.post(
          `http://${hostname}:3000/bublinfo`,
          { bubl_id: bubl_id },
          {
            headers: { Authorization: token },
          }
        );

        // Set Bubl info state with the data received from the server
        setBublInfo(response.data);
      } catch (error) {
        // Handle error
        setError("Error fetching Bubl info. Please try again later.");
      }
    };

    // Call the fetchBublInfo function when the component mounts
    fetchBublInfo();
  }, []); // Empty dependency array to run the effect only once when the component mounts

  return (
    <div>
      {error && <p>{error}</p>} {/* Display error message if an error occurs */}
      {bublInfo && (
        <>
          <span className="m-2 text-regular font-semibold">
            bubl information:
          </span>
          <div className="m-2 border rounded-2xl p-3">
            {/* Display Bubl info received from the server */}
            <p>
              <span className="font-semibold">name:</span> {bublInfo.name}
            </p>
            <p>
              {bublInfo.description ? (
                <>
                  <span className="font-semibold">description:</span>{" "}
                  {bublInfo.description}
                </>
              ) : (
                <>
                  <span className="font-semibold">description:</span> no
                  description provided
                </>
              )}
            </p>
            <p>
              <span className="font-semibold">privacy:</span> {bublInfo.privacy}
            </p>
            <p>
              <span className="font-semibold">capacity:</span>{" "}
              {bublInfo.capacity}
            </p>
            <p>
              <span className="font-semibold">start date:</span>{" "}
              {format(new Date(bublInfo.start_date), "MMMM dd, yyyy")}
            </p>
            <p>
              <span className="font-semibold">end date:</span>{" "}
              {format(new Date(bublInfo.end_date), "MMMM dd, yyyy")}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default OptionsMenuInfo;
