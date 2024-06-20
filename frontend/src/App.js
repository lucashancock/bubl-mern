import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./Views/Home";
import Login from "./Login";
import Register from "./Register";
import Bubls from "./Bubls";
import Profile from "./Profile";
import Gallery from "./Gallery";
import About from "./Views/About";

export const hostname = "localhost";

function App() {
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  const [username, setUsername] = useState(
    sessionStorage.getItem("username") || ""
  );

  const handleLogin = (token, username) => {
    setToken(token);
    setUsername(username);
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("username", username);
  };

  const handleLogout = () => {
    setToken("");
    setUsername("");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setToken(token);
      setUsername(sessionStorage.getItem("username") || "");
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/bubls" username={username} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/bubls"
          element={token ? <Bubls /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={
            token ? <Profile onLogout={handleLogout} /> : <Navigate to="/" />
          }
        />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </Router>
  );
}

export default App;
