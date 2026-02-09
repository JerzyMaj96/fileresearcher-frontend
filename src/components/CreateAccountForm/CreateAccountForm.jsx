import React, { useState } from "react";
import "./CreateAccountForm.css";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../api/services";

function CreateAccountForm() {
  const [user, setUser] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { value, name } = event.target;
    setUser((prevValue) => ({ ...prevValue, [name]: value }));
  };

  const handleUser = async (event) => {
    event.preventDefault();

    const newUser = {
      name: user.userName,
      email: user.userEmail,
      password: user.userPassword,
    };

    try {
      const data = await authService.register(newUser);

      alert(
        "Your user account has been successfully created! Your ID is: " +
          data.id,
      );
      setUser({ userName: "", userEmail: "", userPassword: "" });
      navigate("/login");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <form onSubmit={handleUser} className="form-container">
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
      <p className="form-link">
        <Link to="/login">Back to Login</Link>
      </p>
    </form>
  );
}

export default CreateAccountForm;
