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
import About from "./Views/About";
import PreGalleryTest from "./Gallery";
import InvitesDisplay from "./InvitesDisplay";
import OptionsMenuRequests from "./OptionsMenuRequests";
import AdminPage from "./AdminPage";
export const hostname = "localhost";

function App() {
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");

  const handleLogin = (token) => {
    setToken(token);
    sessionStorage.setItem("token", token);
  };

  const handleLogout = () => {
    setToken("");
    sessionStorage.removeItem("token");
  };

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
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
            token ? <Navigate to="/bubls" /> : <Login onLogin={handleLogin} />
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
            token ? (
              <Profile onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/gallery"
          element={token ? <PreGalleryTest /> : <Navigate to="/login" />}
        />
        <Route
          path="/invites"
          element={token ? <InvitesDisplay /> : <Navigate to="/login" />}
        />
        <Route
          path="/requests"
          element={token ? <OptionsMenuRequests /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={token ? <AdminPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
