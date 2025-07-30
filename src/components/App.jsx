import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoggingForm from "./LoggingForm";
import CreateAccountForm from "./CreateAccountForm";
import Header from "./Header";

function App() {
  const [userIsCreated, setUserIsCreated] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);

  function handleCreateAccountClick() {
    setUserIsCreated(false);
  }

  function handleLogin(userObject) {
    setLoggedInUser(userObject);
  }

  function handleLogout() {
    setLoggedInUser(null);
    setUserIsCreated(true);
  }

  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              loggedInUser ? (
                <div>
                  <h2>Welcome, {loggedInUser.name}!</h2>
                  <p>Your user ID is: {loggedInUser.id}</p>
                  <button onClick={handleLogout} className="form-button">
                    Log out
                  </button>
                  {/* {spot for FileExplorer component } */}
                </div>
              ) : userIsCreated ? (
                <div>
                  <h1>Hello!</h1>
                  <LoggingForm onLogin={handleLogin} onCreate={handleCreateAccountClick} />
                </div>
              ) : (
                <CreateAccountForm onBackToLogin={() => setUserIsCreated(true)} />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
