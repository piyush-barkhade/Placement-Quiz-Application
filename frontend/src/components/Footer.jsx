import React from "react";
import "../styles/Footer.css"; // Assuming your CSS file is located in the 'styles' folder

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-contain">
        {/* Left Column: Website Name and Copyright */}
        <div className="footer-top">
          <h2>Placement Right</h2>
          <p>
            &copy; {new Date().getFullYear()} Placement Right. All Rights
            Reserved.
          </p>
        </div>

        {/* Middle Column: About Info and Useful Links */}

        <div className="footer-middle">
          <h3>About Us</h3>
          <p>
            Placement Right is a platform to help students prepare for placement
            tests, offering quizzes and other resources to boost your career
            prospects.
          </p>
        </div>

        <div className="footer-container">
          <div className="footer-middle-left">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
            </ul>
          </div>

          {/* Right Column: Social Media Links */}
          <div className="footer-middle-right">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a
                href="#"
                target=""
                rel="noopener noreferrer"
                className="social-icon facebook"
              >
                Facebook
              </a>
              <a
                href="#"
                target=""
                rel="noopener noreferrer"
                className="social-icon twitter"
              >
                Twitter
              </a>
              <a
                href="#"
                target=""
                rel="noopener noreferrer"
                className="social-icon instagram"
              >
                Instagram
              </a>
              <a
                href="#"
                target=""
                rel="noopener noreferrer"
                className="social-icon linkedin"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Footer Bottom (Small text, copyright notice) */}
      <div className="footer-bottom">
        <p>
          Developed with ❤️ Anonymous Right <br />
          All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
