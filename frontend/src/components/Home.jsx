import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Home.css"; // Import the updated styles
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { authToken, logout } = useAuth(); // Use auth context to check if user is logged in
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Placement Right!</h1>
          <p id="text">
            Prepare for your next big opportunity with fun and challenging
            quizzes. Test your skills and improve your placement chances.
          </p>
          <NavLink to="/quiz" className="cta-btn">
            Start Quiz
          </NavLink>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="quick-links">
        <h2>Quick Links</h2>
        <div className="links-container">
          {authToken ? (
            <>
              <NavLink to="/quiz" className="link-card" aria-label="Start Quiz">
                <div className="icon">
                  <i className="fas fa-question-circle"></i>
                </div>
                <h3>Quiz</h3>
                <p>Test your skills with fun and challenging quizzes!</p>
              </NavLink>
              <NavLink
                to="/leaderboard"
                className="link-card"
                aria-label="Leaderboard"
              >
                <div className="icon">
                  <i className="fas fa-trophy"></i>
                </div>
                <h3>Leaderboard</h3>
                <p>Check out the top performers in quizzes.</p>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="link-card"
                aria-label="Login Page"
              >
                <div className="icon">
                  <i className="fas fa-sign-in-alt"></i>
                </div>
                <h3>Login</h3>
                <p>Already have an account? Sign in here.</p>
              </NavLink>
              <NavLink
                to="/register"
                className="link-card"
                aria-label="Register Page"
              >
                <div className="icon">
                  <i className="fas fa-user-plus"></i>
                </div>
                <h3>Register</h3>
                <p>New user? Create an account to get started.</p>
              </NavLink>
              <NavLink to="/quiz" className="link-card" aria-label="Start Quiz">
                <div className="icon">
                  <i className="fas fa-question-circle"></i>
                </div>
                <h3>Quiz</h3>
                <p>Test your skills with fun and challenging quizzes!</p>
              </NavLink>
              <NavLink
                to="/leaderboard"
                className="link-card"
                aria-label="Leaderboard"
              >
                <div className="icon">
                  <i className="fas fa-trophy"></i>
                </div>
                <h3>Leaderboard</h3>
                <p>Check out the top performers in quizzes.</p>
              </NavLink>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
