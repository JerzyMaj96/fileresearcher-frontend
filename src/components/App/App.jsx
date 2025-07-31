import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoggingForm from "../LoggingForm/LoggingForm";
import CreateAccountForm from "../CreateAccountForm/CreateAccountForm";
import Header from "../Header/Header";
import FileExplorer from "../FileExplorer/FileExplorer";
import "./App.css";

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
      <Header loggedInUser={loggedInUser} onLogout={handleLogout} />
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              loggedInUser ? (
                <div>
                  <FileExplorer
                    loggedInUser={loggedInUser}
                    onLogout={handleLogout}
                  />
                </div>
              ) : userIsCreated ? (
                <div>
                  <h1>Hello!</h1>
                  <LoggingForm
                    onLogin={handleLogin}
                    onCreate={handleCreateAccountClick}
                  />
                </div>
              ) : (
                <CreateAccountForm
                  onBackToLogin={() => setUserIsCreated(true)}
                />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
