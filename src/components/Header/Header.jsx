import React from "react";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./Header.css";

function Header({ loggedInUser, onLogout }) {
  return (
    <header>
      <HomeFilledIcon />
      <h1>File Researcher App</h1>
      {loggedInUser && (
        <div className="header-user">
          <div className="user-box">
            <AccountCircleIcon className="avatar-icon" />
            <p className="user-name">Hello, {loggedInUser.name}!</p>
          </div>
          <LogoutIcon
            className="logout-icon"
            onClick={onLogout}
            titleAccess="Log out"
          />
        </div>
      )}
    </header>
  );
}

export default Header;
