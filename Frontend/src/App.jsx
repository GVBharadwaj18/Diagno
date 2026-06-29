import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PredictorsPage from "./pages/PredictorsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import BreastPage from "./pages/BreastPage";
import LungPage from "./pages/LungPage";
import HeartPage from "./pages/HeartPage";
import DiabetesPage from "./pages/DiabetesPage";
import NotFoundPage from "./pages/NotFoundPage";
import { UserContextProvider } from "./context/UserContext.jsx";

// Layout wrapper: Navbar + content + Footer
function Layout({ children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <UserContextProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Routes without Navbar/Footer */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Routes with Navbar + Footer */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/predictors" element={<Layout><PredictorsPage /></Layout>} />
            <Route path="/predictors/breast" element={<Layout><BreastPage /></Layout>} />
            <Route path="/predictors/lung" element={<Layout><LungPage /></Layout>} />
            <Route path="/predictors/heart" element={<Layout><HeartPage /></Layout>} />
            <Route path="/predictors/diabetes" element={<Layout><DiabetesPage /></Layout>} />
            <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
          </Routes>
        </div>
      </Router>
    </UserContextProvider>
  );
}

export default App;
