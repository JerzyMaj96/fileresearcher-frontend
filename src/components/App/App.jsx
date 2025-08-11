import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoggingForm from "../LoggingForm/LoggingForm";
import CreateAccountForm from "../CreateAccountForm/CreateAccountForm";
import Header from "../Header/Header";
import FileExplorer from "../FileExplorer/FileExplorer";
import "./App.css";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  function handleLogin(userObject) {
    setLoggedInUser(userObject);
  }

  function handleLogout() {
    setLoggedInUser(null);
  }

  return (
    <Router>
      <Header loggedInUser={loggedInUser} onLogout={handleLogout} />
      <div className="container">
        <Routes>
          <Route
            path="/login"
            element={
              loggedInUser ? (
                <Navigate to="/explorer" />
              ) : (
                <LoggingForm onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/register"
            element={
              loggedInUser ? <Navigate to="/explorer" /> : <CreateAccountForm />
            }
          />
          <Route
            path="/explorer"
            element={
              loggedInUser ? (
                <FileExplorer loggedInUser={loggedInUser} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
