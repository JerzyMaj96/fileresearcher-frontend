import React, { useEffect, useState } from "react";
import "./FileSetsPage.css";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import { request } from "../api_helper";

function FileSetsPage({ loggedInUser }) {
  const [fileSets, setFileSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await request(
          "GET",
          "http://localhost:8080/file-researcher/file-sets"
        );

        if (response.ok) {
          const data = await response.json();
          setFileSets(data);
        } else {
          setError("Failed to fetch file sets: " + response.statusText);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [loggedInUser]);

  async function handleDeleteFileSet(fileSetId) {
    if (!window.confirm("Are you sure you want to delete this file set ?"))
      return;

    try {
      const response = await request(
        "DELETE",
        `http://localhost:8080/file-researcher/file-sets/${fileSetId}`
      );

      if (response.ok) {
        setFileSets((prev) => prev.filter((set) => set.id !== fileSetId));
        alert("File set has been successfully deleted");
      } else {
        alert("Failed to delete file set: " + (await response.text()));
      }
    } catch (error) {
      alert("Something went wrong: " + error.message);
    }
  }

  async function handleSendFileZip(fileSetId, recipientEmail) {
    if (
      !window.confirm(
        `Would you like to send this file set to ${recipientEmail}?`
      )
    )
      return;

    try {
      const response = await request(
        "POST",
        `http://localhost:8080/file-researcher/file-sets/${fileSetId}/zip-archives/send?recipientEmail=${recipientEmail}`
      );

      if (response.ok) {
        alert("Files have been sent successfully");
      } else {
        alert("Failed to send files: " + (await response.text()));
      }
    } catch (error) {
      alert("Something went wrong: " + error.message);
    }
  }

  async function updateFileSet(fileSetId, field, oldValue, promptText) {
    const newValue = window.prompt(promptText, oldValue);
    if (!newValue || newValue === oldValue) return;

    try {
      const response = await request(
        "PATCH",
        `http://localhost:8080/file-researcher/file-sets/${fileSetId}/${field}?${field}=${newValue}`
      );

      if (response.ok) {
        setFileSets((prev) =>
          prev.map((set) =>
            set.id === fileSetId ? { ...set, [field]: newValue } : set
          )
        );
        alert(`${field} updated successfully`);
      } else {
        alert(`Failed to update ${field}: ` + (await response.text()));
      }
    } catch (error) {
      alert("Something went wrong: " + error.message);
    }
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
              <th>STATUS</th>
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
                <td className={`status-${set.status.toLowerCase()}`}>
                  {set.status}
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
