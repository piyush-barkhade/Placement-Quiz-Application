// frontend/components/Register.jsx
import { useState } from "react";
import axios from "axios";
import "../styles/Register.css"; // Importing the CSS for styling
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Added success state
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Check if the password length is at least 8 characters
    if (password.length < 8) {
      setError("Password must be at least 8 characters long!");
      return; // Prevent form submission if password is too short
    }

    try {
      const response = await axios.post("http://localhost:5000/register", {
        username,
        email,
        password,
      });

      // Handle successful registration
      console.log(response.data);
      setSuccess("User registered successfully!"); // Set success message
      setTimeout(() => {
        navigate("/login"); // Redirect to home page after showing error message
      }, 2000); // Wait for 2 seconds before redirecting
      setError(""); // Clear any previous error message
    } catch (error) {
      // Check if error response contains a message
      if (error.response) {
        setError(error.response.data.message || "Error registering user!");
        setTimeout(() => {
          navigate("/login"); // Redirect to login page after showing error message
        }, 2000); // Wait for 2 seconds before redirecting
      } else if (error.request) {
        setError("No response from the server!");
      } else {
        setError("An unexpected error occurred!");
      }
      setSuccess(""); // Clear any previous success message on error
      console.error("Error registering user!", error);
    }
  };

  return (
    <div className="register">
      <div className="form">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>

        {/* Display error message */}
        {error && <p className="error">{error}</p>}

        {/* Display success message */}
        {success && <p className="success">{success}</p>}
      </div>
    </div>
  );
};

export default Register;
