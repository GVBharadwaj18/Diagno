import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  const pathRef = useRef(null);

  // Animate the flatline ECG path
  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const len = el.getTotalLength();
    el.style.strokeDasharray = len;
    el.style.strokeDashoffset = len;
    // Trigger animation after mount
    requestAnimationFrame(() => {
      el.style.transition = "stroke-dashoffset 2.2s ease-in-out forwards";
      el.style.strokeDashoffset = "0";
    });
  }, []);

  return (
    <div className="nf-page">
      {/* Floating orbs for atmosphere */}
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />

      <div className="nf-inner">
        {/* ECG flatline SVG */}
        <div className="nf-ecg">
          <svg viewBox="0 0 500 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            {/* Flatline with one spike */}
            <path
              ref={pathRef}
              d="M0,60 L120,60 L135,60 L145,20 L155,100 L165,40 L175,80 L185,60 L500,60"
              stroke="url(#ecgGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="ecgGrad" x1="0" y1="0" x2="500" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00d4ff" />
                <stop offset="60%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#f87171" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Error code */}
        <div className="nf-code">
          <span className="nf-4">4</span>
          <div className="nf-pulse-ring" aria-hidden="true">
            <span className="nf-0">0</span>
          </div>
          <span className="nf-4">4</span>
        </div>

        <h1 className="nf-title">Patient Not Found</h1>
        <p className="nf-subtitle">
          The scan you requested returned no results.<br />
          This page has flatlined — but your health journey hasn't.
        </p>

        <div className="nf-actions">
          <Link to="/" style={{ textDecoration: "none" }}>
            <button className="btn btn-primary">← Back to Home</button>
          </Link>
          <Link to="/predictors" style={{ textDecoration: "none" }}>
            <button className="btn-ghost">Run a Scan</button>
          </Link>
        </div>

        {/* Status chips */}
        <div className="nf-chips">
          <span className="nf-chip nf-chip-red">● Signal Lost</span>
          <span className="nf-chip">Status: 404</span>
          <span className="nf-chip">Vitals: Flatline</span>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
