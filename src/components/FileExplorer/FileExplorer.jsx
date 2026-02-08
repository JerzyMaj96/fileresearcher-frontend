import React, { useState } from "react";
import "./FileExplorer.css";
import FileNode from "./FileNode";
import PathInput from "./PathInput";
import { authFetch, baseUrl } from "../api_helper";

function FileExplorer({ loggedInUser }) {
  const [path, setPath] = useState("");
  const [filter, setFilter] = useState("");
  const [files, setFiles] = useState(null);
  // const [allFiles, setAllFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPaths, setSelectedPaths] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [fileSetIsCreated, setFileSetIsCreated] = useState(false);

  function handlePathChange(event) {
    setPath(event.target.value);
  }

  function handleFilterChange(event) {
    setFilter(event.target.value);
  }

  async function handleScan() {
    if (loading) return;
    setLoading(true);

    try {
      const response = await authFetch(
        "POST",
        `${baseUrl}/file-researcher/explorer/scan`,
        { path: path },
      );

      if (response.ok) {
        const data = await response.json();
        // setAllFiles(data?.children || []);
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

  async function handleFilteredScan() {
    if (loading) return;

    if (!filter || filter.trim() === "") {
      alert("Please enter a valid file extension to filter by.");
      return;
    }

    setLoading(true);

    try {
      const response = await authFetch(
        "POST",
        `${baseUrl}/file-researcher/explorer/scan/filtered`,
        { path: path, extension: filter },
      );

      if (response.ok) {
        const text = await response.text();
        const data = text ? JSON.parse(text) : null;
        // setAllFiles(data?.children || []);
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
        prev.filter((p) => p !== node.path && !childPaths.includes(p)),
      );
    } else {
      setSelectedPaths((prev) => [...prev, node.path, ...childPaths]);
    }
  }

  async function handleCreateFileSet() {
    if (!name.trim() || !recipientEmail.trim() || selectedPaths.length === 0) {
      alert(
        "Name, recipient email and at least one selected path are required.",
      );
      return;
    }

    try {
      const response = await authFetch(
        "POST",
        "http://localhost:8080/file-researcher/file-sets",
        {
          name,
          description,
          recipientEmail,
          selectedPaths,
        },
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
  }

  // function filterFilesByExtension(nodes, extension) {
  //   if (!extension.trim()) return nodes;

  //   return nodes
  //     .map((node) => {
  //       if (node.directory && node.children?.length) {
  //         const filteredChildren = filterFilesByExtension(
  //           node.children,
  //           extension,
  //         );
  //         if (filteredChildren.length > 0) {
  //           return { ...node, children: filteredChildren };
  //         }
  //       } else if (node.name?.endsWith(extension)) {
  //         return node;
  //       }
  //       return null;
  //     })
  //     .filter(Boolean);
  // }

  // function handleFilterByExtension() {
  //   if (!filter.trim()) {
  //     setFiles(allFiles);
  //     return;
  //   }

  //   const filtered = filterFilesByExtension(allFiles, filter);
  //   setFiles(filtered);
  // }

  return (
    <div className="file-explorer">
      <h2>Welcome, {loggedInUser.name}!</h2>
      <p>Your user ID is: {loggedInUser.id}</p>

      <PathInput
        path={path}
        filter={filter}
        files={files}
        onPathChange={handlePathChange}
        onFilterChange={handleFilterChange}
        onScan={handleScan}
        onFilterByExtension={handleFilteredScan}
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
