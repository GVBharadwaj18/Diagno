import React from "react";
import { NavLink } from "react-router-dom";
import { FiGithub, FiHeart } from "react-icons/fi";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="17" stroke="url(#fg1)" strokeWidth="1.5" />
            <polyline
              points="4,18 9,18 11,10 13,26 16,14 18,22 20,18 32,18"
              stroke="url(#fg1)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <defs>
              <linearGradient id="fg1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00d4ff" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
          </svg>
          <span className="footer-brand-name">Diagno</span>
        </div>

        {/* Nav links */}
        <nav className="footer-links">
          <NavLink to="/" className="footer-link">Home</NavLink>
          <NavLink to="/predictors" className="footer-link">Predictors</NavLink>
          <NavLink to="/login" className="footer-link">Login</NavLink>
          <NavLink to="/signup" className="footer-link">Sign Up</NavLink>
        </nav>

        {/* Disclaimer */}
        <p className="footer-disclaimer">
          Diagno is an educational AI tool and does <strong>not</strong> constitute
          medical advice. Always consult a qualified healthcare professional.
        </p>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span>© {year} Diagno. Built with <FiHeart size={12} style={{ color: "#f87171", verticalAlign: "middle" }} /> for early detection.</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-github"
            aria-label="GitHub"
          >
            <FiGithub size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
