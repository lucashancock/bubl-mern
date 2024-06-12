// Bubls.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import Banner2 from "./Components/Banner2";
import BublsTest from "./Bublstest";
import BublHeader from "./Components/BublHeader";
import { hostname } from "./App";

function Bubls() {
  const [bubls, setBubls] = useState([]);
  const [error, setError] = useState("");

  return (
    <>
      <p>{error}</p>
      <Banner2 />
      <BublHeader />
      <BublsTest />
    </>
  );
}

export default Bubls;
