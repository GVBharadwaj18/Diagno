import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card from "../components/Card";
import heartImage from "../assets/heart.png";
import lungImage from "../assets/lung.png";
import diabetesImage from "../assets/diabetes.png";
import breastImage from "../assets/breast.png";
import { UserContext } from "../context/UserContext";
import "../App.css";

function PredictorsPage() {
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLinkClick = (path) => {
    if (userInfo) {
      navigate(path);
    } else {
      toast.info("Please log in to access this predictor.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <div className="predictor-container">
      <ToastContainer theme="dark" />
      <h1>Disease Predictors</h1>
      <p className="description">
        Diagno's diagnostic suite uses state-of-the-art machine learning models
        trained on extensive clinical datasets to detect four major health conditions early.
        Choose a predictor below to begin your personalised health assessment — fast,
        private, and remarkably accurate.
      </p>
      <div className="card-container">
        <div
          onClick={() => handleLinkClick("/predictors/heart")}
          className="card"
          style={{ textDecoration: "none" }}
        >
          <Card
            image={heartImage}
            title="Heart Disease"
            description="Guarding Hearts: AI solutions for accurate prediction and early intervention in heart disease."
          />
        </div>
        <div
          onClick={() => handleLinkClick("/predictors/lung")}
          className="card"
          style={{ textDecoration: "none" }}
        >
          <Card
            image={lungImage}
            title="Lung Cancer"
            description="Clearing the Air: AI-driven insights for proactive lung cancer prediction and care."
          />
        </div>
        <div
          onClick={() => handleLinkClick("/predictors/breast")}
          className="card"
          style={{ textDecoration: "none" }}
        >
          <Card
            image={breastImage}
            title="Breast Cancer"
            description="Beyond Detection: AI innovation for early, precise breast cancer prediction and care."
          />
        </div>
        <div
          onClick={() => handleLinkClick("/predictors/diabetes")}
          className="card"
          style={{ textDecoration: "none" }}
        >
          <Card
            image={diabetesImage}
            title="Diabetes"
            description="Empowering Health: AI solutions for precise diabetes prediction and proactive wellness."
          />
        </div>
      </div>
    </div>
  );
}

export default PredictorsPage;
