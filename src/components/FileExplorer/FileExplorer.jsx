import React, { useState } from "react";
import "./FileExplorer.css";
import FileNode from "./FileNode";

function FileExplorer({ loggedInUser }) {
  const [path, setPath] = useState("");
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);

  function handlePathChange(event) {
    setPath(event.target.value);
  }

  async function handleScan(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/file-researcher/explorer/scan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.children) {
          setFiles(data.children);
        } else {
          setFiles([]);
        }
      } else {
        alert("Error: " + (await response.text()));
      }
    } catch (error) {
      alert("Something went wrong: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="file-explorer">
      <h2>Welcome, {loggedInUser.name}!</h2>
      <p>Your user ID is: {loggedInUser.id}</p>

      <div className="path-input-group">
        <input
          type="text"
          value={path}
          onChange={handlePathChange}
          placeholder="Enter path (e.g., C:/Users/...)"
          className="path-input"
        />
        <button onClick={handleScan} className="scan-button">
          Scan
        </button>
      </div>

      {loading && <div className="loader" />}

      {files && !loading && files.length > 0 && (
        <div className="file-tree">
          {files.map((file, index) => (
            <FileNode key={index} node={file} />
          ))}
        </div>
      )}

      {files && files.length === 0 && !loading && (
        <p className="no-files-message">No files found in the selected path.</p>
      )}
    </div>
  );
}

export default FileExplorer;
