import React, { useEffect, useState } from "react";
import "./FileSetsPage.css";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";

function FileSetsPage({ loggedInUser }) {
  const [fileSets, setFileSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiRequest(
          "http://localhost:8080/file-researcher/file-sets"
        );
        setFileSets(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [loggedInUser]);

  async function apiRequest(url, methodType = {}) {
    try {
      const response = await fetch(url, {
        ...methodType,
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            btoa(
              loggedInUser.credentials.username +
                ":" +
                loggedInUser.credentials.password
            ),
          ...methodType.headers,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      return response.json().catch(() => null);
    } catch (error) {
      setError(error.message);
      alert("Something went wrong: " + error.message);
      throw error;
    }
  }

  async function handleDeleteFileSet(fileSetId) {
    if (!window.confirm("Are you sure you want to delete this file set ?"))
      return;

    await apiRequest(
      `http://localhost:8080/file-researcher/file-sets/${fileSetId}`,
      { method: "DELETE" }
    );

    setFileSets((prev) => prev.filter((set) => set.id !== fileSetId));
    alert("File set has been successfully deleted");
  }

  async function handleSendFileZip(fileSetId, recipientEmail) {
    if (
      !window.confirm(
        `Would you like to send this file set to ${recipientEmail}?`
      )
    )
      return;

    await apiRequest(
      `http://localhost:8080/file-researcher/file-sets/${fileSetId}/zip-archives/send?recipientEmail=${recipientEmail}`,
      { method: "POST" }
    );

    alert("Files have been sent successfully");
  }

  async function updateFileSet(fileSetId, field, oldValue, promptText) {
    const newValue = window.prompt(promptText, oldValue);
    if (!newValue || newValue === oldValue) return;

    await apiRequest(
      `http://localhost:8080/file-researcher/file-sets/${fileSetId}/${field}?${field}=${newValue}`,
      { method: "PATCH" }
    );

    setFileSets((prev) =>
      prev.map((set) =>
        set.id === fileSetId ? { ...set, [field]: newValue } : set
      )
    );

    alert(`${field} updated successfully`);
  }

  if (loading) return <div className="loader" />;
  if (error) return <p>Error loading file sets: {error}</p>;

  return (
    <div className="filesets-container">
      <h2>My Created FileSets</h2>
      {fileSets.length === 0 ? (
        <p>No file sets found</p>
      ) : (
        <table className="filesets-table">
          <thead>
            <tr>
              <th>File set ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Recipient E-mail</th>
              <th>Creation Date</th>
              <th>Delete</th>
              <th>Send</th>
            </tr>
          </thead>
          <tbody>
            {fileSets.map((set) => (
              <tr key={set.id}>
                <td>{set.id}</td>
                <td
                  onClick={() =>
                    updateFileSet(
                      set.id,
                      "name",
                      set.name,
                      "Enter new FileSet name"
                    )
                  }
                  style={{ cursor: "pointer" }}
                >
                  {set.name}
                </td>
                <td
                  onClick={() =>
                    updateFileSet(
                      set.id,
                      "description",
                      set.description,
                      "Enter new FileSet description"
                    )
                  }
                  style={{ cursor: "pointer" }}
                >
                  {set.description}
                </td>
                <td
                  onClick={() =>
                    updateFileSet(
                      set.id,
                      "recipientEmail",
                      set.recipientEmail,
                      "Enter new recipient email"
                    )
                  }
                  style={{ cursor: "pointer" }}
                >
                  {set.recipientEmail}
                </td>
                <td>
                  {new Date(set.creationDate).toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="action-cell-delete">
                  <DeleteIcon onClick={() => handleDeleteFileSet(set.id)} />
                </td>
                <td className="action-cell-send">
                  <SendIcon
                    onClick={() =>
                      handleSendFileZip(set.id, set.recipientEmail)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FileSetsPage;
