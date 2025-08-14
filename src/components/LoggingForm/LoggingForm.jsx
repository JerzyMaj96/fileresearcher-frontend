import React, { useState } from "react";
import "./LoggingForm.css";
import { Link, useNavigate } from "react-router-dom";

function LoggingForm({ onLogin }) {
  const [user, setUser] = useState({
    userName: "",
    userPassword: "",
  });
  const navigate = useNavigate();

  function handleChange(event) {
    const { value, name } = event.target;
    setUser((prevValue) => ({ ...prevValue, [name]: value }));
  }

  async function handleLogin(event) {
    event.preventDefault();

    const { userName, userPassword } = user;

    if (userName.trim() === "" || userPassword.trim() === "") {
      alert("Please enter your username and password.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/file-researcher/users/me",
        {
          method: "GET",
          headers: {
            Authorization: "Basic " + btoa(userName + ":" + userPassword),
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const userData = await response.json();
        console.log("Logged in user:", userData);

        onLogin({
          ...userData,
          credentials: {
            username: userName,
            password: userPassword,
          },
        });

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
