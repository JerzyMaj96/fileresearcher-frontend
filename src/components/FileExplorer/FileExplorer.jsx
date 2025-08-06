import React, { useState } from "react";
import "./FileExplorer.css";

function FileExplorer({ loggedInUser }) {
  const [path, setPath] = useState("");
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(null);

  function handlePathChange(event) {
    setPath(event.target.value);
  }

  async function handleScan(event) {
    event.preventDefault();

    setLoading(true);

    const givenPath = { path };

    try {
      const response = await fetch(
        "http://localhost:8080/file-researcher/explorer/scan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(givenPath),
        }
      );
      if (response.ok) {
        const data = await response.json();

        if (data && data.children) {
          setFiles(data.children);
          alert("Path successfully scanned. ");
        } else {
          alert("Path scanned but no files found");
          setFiles([]);
        }

        setLoading(false);
      } else {
        const errorMessage = await response.text();
        alert("Error: " + (errorMessage || "Unknown error"));
        setLoading(false);
      }
    } catch (error) {
      alert("Something went wrong: " + error.message);
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
        <table className="file-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Size (bytes)</th>
              <th>Path</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={index}>
                <td>{file.name}</td>
                <td>{file.directory ? "Directory" : "File"}</td>
                <td>{file.directory ? "-" : file.size}</td>
                <td>{file.path}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {files && files.length === 0 && (
        <p className="no-files-message">No files found in the selected path.</p>
      )}
    </div>
  );
}

export default FileExplorer;
