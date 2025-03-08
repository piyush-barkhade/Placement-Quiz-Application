// src/App.js
import React from "react";

// src/App.js
import "./assets/global.css";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Quiz from "./components/Quiz.jsx";
import Leaderboard from "./components/Leaderboard.jsx";
import QuizDetails from "./components/QuizDetails.jsx";
import Home from "./components/Home.jsx";
import Footer from "./components/Footer.jsx";

// Component to conditionally render Footer
const AppFooter = () => {
  const location = useLocation();
  // Check if the current path is Home ("/")
  if (location.pathname === "/") {
    return <Footer />;
  }
  return null; // No Footer on other pages
};

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/:company" element={<QuizDetails />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
      <AppFooter />
    </Router>
  );
}

export default App;
