import React, { useState } from "react";
import "./FileExplorer.css";
import FileNode from "./FileNode";
import PathInput from "./PathInput";
import { authFetch, baseUrl } from "../../api/api_helper";
import { useAuth } from "../../hooks/useAuth";

function FileExplorer() {
  const { user } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filter, setFilter] = useState("");
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPaths, setSelectedPaths] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [fileSetIsCreated, setFileSetIsCreated] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleScan = async () => {
    if (loading || selectedFiles.length === 0) {
      alert("Please select a folder first!");
      return;
    }
    setLoading(true);

    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    if (filter) {
      formData.append("extension", filter);
    }

    try {
      const response = await authFetch(
        "POST",
        `${baseUrl}/file-researcher/explorer/upload`,
        formData,
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
  };

  const getAllChildPaths = (node) => {
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
  };

  const toggleSelect = (node) => {
    const isSelected = selectedPaths.includes(node.path);
    const childPaths = getAllChildPaths(node);

    if (isSelected) {
      setSelectedPaths((prev) =>
        prev.filter((p) => p !== node.path && !childPaths.includes(p)),
      );
    } else {
      setSelectedPaths((prev) => [...prev, node.path, ...childPaths]);
    }
  };

  const handleCreateFileSet = async () => {
    if (!name.trim() || !recipientEmail.trim() || selectedPaths.length === 0) {
      alert(
        "Name, recipient email and at least one selected path are required.",
      );
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("recipientEmail", recipientEmail);

    const filesToUpload = selectedFiles.filter((file) =>
      selectedPaths.includes(file.webkitRelativePath || file.name),
    );

    filesToUpload.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await authFetch(
        "POST",
        `${baseUrl}/file-researcher/file-sets`,
        formData,
      );
      if (response.ok) {
        alert("File set created successfully!");
        setFileSetIsCreated(true);
      } else {
        const errorText = await response.text();
        alert(
          `Error creating file set (status ${response.status}) : ${errorText}`,
        );
      }
    } catch (error) {
      alert("Something went wrong: " + error.message);
    }
  };

  return (
    <div className="file-explorer">
      <h2>Welcome, {user?.name}!</h2>
      <p>Your user ID is: {user?.id}</p>

      <PathInput
        selectedFiles={selectedFiles}
        filter={filter}
        files={files}
        onFileChange={handleFileChange}
        onFilterChange={handleFilterChange}
        onScan={handleScan}
      />

      {loading && <div className="loader" />}

      {files && !loading && files.length > 0 && (
        <>
          {selectedPaths.length > 0 && !fileSetIsCreated && (
            <>
              <div className="fileset-form">
                <input
                  type="text"
                  placeholder="File Set Name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
                <input
                  type="email"
                  placeholder="Recipient Email"
                  value={recipientEmail}
                  onChange={(event) => setRecipientEmail(event.target.value)}
                />
              </div>

              <button
                onClick={handleCreateFileSet}
                className="create-fileset-button"
              >
                Create File Set ({selectedPaths.length})
              </button>
            </>
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
