# Diagno — AI-Powered Multi-Disease Diagnostic Platform

> Early detection saves lives. Diagno puts clinical-grade AI directly in your hands.

Diagno is a full-stack web application that predicts four major diseases — **heart disease**, **diabetes**, **lung cancer**, and **breast cancer** — using purpose-built machine learning models. Users enter clinical parameters (or upload a medical PDF) and receive an instant prediction with a downloadable report.

---

## Why Diagno?

Most medical AI projects are demos. Diagno is designed to feel like a real product:

- **PDF extraction** — upload a real prescription/lab report and the system parses the values automatically
- **Four independent ML models** — each disease uses the algorithm best suited to its data profile
- **Downloadable PDF reports** — every prediction result can be exported as a structured clinical report
- **Protected routes** — JWT auth ensures only registered users access the predictors
- **Dark glassmorphism UI** — Space Grotesk typeface, neon cyan/violet palette, fully responsive

---

## Disease Models

| Disease | Algorithm | Dataset | Notes |
|---|---|---|---|
| Heart Disease | Logistic Regression | UCI Cleveland | 13 clinical features |
| Diabetes | Logistic Regression | Pima Indians | 8 features incl. BMI, insulin |
| Lung Cancer | CNN (Inception-style) | CT scan images | Image classification |
| Breast Cancer | SVM | Wisconsin Diagnostic | Fine-needle aspirate features |

---

## Tech Stack

**Frontend**
- React 18 + Vite
- React Router v6
- `react-toastify` for feedback
- `pdf-lib` for client-side PDF generation
- `react-icons` for iconography
- Vanilla CSS (no framework) — custom dark design system

**Backend**
- Node.js + Express
- Mongoose + MongoDB
- JWT (access + refresh token flow)
- Multer for file uploads
- Cloudinary-ready for cloud storage

**ML Layer**
- Python-based prediction endpoints
- Scikit-learn (Logistic Regression, SVM)
- TensorFlow/Keras (CNN for image-based cancer detection)

---

## Project Structure

```
Diagno/
├── Backend/
│   ├── controllers/       # Route handlers (auth, predict, PDF)
│   ├── DataScrapingScripts/
│   ├── db/                # MongoDB connection
│   ├── middlewares/       # JWT verification
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routers
│   ├── utils/             # Helpers (token generation, etc.)
│   ├── app.js
│   └── index.js
├── Frontend/
│   ├── public/            # Static assets, report templates
│   └── src/
│       ├── assets/        # Images
│       ├── components/    # Navbar, Footer, Card, Hero
│       ├── context/       # UserContext (auth state)
│       └── pages/         # Home, Predictors, Heart, Diabetes, Lung, Breast, Login, Signup
├── ML/                    # Python ML model scripts
├── Medical Reports/       # Sample report templates
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)
- Python 3.9+ (for ML endpoints)

### 1. Clone and install

```bash
# Backend
cd Backend
npm install

# Frontend
cd ../Frontend
npm install
```

### 2. Configure environment

```bash
# Backend
cd Backend
copy .env.example .env   # Windows
# cp .env.example .env   # Mac/Linux

# Frontend
cd ../Frontend
copy .env.example .env
```

### 3. Run

```bash
# Backend only
cd Backend && npm run server

# Frontend only (new terminal)
cd Frontend && npm run dev

# Both together
cd Backend && npm run dev
```

Backend: `http://localhost:8000`  
Frontend: `http://localhost:5173`

---

## Environment Variables

### Backend `.env`

| Variable | Description |
|---|---|
| `PORT` | Server port (default 8000) |
| `MONGODB_URI` | MongoDB connection string |
| `CORS_ORIGIN` | Allowed frontend origin |
| `ACCESS_TOKEN_SECRET` | JWT access token secret |
| `ACCESS_TOKEN_EXPIRY` | e.g. `1d` |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret |
| `REFRESH_TOKEN_EXPIRY` | e.g. `7d` |
| `CLOUDINARY_CLOUD_NAME` | Optional — for upload support |
| `CLOUDINARY_API_KEY` | Optional |
| `CLOUDINARY_API_SECRET` | Optional |

### Frontend `.env`

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL e.g. `http://localhost:8000` |

---

## Roadmap

- [ ] OCR-based prescription text extraction
- [ ] Mobile-responsive native app (React Native)
- [ ] More disease predictors (kidney disease, liver disease)
- [ ] Analytics dashboard with prediction history
- [ ] Doctor consultation booking integration
- [ ] Multi-language support
