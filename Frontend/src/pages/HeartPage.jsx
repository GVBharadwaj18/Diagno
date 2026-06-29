import React, { useState } from "react";
import "../App.css";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"; // Ensure correct import
import { FiUpload, FiFileText } from "react-icons/fi";
import { ClipLoader } from "react-spinners";

const HeartPage = () => {
  const [formData, setFormData] = useState({
    age: "",
    sex: "",
    chestPainType: "",
    restingBloodPressure: "",
    serumCholesterol: "",
    fastingBloodSugar: "",
    restingECG: "",
    maxHeartRate: "",
    exerciseInducedAngina: "",
    oldPeak: "",
    slope: "",
    numMajorVessels: "",
    thal: "",
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
          `${import.meta.env.VITE_API_URL}/api/pdf/heart-scraper`,
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
        console.log("Data from server:", data); // Debug log to see the data structure

        // Map the response data to the form state
        setFormData({
          age: data.Age || "",
          sex: data.Sex || "",
          chestPainType: data["Chest pain type"] || "",
          restingBloodPressure: data["Resting blood pressure"] || "",
          serumCholesterol: data["Serum cholesterol in mg/dl"] || "",
          fastingBloodSugar:
            data["Fasting blood sugar > 120 mg/dl"] === "Yes" ? "1" : "0",
          restingECG: data["Resting Electrocardiographic Results"] || "",
          maxHeartRate: data["Maximum Heart Rate Achieved"] || "",
          exerciseInducedAngina: data["Exercise Induced Angina"] || "",
          oldPeak: data["Old peak"] || "",
          slope: data["Slope of the peak exercise ST Segment"] || "",
          numMajorVessels:
            data["Number of major vessels (0-3) colored by fluoroscopy"] || "",
          thal: data["Thal (Thallium Stress Test Result)"] || "",
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
        `${import.meta.env.VITE_API_URL}/api/v1/predict/heart-pred`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            p1: formData.age,
            p2: formData.sex,
            p3: formData.chestPainType,
            p4: formData.restingBloodPressure,
            p5: formData.serumCholesterol,
            p6: formData.fastingBloodSugar,
            p7: formData.restingECG,
            p8: formData.maxHeartRate,
            p9: formData.exerciseInducedAngina,
            p10: formData.oldPeak,
            p11: formData.slope,
            p12: formData.numMajorVessels,
            p13: formData.thal,
          }),
          credentials: "include", // Ensure cookies are sent
        }
      );
      if (!response.ok) {
        throw new Error("Prediction request failed.");
      }
      const data = await response.json();
      setPredictionResult(data.result);
      setError(""); // Clear any previous errors
      setShowResult(true); // Show the result section
    } catch (error) {
      console.error("Prediction failed:", error.message);
      setError("Failed to predict. Please try again.");
      setPredictionResult(""); // Reset prediction result on error
      setShowResult(false); // Hide the result section
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const handleRePredict = () => {
    setShowResult(false); // Hide the result section to show the form again
    setPredictionResult(""); // Clear the prediction result
    setFormData({
      age: "",
      sex: "",
      chestPainType: "",
      restingBloodPressure: "",
      serumCholesterol: "",
      fastingBloodSugar: "",
      restingECG: "",
      maxHeartRate: "",
      exerciseInducedAngina: "",
      oldPeak: "",
      slope: "",
      numMajorVessels: "",
      thal: "",
    }); // Reset form fields
    setPdfFile(null); // Reset PDF file
  };

  // Function to generate and download PDF with dynamic data
  const generateDynamicPDF = async () => {
    setLoading(true); // Start loading spinner
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
      firstPage.drawText("PATIENT DIAGNOSTIC REPORT (HEART DISEASE)", {
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

      // Metrics Grid Box (larger height for 7 rows)
      firstPage.drawRectangle({
        x: 45,
        y: height - 355,
        width: 505,
        height: 145,
        color: rgb(0.97, 0.98, 0.99),
        borderColor: rgb(0.9, 0.92, 0.95),
        borderWidth: 1,
      });

      // Column 1
      const col1Y = height - 230;
      firstPage.drawText(`Age: ${formData.age} years`, { x: 60, y: col1Y, size: 9, font: helveticaFont });
      firstPage.drawText(`Sex: ${formData.sex === "1" || formData.sex.toLowerCase() === "male" ? "Male" : "Female"}`, { x: 60, y: col1Y - 18, size: 9, font: helveticaFont });
      firstPage.drawText(`Chest Pain Type: ${formData.chestPainType}`, { x: 60, y: col1Y - 36, size: 9, font: helveticaFont });
      firstPage.drawText(`Resting BP: ${formData.restingBloodPressure} mmHg`, { x: 60, y: col1Y - 54, size: 9, font: helveticaFont });
      firstPage.drawText(`Cholesterol: ${formData.serumCholesterol} mg/dL`, { x: 60, y: col1Y - 72, size: 9, font: helveticaFont });
      firstPage.drawText(`Fasting Blood Sugar: ${formData.fastingBloodSugar}`, { x: 60, y: col1Y - 90, size: 9, font: helveticaFont });
      firstPage.drawText(`Resting ECG: ${formData.restingECG}`, { x: 60, y: col1Y - 108, size: 9, font: helveticaFont });

      // Column 2
      const col2Y = height - 230;
      firstPage.drawText(`Max Heart Rate: ${formData.maxHeartRate} bpm`, { x: 300, y: col2Y, size: 9, font: helveticaFont });
      firstPage.drawText(`Exercise Angina: ${formData.exerciseInducedAngina}`, { x: 300, y: col2Y - 18, size: 9, font: helveticaFont });
      firstPage.drawText(`Old Peak: ${formData.oldPeak}`, { x: 300, y: col2Y - 36, size: 9, font: helveticaFont });
      firstPage.drawText(`Slope: ${formData.slope}`, { x: 300, y: col2Y - 54, size: 9, font: helveticaFont });
      firstPage.drawText(`Major Vessels (0-3): ${formData.numMajorVessels}`, { x: 300, y: col2Y - 72, size: 9, font: helveticaFont });
      firstPage.drawText(`Thal: ${formData.thal}`, { x: 300, y: col2Y - 90, size: 9, font: helveticaFont });

      // Diagnosis Section Header
      firstPage.drawText("DIAGNOSTIC ASSESSMENT", {
        x: 45,
        y: height - 385,
        font: helveticaBold,
        size: 11,
        color: rgb(0.2, 0.2, 0.2),
      });

      const isPositive = !predictionResult.toLowerCase().includes("not");

      // Draw Diagnosis Box
      firstPage.drawRectangle({
        x: 45,
        y: height - 465,
        width: 505,
        height: 65,
        color: isPositive ? rgb(0.996, 0.95, 0.95) : rgb(0.94, 0.99, 0.96),
        borderColor: isPositive ? rgb(0.937, 0.267, 0.267) : rgb(0.133, 0.773, 0.369),
        borderWidth: 1.5,
      });

      // Result title
      firstPage.drawText(isPositive ? "HIGH RISK DETECTED" : "NO RISK DETECTED", {
        x: 60,
        y: height - 425,
        font: helveticaBold,
        size: 12,
        color: isPositive ? rgb(0.78, 0.15, 0.15) : rgb(0.09, 0.54, 0.24),
      });

      // Result detail text
      firstPage.drawText(predictionResult, {
        x: 60,
        y: height - 447,
        font: helveticaFont,
        size: 11,
        color: rgb(0.1, 0.1, 0.1),
      });

      // Disclaimer Box
      firstPage.drawText("Disclaimer & Clinical Notes:", {
        x: 45,
        y: height - 505,
        font: helveticaBold,
        size: 10,
        color: rgb(0.3, 0.3, 0.3),
      });

      const disclaimerText1 = "This prediction is generated by an artificial intelligence model trained on clinical diagnostic data.";
      const disclaimerText2 = "It is intended for screening and educational assistance only, and does not constitute a medical diagnosis.";
      const disclaimerText3 = "Please present this report to a qualified healthcare provider for clinical correlation and definitive diagnosis.";

      firstPage.drawText(disclaimerText1, { x: 45, y: height - 523, font: helveticaFont, size: 9, color: rgb(0.5, 0.5, 0.5) });
      firstPage.drawText(disclaimerText2, { x: 45, y: height - 537, font: helveticaFont, size: 9, color: rgb(0.5, 0.5, 0.5) });
      firstPage.drawText(disclaimerText3, { x: 45, y: height - 551, font: helveticaFont, size: 9, color: rgb(0.5, 0.5, 0.5) });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Heart_Disease_Pred_Result.pdf";
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
    <div className="heart-page-container">
      <h1 className="heart-page-header">HEART DISEASE PREDICTOR</h1>
      <div
        className="loader-overlay"
        style={{ display: loading ? "flex" : "none" }}
      >
        <ClipLoader color="#FFF" size={60} />
      </div>
      {!showResult ? (
        <form className="heart-page-form" onSubmit={handleSubmit}>
          <div className="heart-page-input-container">
            <input
              className="heart-page-input"
              type="text"
              name="age"
              placeholder="Age"
              value={formData.age || ""}
              onChange={handleChange}
            />
            <input
              className="heart-page-input"
              type="text"
              name="sex"
              placeholder="Sex (0 - female, 1 - male)"
              value={formData.sex || ""}
              onChange={handleChange}
            />
            <input
              className="heart-page-input"
              type="text"
              name="chestPainType"
              placeholder="Chest Pain Type (1-Typical Angina, 2-Atypical Angina, 3-Non-anginal Pain,4-Asymptomatic)"
              value={formData.chestPainType || ""}
              onChange={handleChange}
            />
            <input
              className="heart-page-input"
              type="text"
              name="restingBloodPressure"
              placeholder="Resting Blood Pressure"
              value={formData.restingBloodPressure || ""}
              onChange={handleChange}
            />
            <input
              className="heart-page-input"
              type="text"
              name="serumCholesterol"
              placeholder="Serum Cholesterol"
              value={formData.serumCholesterol || ""}
              onChange={handleChange}
            />
            <input
              className="heart-page-input"
              type="text"
              name="fastingBloodSugar"
              placeholder="Fasting Blood Sugar (0 or 1)"
              value={formData.fastingBloodSugar || ""}
              onChange={handleChange}
            />
            <input
              className="heart-page-input"
              type="text"
              name="restingECG"
              placeholder="Resting ECG"
              value={formData.restingECG || ""}
              onChange={handleChange}
            />
            <input
              className="heart-page-input"
              type="text"
              name="maxHeartRate"
              placeholder="Maximum Heart Rate Achieved"
              value={formData.maxHeartRate || ""}
              onChange={handleChange}
            />
            <input
              className="heart-page-input"
              type="text"
              name="exerciseInducedAngina"
              placeholder="Exercise Induced Angina (0 or 1)"
              value={formData.exerciseInducedAngina || ""}
              onChange={handleChange}
            />
            <input
              className="heart-page-input"
              type="text"
              name="oldPeak"
              placeholder="Old Peak"
              value={formData.oldPeak || ""}
              onChange={handleChange}
            />
            <input
              className="heart-page-input"
              type="text"
              name="slope"
              placeholder="Slope"
              value={formData.slope || ""}
              onChange={handleChange}
            />
            <input
              className="heart-page-input"
              type="text"
              name="numMajorVessels"
              placeholder="Number of Major Vessels (0-3)"
              value={formData.numMajorVessels || ""}
              onChange={handleChange}
            />
            <input
              className="heart-page-input"
              type="text"
              name="thal"
              placeholder="Thal (Thallium Stress Test Result)"
              value={formData.thal || ""}
              onChange={handleChange}
            />
          </div>
          <div className="heart-page-upload-report-container">
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
                className="heart-page-upload-label"
              >
                <FiUpload className="heart-page-upload-icon" /> Upload Report
                <input
                  id="upload-report"
                  type="file"
                  accept="application/pdf"
                  onChange={handleUploadReport}
                  className="heart-page-upload-input"
                />
              </label>

              <button
                type="button"
                className="heart-page-upload-label heart-page-dummy-report"
                onClick={() => setShowModal(true)}
              >
                <FiFileText className="heart-page-upload-icon" /> Test Reports
              </button>
            </div>

            <button type="submit" className="heart-page-button">
              Predict
            </button>

            {showModal && (
              <div className="heart-page-modal-overlay">
                <div className="heart-page-modal-content">
                  <h3>Select a report to download</h3>
                  <a
                    href="/ReportTemplate/Heart/HeartDummy.pdf"
                    download
                    className="heart-page-button"
                  >
                    Dummy Report
                  </a>
                  <a
                    href="/ReportTemplate/Heart/HeartReport_Suffering.pdf"
                    download
                    className="heart-page-button"
                  >
                    Suffering Report
                  </a>
                  <a
                    href="/ReportTemplate/Heart/HeartReport_NotSuffering.pdf"
                    download
                    className="heart-page-button"
                  >
                    Not Suffering Report
                  </a>
                  <button
                    className="heart-page-button"
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
        <div className="heart-page-result-container">
          <p style={{ fontWeight: "bolder", fontSize: "1.5rem" }}>
            Prediction Result:
          </p>
          <p>Age: {formData.age}</p>
          <p>Sex: {formData.sex === 1 ? "Male" : "Female"}</p>
          <p>Chest Pain Type: {formData.chestPainType}</p>
          <p>Resting Blood Pressure: {formData.restingBloodPressure}</p>
          <p>Serum Cholesterol: {formData.serumCholesterol}</p>
          <p>
            Fasting Blood Sugar:{" "}
            {formData.fastingBloodSugar === 1 ? "Yes" : "No"}
          </p>
          <p>Resting ECG: {formData.restingECG}</p>
          <p>Maximum Heart Rate Achieved: {formData.maxHeartRate}</p>
          <p>
            Exercise Induced Angina:{" "}
            {formData.exerciseInducedAngina === "1" ? "Yes" : "No"}
          </p>
          <p>Old Peak: {formData.oldPeak}</p>
          <p>Slope: {formData.slope}</p>
          <p>Number of Major Vessels (0-3): {formData.numMajorVessels}</p>
          <p>Thal (Thallium Stress Test Result): {formData.thal}</p>
          <p
            className={`prediction-text ${
              predictionResult.includes("not suffering")
                ? "no-heart-disease"
                : "heart-disease"
            }`}
          >
            {predictionResult}
          </p>
          {/* Download Custom PDF button */}
          <button className="heart-page-button" onClick={generateDynamicPDF}>
            Download Report
          </button>
          <button className="heart-page-button" onClick={handleRePredict}>
            Re-predict
          </button>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default HeartPage;
