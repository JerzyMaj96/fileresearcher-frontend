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
import Sidebar from "../Sidebar/Sidebar";
import FileSetsPage from "../FileSetsPage/FileSetsPage";
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
        {loggedInUser && <Sidebar />}
        <main className="main-content">
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
                loggedInUser ? (
                  <Navigate to="/explorer" />
                ) : (
                  <CreateAccountForm />
                )
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
            <Route
              path="/filesets"
              element={
                loggedInUser ? (
                  <FileSetsPage loggedInUser={loggedInUser} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
