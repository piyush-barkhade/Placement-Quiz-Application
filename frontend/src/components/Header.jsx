import "../styles/Header.css";
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx"; // Import useAuth to access the auth context

const Header = () => {
  const { authToken, logout } = useAuth(); // Use auth context to check if user is logged in
  const navigate = useNavigate(); // Hook to navigate after logging out

  const [menuOpen, setMenuOpen] = useState(false); // State to manage the kebab menu open/close
  const menuRef = useRef(null); // Create a ref for the kebab menu to detect clicks outside

  const handleLogout = () => {
    logout(); // Call logout function from context
    navigate("/login"); // Redirect to login page after logout
    setMenuOpen(false); // Close menu after logging out
  };

  const toggleMenu = () => {
    setMenuOpen((prevState) => !prevState); // Toggle the kebab menu
  };

  // Close the menu if user clicks outside the menu area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false); // Close menu if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Attach event listener

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Clean up event listener
    };
  }, []);

  return (
    <header>
      <h1>Placement Right</h1>

      {/* Kebab Menu for Mobile */}
      <div className="kebab-menu" onClick={toggleMenu}>
        <div className="kebab-dot"></div>
        <div className="kebab-dot"></div>
        <div className="kebab-dot"></div>
      </div>

      {/* Regular Navigation Menu for Desktop */}
      <nav className={`desktop-nav ${menuOpen ? "open" : ""}`}>
        {authToken ? (
          <>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/quiz">Quiz</NavLink>
            <NavLink to="/leaderboard">Leaderboard</NavLink>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
            <NavLink to="/quiz">Quiz</NavLink>
            <NavLink to="/leaderboard">Leaderboard</NavLink>
          </>
        )}
      </nav>

      {/* Kebab Menu Items for Mobile */}
      {menuOpen && (
        <div className="kebab-menu-items" ref={menuRef}>
          <ul>
            {authToken ? (
              <>
                <li>
                  <NavLink to="/" onClick={() => setMenuOpen(false)}>
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/quiz" onClick={() => setMenuOpen(false)}>
                    Quiz
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/leaderboard" onClick={() => setMenuOpen(false)}>
                    Leaderboard
                  </NavLink>
                </li>
                <li className="logout-hover-color" onClick={handleLogout}>
                  Logout
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/" onClick={() => setMenuOpen(false)}>
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/register" onClick={() => setMenuOpen(false)}>
                    Register
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/quiz" onClick={() => setMenuOpen(false)}>
                    Quiz
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/leaderboard" onClick={() => setMenuOpen(false)}>
                    Leaderboard
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
