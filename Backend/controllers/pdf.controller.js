import { spawn } from "child_process";
import path from "path";
import fs from "fs";

const pythonCommand = process.env.PYTHON_COMMAND || "python";

function deleteFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting PDF file:", err);
    } else {
      console.log("PDF file deleted successfully");
    }
  });
}

// Function to handle Heart Disease Report scraping
export const heartScraper = (req, res) => {
  const pdfPath = path.join("uploads", req.file.filename);

  const pythonProcess = spawn(pythonCommand, [
    "../DataScrapingScripts/scrapHeart.py",
    pdfPath,
  ]);

  let stdoutData = "";
  let stderrData = "";

  pythonProcess.stdout.on("data", (data) => {
    stdoutData += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    stderrData += data.toString();
  });

  pythonProcess.on("close", (code) => {
    console.log(`Heart scraper exited with code ${code}`);

    if (res.headersSent) return;

    if (code === 0) {
      try {
        const extractedData = JSON.parse(stdoutData.trim());
        res.json(extractedData);
      } catch (error) {
        console.error("Error parsing JSON data from Python script:", error);
        res.status(500).send("Error processing PDF");
      }
    } else {
      console.error(`Heart scraper error: ${stderrData}`);
      res.status(500).send("Error processing PDF");
    }

    // Delete the PDF file after processing
    deleteFile(pdfPath);
  });
};

// Function to handle Diabetes Report scraping
export const diabetesScraper = (req, res) => {
  const pdfPath = path.join("uploads", req.file.filename);

  const pythonProcess = spawn(pythonCommand, [
    "../DataScrapingScripts/scrapDiabetes.py",
    pdfPath,
  ]);

  let stdoutData = "";
  let stderrData = "";

  pythonProcess.stdout.on("data", (data) => {
    stdoutData += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    stderrData += data.toString();
  });

  pythonProcess.on("close", (code) => {
    console.log(`Diabetes scraper exited with code ${code}`);

    if (res.headersSent) return;

    if (code === 0) {
      try {
        const extractedData = JSON.parse(stdoutData.trim());
        res.json(extractedData);
      } catch (error) {
        console.error("Error parsing JSON data from Python script:", error);
        res.status(500).send("Error processing PDF");
      }
    } else {
      console.error(`Diabetes scraper error: ${stderrData}`);
      res.status(500).send("Error processing PDF");
    }

    // Delete the PDF file after processing
    deleteFile(pdfPath);
  });
};
