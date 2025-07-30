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

  function handleLogin(event) {
    event.preventDefault();
    if (user.userName.trim() !== "") {
      props.onLogin(user.userName); // Używamy userName jako userId
    } else {
      alert("Please enter your username.");
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
