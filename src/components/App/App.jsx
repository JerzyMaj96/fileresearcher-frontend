import React, { useEffect, useState } from "react";
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
import History from "../History/History";
import ZipArchivesPage from "../ZipArchivesPage/ZipArchivesPage";
import ZipStatistics from "../ZipStatistics/ZipStatistics";
import { authFetch, baseUrl, getAuthToken, setAuthToken } from "../api_helper";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    const token = getAuthToken();

    if (token) {
      authFetch(
        "GET",
        `${baseUrl}/file-researcher/users/authentication`
      )
        .then(async (response) => {
          if (response.ok) {
            const userData = await response.json();
            setLoggedInUser(userData);
          } else {
            setLoggedInUser(null);
            setAuthToken(null);
          }
        })
        .catch(() => {
          setLoggedInUser(null);
        })
        .finally(() => {
          setIsCheckingToken(false);
        });
    } else {
      setIsCheckingToken(false);
    }
  }, []);

  const handleLogin = (userObject) => {
    setLoggedInUser(userObject);
  }

  const handleLogout = () => {
    setLoggedInUser(null);
    setAuthToken(null);
  }

  if (isCheckingToken) {
    return <div className="loader"></div>;
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
            <Route
              path="/zip-archives"
              element={
                loggedInUser ? (
                  <ZipArchivesPage loggedInUser={loggedInUser} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/history"
              element={
                loggedInUser ? (
                  <History loggedInUser={loggedInUser} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/zip-stats"
              element={
                loggedInUser ? (
                  <ZipStatistics loggedInUser={loggedInUser} />
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
