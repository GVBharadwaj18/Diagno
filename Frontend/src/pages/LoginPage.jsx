import React, { useState } from "react";
import "../App.css";
import { useUserContext } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUserInfo } = useUserContext();
  const navigate = useNavigate();
  async function login(e) {
    e.preventDefault();

    // Client-side validation
    if (!email || !password) {
      toast.error("Please fill out all fields");
      return;
    }

    // Email format validation including the presence of "@"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        // Show server-side error message when available
        toast.error(result?.message || (response.status === 401 ? "Email or password does not match" : `Error: ${response.status}`));
        return;
      }

      // The backend wraps the response: { statusCode, data: { user, accessToken, refreshToken }, message }
      setUserInfo(result.data?.user || result.data);
      toast.success("Login successful! Redirecting to homepage...");

      // Short delay so toast is visible, then redirect
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  }

  // Function for Guest Login
  function loginAsGuest() {
    // Set predefined guest credentials
    setEmail("guestuser10@gmail.com");
    setPassword("12345678");
  }

  return (
    <div className="login-page">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="login-container">
        <div className="login-form-container">
          <h2 className="login-title">Welcome Back</h2>
          <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
            Sign in to your Diagno account
          </p>
          <form className="login-form" onSubmit={login}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>
          {/* Guest Login Button */}
          <button onClick={loginAsGuest} className="guest-login-button">
            Continue as Guest
          </button>
          <div className="login-footer">
            <p>
              Don't have an account? <Link to="/signup">Create one</Link>
            </p>
          </div>
        </div>
        {/* Pure CSS gradient panel — no image needed */}
        <div className="login-image" />
      </div>
    </div>
  );
}

export default LoginPage;
