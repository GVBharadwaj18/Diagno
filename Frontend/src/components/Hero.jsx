import React from "react";
import { Link } from "react-router-dom";
import heroScan from "../assets/hero_scan.png";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>AI-Powered Precision Diagnostics</h1>
        <p>
          Diagno delivers clinical-grade multi-disease detection — heart disease,
          diabetes, lung cancer, and breast cancer — in seconds. Powered by advanced
          machine learning, built for everyone.
        </p>
        <Link to="/predictors" style={{ textDecoration: "none" }}>
          <div className="pos">
            <button className="btn btn-primary">
              Start Scanning →
            </button>
          </div>
        </Link>
      </div>
      <div className="hero-image">
        <img src={heroScan} alt="Diagno — Precision Medical Diagnostics" />
      </div>
    </section>
  );
}

export default Hero;
