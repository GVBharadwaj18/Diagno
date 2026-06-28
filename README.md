# Diagno - Multi-Disease Prediction Platform

Diagno is a full-stack web application for predicting heart disease, diabetes, breast cancer, and lung cancer using machine learning models. The project combines a React frontend, an Express backend, and MongoDB to deliver a polished experience for health screening and report generation.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## Features
- Secure signup and login with JWT-based authentication.
- Disease prediction flows for heart disease, diabetes, breast cancer, and lung cancer.
- Prescription upload support for heart and diabetes screening.
- Medical image upload support for cancer predictions.
- Downloadable PDF reports for prediction results.
- Toast-based user feedback and protected routes.

## Tech Stack
- Frontend: React, Vite, React Router, React Toastify, PDF generation utilities.
- Backend: Node.js, Express, Mongoose, JWT, Multer, Cloudinary support.
- Database: MongoDB.
- Machine learning: Logistic Regression, SVM, CNN, and Inception-style image models.

## Project Structure
```bash
Diagno/
├── Backend/
│   ├── controllers/
│   ├── DataScrapingScripts/
│   ├── db/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   ├── constants.js
│   ├── index.js
│   └── uploads/
├── Frontend/
│   ├── public/
│   └── src/
├── Medical Reports/
├── ML/
├── LICENSE
└── README.md
```

## Getting Started
1. Install Node.js and MongoDB locally.
2. Install dependencies for both apps.
3. Create the environment files from the examples and update the values.
4. Start the backend and frontend.

### 1) Install dependencies
```powershell
cd Backend
npm install

cd ../Frontend
npm install
```

### 2) Create environment files
```powershell
cd Backend
copy .env.example .env

cd ../Frontend
copy .env.example .env
```

### 3) Run the backend
```powershell
cd Backend
npm run server
```
The backend will start on the configured port, usually http://localhost:8000/. If that port is already occupied, it will automatically fall back to another available port.

### 4) Run the frontend
Open a second terminal:
```powershell
cd Frontend
npm run dev -- --host 0.0.0.0
```
The frontend will typically open at http://localhost:5175/ (Vite may choose a different available port if 5173 or 5174 are already in use).

### 5) Run both together (optional)
```powershell
cd Backend
npm run dev
```
This uses concurrently to launch both the backend and the frontend in one command.

## Environment Variables
The backend requires the following values:
- PORT
- MONGODB_URI
- CORS_ORIGIN
- ACCESS_TOKEN_SECRET
- ACCESS_TOKEN_EXPIRY
- REFRESH_TOKEN_SECRET
- REFRESH_TOKEN_EXPIRY
- CLOUDINARY_CLOUD_NAME (optional unless uploads are enabled)
- CLOUDINARY_API_KEY (optional unless uploads are enabled)
- CLOUDINARY_API_SECRET (optional unless uploads are enabled)

The frontend uses:
- VITE_API_URL

## Screenshots
Screenshots will be added here as the project evolves. For now, the app can be run locally and verified in the browser.

## Future Enhancements
- Add OCR-based prescription extraction.
- Expand into a mobile experience.
- Add more disease predictors and richer analytics.
- Improve image processing and report customization.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
