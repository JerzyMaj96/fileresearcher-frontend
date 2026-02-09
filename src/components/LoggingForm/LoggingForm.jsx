import React, { useState } from "react";
import "./LoggingForm.css";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../api_helper";

function LoggingForm({ onLogin }) {
  const [user, setUser] = useState({
    userName: "",
    userPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { value, name } = event.target;
    setUser((prevValue) => ({ ...prevValue, [name]: value }));
  }

  const handleLogin = async (event) => {
    event.preventDefault();

    const { userName, userPassword } = user;

    if (userName.trim() === "" || userPassword.trim() === "") {
      alert("Please enter your username and password.");
      return;
    }

    try {
      const response = await fetch(
        `${baseUrl}/file-researcher/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: userName,
            password: userPassword,
          }),
        }
      );

      if (response.ok) {
        const token = await response.text();
        console.log("JWT Token received:", token);

        localStorage.setItem("jwtToken", token);

        await fetchUserDetails(token);

        setUser({
          userName: "",
          userPassword: "",
        });
        navigate("/explorer");
      } else {
        const message = await response.text();
        alert("Login failed: " + message);
        setUser((prev) => ({ ...prev, userPassword: "" }));
      }
    } catch (error) {
      alert("Something went wrong: " + error.message);
    }
  }

  const fetchUserDetails = async (token) => {
    try {
      const response = await fetch(
        `${baseUrl}/file-researcher/users/authentication`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        onLogin({ ...userData, token: token });
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  }

  return (
    <form onSubmit={handleLogin} className="form-container">
      <input
        onChange={handleChange}
        name="userName"
        placeholder="User Name"
        value={user.userName}
        className="form-input"
      />
      <input
        onChange={handleChange}
        name="userPassword"
        placeholder="Password"
        type="password"
        value={user.userPassword}
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
