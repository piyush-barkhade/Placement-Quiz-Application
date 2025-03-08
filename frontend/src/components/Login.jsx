import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      if (
        response.data.token &&
        response.data.user &&
        response.data.user.userId &&
        response.data.user.email
      ) {
        login(
          response.data.token,
          response.data.user.userId,
          response.data.user.email
        ); // Pass userId
        setSuccess("Login successful!");
        setTimeout(() => {
          navigate("/");
        }, 1000);
        setError("");
      } else {
        setError("No account found with this email address.");
        setTimeout(() => {
          navigate("/register");
        }, 2000);
        setSuccess("");
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          setError("No account found with this email address.");
          setTimeout(() => {
            navigate("/register");
          }, 2000);
          setSuccess("");
        } else if (err.response.status === 401) {
          setError("Invalid credentials! Please try again.");
        } else {
          setError("An error occurred, please try again later.");
        }
      } else if (err.request) {
        setError("No response from the server.");
      } else {
        setError("An unexpected error occurred.");
      }
      setSuccess("");
      console.error("Login error!", err);
    }
  };

  return (
    <div className="login">
      <form className="form" onSubmit={handleLogin}>
        <h2>Login</h2>
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
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
};

export default Login;
