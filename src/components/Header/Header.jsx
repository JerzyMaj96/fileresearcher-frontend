import React, { useState } from "react";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import "./Header.css";

function Header({ loggedInUser, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  async function handleDeleteUser() {
    if (!window.confirm(`Would you like to delete your account?`)) {
      return closeMenu(false);
    }

    try {
      const response = await fetch(
        `http://localhost:8080/file-researcher/users/delete-me`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              "Basic " +
              btoa(
                loggedInUser.credentials.username +
                  ":" +
                  loggedInUser.credentials.password
              ),
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        alert("Account deleted successfully");
        onLogout();
      } else {
        alert("Failed to delete your user account");
      }
    } catch (error) {
      alert("Something went wrong: " + error.message);
    }
  }

  return (
    <header>
      <HomeFilledIcon />
      <h1>File Researcher App</h1>
      {loggedInUser && (
        <div className="header-user">
          <div className="user-box" onClick={toggleMenu}>
            <AccountCircleIcon className="avatar-icon" />
            <p className="user-name">Hello, {loggedInUser.name}!</p>
          </div>
          {menuOpen && (
            <div className="user-menu">
              <button
                onClick={() => {
                  onLogout();
                  closeMenu();
                }}
              >
                <LogoutIcon className="logout-icon" titleAccess="Log out" />
                Log out
              </button>
              <button onClick={handleDeleteUser}>
                <DeleteIcon />
                Delete account
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
