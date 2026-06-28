import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { UserContext } from "../context/UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Inline SVG brand logo — no external image needed
function BrandLogo() {
  return (
    <NavLink to="/" className="brand-logo" style={{ textDecoration: "none" }}>
      <svg
        className="brand-logo-icon"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer ring */}
        <circle cx="18" cy="18" r="17" stroke="url(#grad1)" strokeWidth="1.5" />
        {/* ECG / pulse line */}
        <polyline
          points="4,18 9,18 11,10 13,26 16,14 18,22 20,18 32,18"
          stroke="url(#grad1)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
      <span className="brand-logo-text">Diagno</span>
    </NavLink>
  );
}

function Navbar() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = document.cookie
      .split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith("accessToken="));

    if (token) {
      fetchProfile();
    } else {
      setUserInfo(null);
    }

    const handleResize = () => {
      if (window.innerWidth > 954 && isMobile) {
        setIsMobile(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/profile`, {
          credentials: "include",
        }
      );
      if (response.ok) {
        const userData = await response.json();
        setUserInfo(userData);
      } else {
        setUserInfo(null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setUserInfo(null);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/logout`, {
          credentials: "include",
          method: "POST",
        }
      );
      if (response.ok) {
        setUserInfo(null);
        toast.success("You have been logged out successfully!", {
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        console.error("Logout failed with status:", response.status);
      }
    } catch (error) {
      console.error("Logout failed with error:", error);
    }
  };

  const isLoggedIn = userInfo?.data?.username;

  const toggleMobileMenu = () => {
    setIsMobile(!isMobile);
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setIsMobile(false);
    }
  };

  return (
    <nav className="navbar">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="navbar-logo">
        <BrandLogo />
      </div>
      <div className={`navbar-links ${isMobile ? "mobile active" : ""}`}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          onClick={handleLinkClick}
        >
          Home
        </NavLink>
        <NavLink
          to="/predictors"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          onClick={handleLinkClick}
        >
          Predictors
        </NavLink>
        {isLoggedIn ? (
          <div className={`navbar-auth ${isMobile ? "mobile" : ""}`}>
            <span
              style={{
                color: "#94a3b8",
                fontWeight: "500",
                fontSize: "0.95rem",
              }}
            >
              Hi, <strong style={{ color: "#00d4ff" }}>{userInfo.data.username}</strong>
            </span>
            <NavLink
              to="/"
              onClick={logout}
              className="btn btn-logout"
              style={{ cursor: "pointer" }}
            >
              Logout
            </NavLink>
          </div>
        ) : (
          <div className={`navbar-auth ${isMobile ? "mobile" : ""}`}>
            <NavLink
              to="/login"
              className="btn btn-login"
              onClick={handleLinkClick}
            >
              Log In
            </NavLink>
            <NavLink
              to="/signup"
              className="btn btn-signup"
              onClick={handleLinkClick}
            >
              Sign Up
            </NavLink>
          </div>
        )}
      </div>
      <div className="hamburger" onClick={toggleMobileMenu}>
        {isMobile ? <FaTimes size={26} /> : <FaBars size={26} />}
      </div>
    </nav>
  );
}

export default Navbar;
