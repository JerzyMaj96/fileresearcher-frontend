import React from "react";
import "./FileExplorer.css";

function FileExplorer({ loggedInUser }) {
  return (
    <div>
      <h2>Welcome, {loggedInUser.name}!</h2>
      <p>Your user ID is: {loggedInUser.id}</p>
    </div>
  );
}

export default FileExplorer;
