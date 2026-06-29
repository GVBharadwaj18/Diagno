import React, { useState } from "react";
import "../App.css";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { FiUpload, FiFileText } from "react-icons/fi";
import { ClipLoader } from "react-spinners";

const DiabetesPage = () => {
  const [formData, setFormData] = useState({
    pregnancies: "",
    glucose: "",
    bloodPressure: "",
    skinThickness: "",
    insulin: "",
    bmi: "",
    diabetesPedigreeFunction: "",
    age: "",
  });
  const [predictionResult, setPredictionResult] = useState("");
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading spinner
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUploadReport = async (e) => {
    setLoading(true); // Start loading spinner
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      console.log("PDF file uploaded:", file);

      const formData = new FormData();
      formData.append("pdfFile", file);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/pdf/diabetes-scraper`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("PDF upload request failed.");
        }
        const data = await response.json();
        console.log("Data from server:", data);

        setFormData({
          pregnancies: data.Pregnancies || "",
          glucose: data.Glucose || "",
          bloodPressure: data.BloodPressure || "",
          skinThickness: data.SkinThickness || "",
          insulin: data.Insulin || "",
          bmi: data.BMI || "",
          diabetesPedigreeFunction: data.DiabetesPedigreeFunction || "",
          age: data.Age || "",
        });
      } catch (error) {
        console.error("PDF upload failed:", error.message);
        setError("Failed to process PDF. Please try again.");
      } finally {
        setLoading(false); // Stop loading spinner
      }
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading spinner

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/predict/diabetes-pred`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Prediction request failed.");
      }
      const data = await response.json();
      setPredictionResult(data.result);
      setError("");
      setShowResult(true);
    } catch (error) {
      console.error("Prediction failed:", error.message);
      setError("Failed to predict. Please try again.");
      setPredictionResult("");
      setShowResult(false);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const handleRePredict = () => {
    setShowResult(false);
    setPredictionResult("");
    setFormData({
      pregnancies: "",
      glucose: "",
      bloodPressure: "",
      skinThickness: "",
      insulin: "",
      bmi: "",
      diabetesPedigreeFunction: "",
      age: "",
    });
    setPdfFile(null);
  };

  const generateDynamicPDF = async () => {
    try {
      setLoading(true); // Start loading spinner

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
      firstPage.drawText("PATIENT DIAGNOSTIC REPORT (DIABETES)", {
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

      // Clinical Metrics Header
      firstPage.drawText("CLINICAL MEASUREMENTS", {
        x: 45,
        y: height - 195,
        font: helveticaBold,
        size: 11,
        color: rgb(0.2, 0.2, 0.2),
      });

      // Metrics Grid Box
      firstPage.drawRectangle({
        x: 45,
        y: height - 325,
        width: 505,
        height: 115,
        color: rgb(0.97, 0.98, 0.99),
        borderColor: rgb(0.9, 0.92, 0.95),
        borderWidth: 1,
      });

      // Column 1
      const col1Y = height - 235;
      firstPage.drawText(`Pregnancies: ${formData.pregnancies}`, { x: 60, y: col1Y, size: 10, font: helveticaFont });
      firstPage.drawText(`Glucose Level: ${formData.glucose} mg/dL`, { x: 60, y: col1Y - 24, size: 10, font: helveticaFont });
      firstPage.drawText(`Blood Pressure: ${formData.bloodPressure} mmHg`, { x: 60, y: col1Y - 48, size: 10, font: helveticaFont });
      firstPage.drawText(`Skin Thickness: ${formData.skinThickness} mm`, { x: 60, y: col1Y - 72, size: 10, font: helveticaFont });

      // Column 2
      const col2Y = height - 235;
      firstPage.drawText(`Insulin Level: ${formData.insulin} uIU/mL`, { x: 300, y: col2Y, size: 10, font: helveticaFont });
      firstPage.drawText(`BMI (Body Mass Index): ${formData.bmi}`, { x: 300, y: col2Y - 24, size: 10, font: helveticaFont });
      firstPage.drawText(`Pedigree Function: ${formData.diabetesPedigreeFunction}`, { x: 300, y: col2Y - 48, size: 10, font: helveticaFont });
      firstPage.drawText(`Age: ${formData.age} years`, { x: 300, y: col2Y - 72, size: 10, font: helveticaFont });

      // Diagnosis Section Header
      firstPage.drawText("DIAGNOSTIC ASSESSMENT", {
        x: 45,
        y: height - 355,
        font: helveticaBold,
        size: 11,
        color: rgb(0.2, 0.2, 0.2),
      });

      const isPositive = !predictionResult.toLowerCase().includes("not");

      // Draw Diagnosis Box
      firstPage.drawRectangle({
        x: 45,
        y: height - 435,
        width: 505,
        height: 65,
        color: isPositive ? rgb(0.996, 0.95, 0.95) : rgb(0.94, 0.99, 0.96),
        borderColor: isPositive ? rgb(0.937, 0.267, 0.267) : rgb(0.133, 0.773, 0.369),
        borderWidth: 1.5,
      });

      // Result title
      firstPage.drawText(isPositive ? "HIGH RISK DETECTED" : "NO RISK DETECTED", {
        x: 60,
        y: height - 395,
        font: helveticaBold,
        size: 12,
        color: isPositive ? rgb(0.78, 0.15, 0.15) : rgb(0.09, 0.54, 0.24),
      });

      // Result detail text
      firstPage.drawText(predictionResult, {
        x: 60,
        y: height - 417,
        font: helveticaFont,
        size: 11,
        color: rgb(0.1, 0.1, 0.1),
      });

      // Disclaimer Box
      firstPage.drawText("Disclaimer & Clinical Notes:", {
        x: 45,
        y: height - 475,
        font: helveticaBold,
        size: 10,
        color: rgb(0.3, 0.3, 0.3),
      });

      const disclaimerText1 = "This prediction is generated by an artificial intelligence model trained on clinical diagnostic data.";
      const disclaimerText2 = "It is intended for screening and educational assistance only, and does not constitute a medical diagnosis.";
      const disclaimerText3 = "Please present this report to a qualified healthcare provider for clinical correlation and definitive diagnosis.";

      firstPage.drawText(disclaimerText1, { x: 45, y: height - 493, font: helveticaFont, size: 9, color: rgb(0.5, 0.5, 0.5) });
      firstPage.drawText(disclaimerText2, { x: 45, y: height - 507, font: helveticaFont, size: 9, color: rgb(0.5, 0.5, 0.5) });
      firstPage.drawText(disclaimerText3, { x: 45, y: height - 521, font: helveticaFont, size: 9, color: rgb(0.5, 0.5, 0.5) });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Diabetes_Pred_Result.pdf";
      link.click();

      setError("");
    } catch (error) {
      console.error("Failed to generate PDF:", error.message);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="diabetes-page-container">
      <h1 className="diabetes-page-header">DIABETES PREDICTOR</h1>
      <div
        className="loader-overlay"
        style={{ display: loading ? "flex" : "none" }}
      >
        <ClipLoader color="#FFF" size={60} />
      </div>
      {!showResult ? (
        <form className="diabetes-page-form" onSubmit={handleSubmit}>
          <div className="diabetes-page-input-container">
            <input
              className="diabetes-page-input"
              type="text"
              name="pregnancies"
              placeholder="Number of Pregnancies"
              value={formData.pregnancies || ""}
              onChange={handleChange}
            />
            <input
              className="diabetes-page-input"
              type="text"
              name="glucose"
              placeholder="Glucose Level"
              value={formData.glucose || ""}
              onChange={handleChange}
            />
            <input
              className="diabetes-page-input"
              type="text"
              name="bloodPressure"
              placeholder="Blood Pressure"
              value={formData.bloodPressure || ""}
              onChange={handleChange}
            />
            <input
              className="diabetes-page-input"
              type="text"
              name="skinThickness"
              placeholder="Skin Thickness"
              value={formData.skinThickness || ""}
              onChange={handleChange}
            />
            <input
              className="diabetes-page-input"
              type="text"
              name="insulin"
              placeholder="Insulin"
              value={formData.insulin || ""}
              onChange={handleChange}
            />
            <input
              className="diabetes-page-input"
              type="text"
              name="bmi"
              placeholder="BMI (Body Index Mass)"
              value={formData.bmi || ""}
              onChange={handleChange}
            />
            <input
              className="diabetes-page-input"
              type="text"
              name="diabetesPedigreeFunction"
              placeholder="Diabetes Pedigree Function"
              value={formData.diabetesPedigreeFunction || ""}
              onChange={handleChange}
            />
            <input
              className="diabetes-page-input"
              type="text"
              name="age"
              placeholder="Age"
              value={formData.age || ""}
              onChange={handleChange}
            />
          </div>
          <div className="diabetes-page-upload-report-container">
            <p>
              Don't want to type manually? Upload your report and we will do it
              for you
            </p>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <label
                htmlFor="upload-report"
                className="diabetes-page-upload-label"
              >
                <FiUpload className="diabetes-page-upload-icon" /> Upload Report
                <input
                  id="upload-report"
                  type="file"
                  accept="application/pdf"
                  onChange={handleUploadReport}
                  className="diabetes-page-upload-input"
                />
              </label>

              <button
                type="button"
                className="diabetes-page-upload-label diabetes-page-dummy-report"
                onClick={() => setShowModal(true)}
              >
                <FiFileText className="diabetes-page-upload-icon" /> Test
                Reports
              </button>
            </div>

            <button type="submit" className="diabetes-page-button">
              Predict
            </button>

            {showModal && (
              <div className="diabetes-page-modal-overlay">
                <div className="diabetes-page-modal-content">
                  <h3>Select a Report to download</h3>
                  <a
                    href="/ReportTemplate/Diabetes/DiabetesDummy.pdf"
                    download
                    className="diabetes-page-button"
                  >
                    Dummy Report
                  </a>
                  <a
                    href="/ReportTemplate/Diabetes/Diabetes_Suffering.pdf"
                    download
                    className="diabetes-page-button"
                  >
                    Suffering Report
                  </a>
                  <a
                    href="/ReportTemplate/Diabetes/Diabetes_NotSuffering.pdf"
                    download
                    className="diabetes-page-button"
                  >
                    Not Suffering Report
                  </a>
                  <button
                    className="diabetes-page-button"
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
        <div className="diabetes-page-result-container">
          <p style={{ fontWeight: "bolder", fontSize: "1.5rem" }}>
            Prediction Result:
          </p>
          <p>Number of Pregnancies: {formData.pregnancies}</p>
          <p>Glucose Level: {formData.glucose}</p>
          <p>Blood Pressure: {formData.bloodPressure}</p>
          <p>Skin Thickness: {formData.skinThickness}</p>
          <p>Insulin: {formData.insulin}</p>
          <p>BMI (Body Index Mass): {formData.bmi}</p>
          <p>Diabetes Pedigree Function: {formData.diabetesPedigreeFunction}</p>
          <p>Age: {formData.age}</p>
          <p
            className={`prediction-text ${
              predictionResult.includes("not") ? "no-diabetes" : "diabetes"
            }`}
          >
            {predictionResult}
          </p>
          <button className="diabetes-page-button" onClick={generateDynamicPDF}>
            Download Report
          </button>
          <button className="diabetes-page-button" onClick={handleRePredict}>
            Re-predict
          </button>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default DiabetesPage;
