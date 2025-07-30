import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoggingForm from "./LoggingForm";
import CreateAccountForm from "./CreateAccountForm";
import Header from "./Header";

function App() {
  const [userIsCreated, setUserIsCreated] = useState(true);
  const [userId, setUserId] = useState(null);

  function handleCreateAccountClick() {
    setUserIsCreated(false);
  }

  function handleLogin(userIdFromLogin) {
    setUserId(userIdFromLogin);
  }

  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              userId ? (
                <div>
                  <h2>Welcome, user {userId}!</h2>
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
