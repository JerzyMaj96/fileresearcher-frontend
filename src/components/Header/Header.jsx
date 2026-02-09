import { useState } from "react";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import "./Header.css";
import { authFetch, baseUrl } from "../../api/api_helper";
import { useAuth } from "../../hooks/useAuth"; 

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth(); 

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const handleDeleteUser = async () => {
    if (!window.confirm(`Would you like to delete your account?`)) {
      return closeMenu();
    }

    try {
      const response = await authFetch(
        "DELETE",
        `${baseUrl}/file-researcher/users/delete-me`
      );

      if (response.ok) {
        alert("Account deleted successfully");
        logout(); 
      } else {
        alert("Failed to delete account");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <header>
      <div className="header-left">
        <HomeFilledIcon />
        <h1>File Researcher App</h1>
      </div>
      
      {user && (
        <div className="header-user">
          <div className="user-box" onClick={toggleMenu}>
            <AccountCircleIcon className="avatar-icon" />
            <p className="user-name">Hello, {user.name}!</p>
          </div>
          {menuOpen && (
            <div className="user-menu">
              <button onClick={() => { logout(); closeMenu(); }}>
                <LogoutIcon className="logout-icon" /> Log out
              </button>
              <button onClick={handleDeleteUser} className="delete-btn">
                <DeleteIcon /> Delete account
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;