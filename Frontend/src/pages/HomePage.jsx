import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import heroScan from "../assets/hero_scan.png";
import { FiActivity, FiShield, FiFileText } from "react-icons/fi";
import { FaHeartbeat, FaLungs, FaBiohazard, FaTint } from "react-icons/fa";

/* ---- Typewriter cycle ---- */
const DISEASES = ["Heart Disease", "Diabetes", "Lung Cancer", "Breast Cancer"];

function TypewriterText() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) {
      const t = setTimeout(() => setPaused(false), 1400);
      return () => clearTimeout(t);
    }
    const word = DISEASES[index];
    if (!deleting) {
      if (displayed.length < word.length) {
        const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 65);
        return () => clearTimeout(t);
      } else {
        setPaused(true);
        setDeleting(true);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 38);
        return () => clearTimeout(t);
      } else {
        setDeleting(false);
        setIndex((i) => (i + 1) % DISEASES.length);
      }
    }
  }, [displayed, deleting, paused, index]);

  return (
    <span className="typewriter-word">
      {displayed}
      <span className="typewriter-cursor" aria-hidden="true">|</span>
    </span>
  );
}

/* ---- Accuracy Ring ---- */
const MODELS = [
  { label: "Heart Disease", accuracy: 94, color: "#f87171", icon: <FaHeartbeat /> },
  { label: "Diabetes",      accuracy: 91, color: "#34d399", icon: <FaTint /> },
  { label: "Lung Cancer",   accuracy: 88, color: "#60a5fa", icon: <FaLungs /> },
  { label: "Breast Cancer", accuracy: 96, color: "#f472b6", icon: <FaBiohazard /> },
];

const R = 52;
const CIRC = 2 * Math.PI * R; // ≈ 326.7

function AccuracyRing({ color, accuracy, label, icon, animate }) {
  const offset = CIRC * (1 - accuracy / 100);
  return (
    <div className="acc-ring-card">
      <div className="acc-ring-svg-wrap">
        <svg width="130" height="130" viewBox="0 0 130 130">
          {/* Track */}
          <circle cx="65" cy="65" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
          {/* Progress */}
          <circle
            cx="65" cy="65" r={R}
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={animate ? offset : CIRC}
            transform="rotate(-90 65 65)"
            style={{
              transition: animate ? "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)" : "none",
              filter: `drop-shadow(0 0 8px ${color}80)`,
            }}
          />
        </svg>
        <div className="acc-ring-center">
          <span className="acc-ring-icon" style={{ color }}>{icon}</span>
          <span className="acc-ring-pct" style={{ color }}>{accuracy}%</span>
        </div>
      </div>
      <p className="acc-ring-label">{label}</p>
    </div>
  );
}

/* ---- Animated counter on scroll ---- */
function useCountUp(target, duration = 1500, active) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

const STATS_DATA = [
  { raw: 94,  display: (n) => `${n}%`,  label: "Avg. Model Accuracy" },
  { raw: 4,   display: (n) => `${n}`,   label: "Disease Models" },
  { raw: 2,   display: (n) => `<${n}s`, label: "Prediction Time" },
  { raw: 100, display: (n) => `${n}%`,  label: "Private & Secure" },
];

function StatItem({ raw, display, label, active }) {
  const count = useCountUp(raw, 1200, active);
  return (
    <div className="stat-item">
      <span className="stat-value">{display(count)}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

/* ---- Steps ---- */
const steps = [
  { icon: <FiActivity size={28} />, num: "01", title: "Enter Clinical Data",
    desc: "Fill in patient vitals manually or upload a PDF report — our parser extracts values automatically." },
  { icon: <FiShield size={28} />, num: "02", title: "AI Analyses Instantly",
    desc: "Trained ML models (Logistic Regression, SVM, CNN) process the inputs in under two seconds." },
  { icon: <FiFileText size={28} />, num: "03", title: "Download Your Report",
    desc: "Get a structured PDF report with the prediction result, all input values, and a confidence summary." },
];

/* ---- Features ---- */
const features = [
  { icon: <FaHeartbeat size={22} />, title: "Heart Disease", color: "#f87171",
    desc: "13-parameter cardiovascular risk model based on clinical ECG, cholesterol, and blood pressure data." },
  { icon: <FaTint size={22} />, title: "Diabetes", color: "#34d399",
    desc: "Glucose, BMI, insulin, and family history inputs analysed by a Logistic Regression classifier." },
  { icon: <FaLungs size={22} />, title: "Lung Cancer", color: "#60a5fa",
    desc: "CT-scan image classification powered by an Inception-style convolutional neural network." },
  { icon: <FaBiohazard size={22} />, title: "Breast Cancer", color: "#f472b6",
    desc: "Fine-needle aspirate feature analysis using an SVM trained on the Wisconsin Diagnostic dataset." },
];

/* ---- Main HomePage ---- */
function HomePage() {
  const statsRef = useRef(null);
  const accRef   = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [accVisible,   setAccVisible]   = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.target === statsRef.current && e.isIntersecting) setStatsVisible(true);
        if (e.target === accRef.current   && e.isIntersecting) setAccVisible(true);
      }),
      { threshold: 0.3 }
    );
    if (statsRef.current) io.observe(statsRef.current);
    if (accRef.current)   io.observe(accRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <div className="home-wrapper">
      {/* Floating background orbs */}
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">AI · Healthcare · Early Detection</div>
          <h1>
            Detect <TypewriterText /><br />
            <span className="hero-h1-sub">with clinical AI precision</span>
          </h1>
          <p>
            Diagno delivers clinical-grade multi-disease detection in seconds.
            Powered by advanced machine learning — built for everyone.
          </p>
          <div className="hero-cta-group">
            <Link to="/predictors" style={{ textDecoration: "none" }}>
              <button className="btn btn-primary">Start Scanning →</button>
            </Link>
            <Link to="/predictors" style={{ textDecoration: "none" }}>
              <button className="btn-ghost">View Predictors</button>
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src={heroScan} alt="Diagno — Precision Medical Diagnostics" />
        </div>
      </section>

      {/* ── Stats bar with counter ── */}
      <section className="stats-bar" ref={statsRef}>
        {STATS_DATA.map((s, i) => (
          <StatItem key={i} {...s} active={statsVisible} />
        ))}
      </section>

      {/* ── How It Works ── */}
      <section className="section how-section">
        <div className="section-header">
          <span className="section-tag">Simple Process</span>
          <h2>How It Works</h2>
          <p>Three steps from data entry to downloadable clinical report.</p>
        </div>
        <div className="steps-grid">
          {steps.map((step, i) => (
            <div key={i} className="step-card" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="step-num">{step.num}</div>
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Model Accuracy Rings ── */}
      <section className="section acc-section" ref={accRef}>
        <div className="section-header">
          <span className="section-tag">Performance</span>
          <h2>Model Accuracy</h2>
          <p>Each model is independently validated on held-out clinical test sets.</p>
        </div>
        <div className="acc-grid">
          {MODELS.map((m, i) => (
            <AccuracyRing key={i} {...m} animate={accVisible} />
          ))}
        </div>
      </section>

      {/* ── Disease Features ── */}
      <section className="section features-section">
        <div className="section-header">
          <span className="section-tag">What We Detect</span>
          <h2>Four Intelligent Predictors</h2>
          <p>Each model is trained on curated clinical datasets with rigorous validation.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card" style={{ "--accent": f.color }}>
              <div className="feature-icon" style={{ color: f.color, background: `${f.color}18` }}>
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="cta-banner">
        <div className="cta-content">
          <h2>Ready to run your first scan?</h2>
          <p>No hardware. No lab. Just clinical intelligence, instantly.</p>
          <Link to="/predictors" style={{ textDecoration: "none" }}>
            <button className="btn btn-primary">Open Predictors →</button>
          </Link>
        </div>
        <div className="cta-glow" />
      </section>
    </div>
  );
}

export default HomePage;
