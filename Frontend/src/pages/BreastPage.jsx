import React, { useState } from "react";
import "../App.css";
import { FiUpload, FiFileText } from "react-icons/fi";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { ClipLoader } from "react-spinners";

const BreastPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
  });
  const [predictionResult, setPredictionResult] = useState("");
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [imageUploaded, setImageUploaded] = useState(false); // State to track image upload
  const [showDummyModal, setShowDummyModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImageUploaded(true); // Set imageUploaded to true
      setError("");
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError("Please upload an image file.");
      return;
    }

    setLoading(true); // Start loading indicator

    const formDataToSend = new FormData();
    formDataToSend.append("image", imageFile);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("age", formData.age);
    formDataToSend.append("gender", formData.gender);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/predict/breast-pred`,
        {
          method: "POST",
          body: formDataToSend,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Prediction request failed.");
      }

      const data = await response.json();

      if (data.prediction) {
        setPredictionResult(data.prediction);
        setError("");
        setShowResult(true);
      } else {
        throw new Error("Prediction failed.");
      }
    } catch (error) {
      console.error("Prediction failed:", error.message);
      setError("Failed to predict. Please try again.");
      setPredictionResult("");
      setShowResult(false);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  const handleRePredict = () => {
    setShowResult(false);
    setPredictionResult("");
    setFormData({
      name: "",
      age: "",
      gender: "",
    });
    setImageFile(null);
    setImageUploaded(false); // Reset imageUploaded state
  };

  const generateDynamicPDF = async () => {
    try {
      const existingPdfBytes = await fetch("/Report.pdf").then((res) =>
        res.arrayBuffer()
      );

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Section Title
      firstPage.drawText("PATIENT DIAGNOSTIC REPORT", {
        x: 45,
        y: height - 150,
        font: helveticaBold,
        size: 16,
        color: rgb(0.0118, 0.2941, 0.6784),
      });

      // Date of Report
      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      firstPage.drawText(`Date: ${currentDate}`, {
        x: 45,
        y: height - 165,
        font: helveticaFont,
        size: 10,
        color: rgb(0.4, 0.4, 0.4),
      });

      // Patient Info Section Header
      firstPage.drawText("PATIENT DETAILS", {
        x: 45,
        y: height - 195,
        font: helveticaBold,
        size: 11,
        color: rgb(0.2, 0.2, 0.2),
      });

      // Patient Info Table Box
      firstPage.drawRectangle({
        x: 45,
        y: height - 245,
        width: 505,
        height: 40,
        color: rgb(0.97, 0.98, 0.99),
        borderColor: rgb(0.9, 0.92, 0.95),
        borderWidth: 1,
      });

      // Patient Info Text Row
      firstPage.drawText(`Name: ${formData.name}`, {
        x: 60,
        y: height - 228,
        font: helveticaFont,
        size: 11,
        color: rgb(0.1, 0.1, 0.1),
      });
      firstPage.drawText(`Age: ${formData.age}`, {
        x: 240,
        y: height - 228,
        font: helveticaFont,
        size: 11,
        color: rgb(0.1, 0.1, 0.1),
      });
      firstPage.drawText(`Gender: ${formData.gender === "M" ? "Male" : "Female"}`, {
        x: 380,
        y: height - 228,
        font: helveticaFont,
        size: 11,
        color: rgb(0.1, 0.1, 0.1),
      });

      // Diagnosis Section Header
      firstPage.drawText("DIAGNOSTIC ASSESSMENT", {
        x: 45,
        y: height - 280,
        font: helveticaBold,
        size: 11,
        color: rgb(0.2, 0.2, 0.2),
      });

      const isPositive = !predictionResult.toLowerCase().includes("not");
      const fullPredictionResult = isPositive
        ? "The person is suffering from Breast Cancer."
        : "The person is not suffering from Breast Cancer.";

      // Draw Diagnosis Box
      firstPage.drawRectangle({
        x: 45,
        y: height - 360,
        width: 505,
        height: 65,
        color: isPositive ? rgb(0.996, 0.95, 0.95) : rgb(0.94, 0.99, 0.96),
        borderColor: isPositive ? rgb(0.937, 0.267, 0.267) : rgb(0.133, 0.773, 0.369),
        borderWidth: 1.5,
      });

      // Result title
      firstPage.drawText(isPositive ? "HIGH RISK DETECTED" : "NO RISK DETECTED", {
        x: 60,
        y: height - 320,
        font: helveticaBold,
        size: 12,
        color: isPositive ? rgb(0.78, 0.15, 0.15) : rgb(0.09, 0.54, 0.24),
      });

      // Result detail text
      firstPage.drawText(fullPredictionResult, {
        x: 60,
        y: height - 342,
        font: helveticaFont,
        size: 11,
        color: rgb(0.1, 0.1, 0.1),
      });

      // Disclaimer Box
      firstPage.drawText("Disclaimer & Clinical Notes:", {
        x: 45,
        y: height - 400,
        font: helveticaBold,
        size: 10,
        color: rgb(0.3, 0.3, 0.3),
      });

      const disclaimerText1 = "This prediction is generated by an artificial intelligence model trained on clinical diagnostic data.";
      const disclaimerText2 = "It is intended for screening and educational assistance only, and does not constitute a medical diagnosis.";
      const disclaimerText3 = "Please present this report to a qualified healthcare provider for clinical correlation and definitive diagnosis.";

      firstPage.drawText(disclaimerText1, {
        x: 45,
        y: height - 418,
        font: helveticaFont,
        size: 9,
        color: rgb(0.5, 0.5, 0.5),
      });
      firstPage.drawText(disclaimerText2, {
        x: 45,
        y: height - 432,
        font: helveticaFont,
        size: 9,
        color: rgb(0.5, 0.5, 0.5),
      });
      firstPage.drawText(disclaimerText3, {
        x: 45,
        y: height - 446,
        font: helveticaFont,
        size: 9,
        color: rgb(0.5, 0.5, 0.5),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "breast_cancer_report.pdf";
      link.click();

      setError("");
    } catch (error) {
      console.error("Failed to generate PDF:", error.message);
      setError("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="lung-page-container">
      <h1 className="lung-page-header">BREAST CANCER PREDICTOR</h1>
      <div
        className="loader-overlay"
        style={{ display: loading ? "flex" : "none" }}
      >
        <ClipLoader color="#FFF" size={60} />
      </div>
      {!showResult ? (
        <form className="lung-page-form" onSubmit={handleSubmit}>
          <div className="lung-page-input-container">
            <input
              className="lung-page-input"
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              className="lung-page-input"
              type="text"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              required
            />
            <select
              className="lung-page-input"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div className="lung-page-upload-image-container">
            <p>
              Upload a histological image of breast cancer cells for prediction
            </p>

            <div className="lung-page-upload-buttons">
              <label htmlFor="upload-image" className="lung-page-upload-label">
                <FiUpload className="lung-page-upload-icon" /> Upload Image
                {imageUploaded && (
                  <span style={{ marginLeft: "0.5rem", color: "green" }}>
                    ✔
                  </span>
                )}
                <input
                  id="upload-image"
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  className="lung-page-upload-input"
                  required
                />
              </label>

              <button
                type="button"
                className="lung-page-upload-label lung-page-dummy-report"
                onClick={() => setShowModal(true)}
              >
                <FiFileText className="lung-page-upload-icon" /> Test Images
              </button>
            </div>

            <button
              type="submit"
              className="lung-page-button"
              disabled={loading}
            >
              Predict
            </button>

            {showModal && (
              <div className="lung-page-modal-overlay">
                <div className="lung-page-modal-content">
                  <h3>Download Histological images in .zip</h3>
                  <a
                    href="/ReportTemplate/Breast/Breast_Cancerous.zip"
                    download
                    className="lung-page-button"
                  >
                    Cancerous
                  </a>
                  <a
                    href="/ReportTemplate/Breast/Breast_NonCancerous.zip"
                    download
                    className="lung-page-button"
                  >
                    Non Cancerous
                  </a>
                  <button
                    className="lung-page-button"
                    style={{ backgroundColor: "red" }}
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      ) : (
        <div className="lung-page-result-container">
          <p style={{ fontWeight: "bolder", fontSize: "1.5rem" }}>
            Prediction Result:
          </p>
          <p>Name: {formData.name}</p>
          <p>Age: {formData.age}</p>
          <p>Gender: {formData.gender === "M" ? "Male" : "Female"}</p>
          <p
            className={`prediction-text ${
              predictionResult.includes("not suffering")
                ? "no-breast-cancer"
                : "breast-cancer"
            }`}
          >
            {predictionResult.includes("not suffering")
              ? "The person is not suffering from Breast Cancer."
              : "The person is suffering from Breast Cancer."}
          </p>
          <div className="lung-page-buttons-container">
            <button className="lung-page-button" onClick={generateDynamicPDF}>
              Download Report
            </button>
            <button className="lung-page-button" onClick={handleRePredict}>
              Predict Again
            </button>
          </div>
        </div>
      )}
      {error && <p className="lung-page-error">{error}</p>}
    </div>
  );
};

export default BreastPage;
