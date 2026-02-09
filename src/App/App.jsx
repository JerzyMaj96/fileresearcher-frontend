import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./hooks/useAuth";

import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import LoggingForm from "./components/LoggingForm/LoggingForm";
import CreateAccountForm from "./components/CreateAccountForm/CreateAccountForm";
import FileExplorer from "./components/FileExplorer/FileExplorer";
import FileSetsPage from "./components/FileSetsPage/FileSetsPage";
import ZipArchivesPage from "./components/ZipArchivesPage/ZipArchivesPage";
import History from "./components/History/History";
import ZipStatistics from "./components/ZipStatistics/ZipStatistics";
import "./App.css";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <Router>
      <Header onLogout={logout} />
      <div className="container">
        {user && <Sidebar />}
        <main className="main-content">
          <Routes>
            <Route
              path="/login"
              element={user ? <Navigate to="/explorer" /> : <LoggingForm />}
            />
            <Route
              path="/register"
              element={
                user ? <Navigate to="/explorer" /> : <CreateAccountForm />
              }
            />

            <Route
              path="/explorer"
              element={
                <ProtectedRoute>
                  <FileExplorer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/filesets"
              element={
                <ProtectedRoute>
                  <FileSetsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/zip-archives"
              element={
                <ProtectedRoute>
                  <ZipArchivesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/zip-stats"
              element={
                <ProtectedRoute>
                  <ZipStatistics />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}

export default App;
