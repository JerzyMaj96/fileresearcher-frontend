import React, { useState } from "react";
import "./LoggingForm.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; 

function LoggingForm() {
  const [credentials, setCredentials] = useState({
    userName: "",
    userPassword: "",
  });
  
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { value, name } = event.target;
    setCredentials((prevValue) => ({ ...prevValue, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!credentials.userName.trim() || !credentials.userPassword.trim()) {
      alert("Please enter your username and password.");
      return;
    }

    try {
      await login(credentials.userName, credentials.userPassword);
      
      navigate("/explorer");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="form-container">
      <input
        onChange={handleChange}
        name="userName"
        placeholder="User Name"
        value={credentials.userName}
        className="form-input"
      />
      <input
        onChange={handleChange}
        name="userPassword"
        placeholder="Password"
        type="password"
        value={credentials.userPassword}
        className="form-input"
      />
      <button type="submit" className="form-button">
        Log in
      </button>
      <p className="form-link">
        <Link to="/register">I am not a user yet!</Link>
      </p>
    </form>
  );
}

export default LoggingForm;