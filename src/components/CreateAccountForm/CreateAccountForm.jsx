import React, { useState } from "react";
import "./CreateAccountForm.css";

function CreateAccountForm(props) {
  const [user, setUser] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
  });

  function handleChange(event) {
    const { value, name } = event.target;
    setUser((prevValue) => ({ ...prevValue, [name]: value }));
  }

  async function handleUser(event) {
    event.preventDefault();

    const newUser = {
      name: user.userName,
      email: user.userEmail,
      password: user.userPassword,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/file-researcher/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert(
          "Your user account has been successfully created! Your ID is: " +
            data.id
        );
        setUser({
          userName: "",
          userEmail: "",
          userPassword: "",
        });
        props.onBackToLogin();
      } else {
        const errorMessage = await response.text();
        alert("Error: " + errorMessage);
      }
    } catch (error) {
      alert("Something went wrong: " + error.message);
    }
  }

  return (
    <form onSubmit={handleUser} className="form">
      <input
        onChange={handleChange}
        name="userName"
        placeholder="Type in user name"
        value={user.userName}
        className="form-input"
      />
      <input
        onChange={handleChange}
        name="userEmail"
        placeholder="Type in your email"
        value={user.userEmail}
        className="form-input"
      />
      <input
        onChange={handleChange}
        name="userPassword"
        placeholder="Type in your password"
        type="password"
        value={user.userPassword}
        className="form-input"
      />
      <button type="submit" className="form-button">
        Create User
      </button>
      <p onClick={props.onBackToLogin} className="form-link">
        Back to Login
      </p>
    </form>
  );
}

export default CreateAccountForm;
