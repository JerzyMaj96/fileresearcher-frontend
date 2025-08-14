// Sidebar.js
import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <nav className="sidebar">
      <ul>
        <li>
          <NavLink
            to="/explorer"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Explorer
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/filesets"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            My FileSets
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
