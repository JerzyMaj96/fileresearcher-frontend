import React, { useState } from "react";
import "./FileExplorer.css";
import FileNode from "./FileNode";
import PathInput from "./PathInput";

function FileExplorer({ loggedInUser }) {
  const [path, setPath] = useState("");
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPaths, setSelectedPaths] = useState([]);

  function handlePathChange(event) {
    setPath(event.target.value);
  }

  async function handleScan() {
    if (loading) return;
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
        setFiles(data?.children || []);
      } else {
        alert("Error: " + (await response.text()));
      }
    } catch (error) {
      alert("Something went wrong: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  function getAllChildPaths(node) {
    let paths = [];
    if (node.directory && node.children?.length) {
      node.children.forEach((child) => {
        paths.push(child.path);
        if (child.directory) {
          paths = paths.concat(getAllChildPaths(child));
        }
      });
    }
    return paths;
  }

  function toggleSelect(node) {
    const isSelected = selectedPaths.includes(node.path);
    const childPaths = getAllChildPaths(node);

    if (isSelected) {
      setSelectedPaths((prev) =>
        prev.filter((p) => p !== node.path && !childPaths.includes(p))
      );
    } else {
      setSelectedPaths((prev) => [...prev, node.path, ...childPaths]);
    }
  }

  async function handleCreateFileSet() {
    try {
      const response = await fetch(
        "http://localhost:8080/file-researcher/file-sets",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path,
            selected: selectedPaths,
          }),
        }
      );
      if (response.ok) {
        alert("File set created successfully!");
      } else {
        alert("Error creating file set");
      }
    } catch (error) {
      alert("Something went wrong: " + error.message);
    }
  }

  return (
    <div className="file-explorer">
      <h2>Welcome, {loggedInUser.name}!</h2>
      <p>Your user ID is: {loggedInUser.id}</p>

      <PathInput
        path={path}
        onPathChange={handlePathChange}
        onScan={handleScan}
      />

      {loading && <div className="loader" />}

      {files && !loading && files.length > 0 && (
        <>
          {selectedPaths.length > 0 && (
            <button
              onClick={handleCreateFileSet}
              className="create-fileset-button"
            >
              Create File Set ({selectedPaths.length})
            </button>
          )}

          <div className="file-tree">
            {files.map((file, index) => (
              <FileNode
                key={index}
                node={file}
                toggleSelect={toggleSelect}
                selectedPaths={selectedPaths}
              />
            ))}
          </div>
        </>
      )}

      {files && files.length === 0 && !loading && (
        <p className="no-files-message">No files found in the selected path.</p>
      )}
    </div>
  );
}

export default FileExplorer;
