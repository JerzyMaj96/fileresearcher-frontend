import React, { useState } from "react";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./Header.css";

function Header({ loggedInUser, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

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
                  closeMenu;
                }}
              >
                <LogoutIcon className="logout-icon" titleAccess="Log out" />
                Log out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
