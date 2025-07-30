import React, { useState } from "react";

function LoggingForm(props) {
  const [user, setUser] = useState({
    userName: "",
    userPassword: "",
  });

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
      const response = await fetch("http://localhost:8080/file-researcher/users/me", {
        method: "GET",
        headers: {
          Authorization: "Basic " + btoa(userName + ":" + userPassword),
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("Logged in user:", userData);

        // przekazujemy userData i credentialsy dalej, np. do App.js
        props.onLogin({
          ...userData,
          credentials: {
            username: userName,
            password: userPassword,
          },
        });
      } else {
        const message = await response.text();
        alert("Login failed: " + message);
      }
    } catch (error) {
      alert("Something went wrong: " + error.message);
    }
  }

  function handleCreate() {
    props.onCreate();
  }

  return (
    <form onSubmit={handleLogin} className="form">
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
      <button type="submit" className="form-button">Log in</button>
      <p onClick={handleCreate} className="form-link">I am not a user yet!</p>
    </form>
  );
}

export default LoggingForm;
