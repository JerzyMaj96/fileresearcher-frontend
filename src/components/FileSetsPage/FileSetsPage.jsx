import React, { useEffect, useState } from "react";
import "./FileSetsPage.css";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";

function FileSetsPage({ loggedInUser }) {
  const [fileSets, setFileSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFileSets();
  }, [loggedInUser]);

  async function fetchFileSets() {
    try {
      const response = await fetch(
        "http://localhost:8080/file-researcher/file-sets",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Basic " +
              btoa(
                loggedInUser.credentials.username +
                  ":" +
                  loggedInUser.credentials.password
              ),
          },
          credentials: "include",
        }
      );

      const data = await response.json();
      setFileSets(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteFileSet(fileSetId) {
    if (!window.confirm("Are you sure you want to delete this file set ?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/file-researcher/file-sets/${fileSetId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Basic " +
              btoa(
                loggedInUser.credentials.username +
                  ":" +
                  loggedInUser.credentials.password
              ),
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        alert("File set has been successfully deleted");
        setFileSets((prev) => prev.filter((set) => set.id !== fileSetId));
      } else {
        alert("Failed to delete file set");
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
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/file-researcher/file-sets/${fileSetId}/zip-archives/send?recipientEmail=${recipientEmail}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Basic " +
              btoa(
                loggedInUser.credentials.username +
                  ":" +
                  loggedInUser.credentials.password
              ),
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        alert("Files have been send successfully");
      } else {
        alert("Failed to send the files");
      }
    } catch (error) {
      alert("Something went wrong: " + error.message);
    }
  }

  async function changeRecipientEmail(fileSetId, oldRecipientEmail) {
    const newRecipientEmail = window.prompt(
      "Enter new recipient email: " + oldRecipientEmail
    );

    if (!newRecipientEmail || newRecipientEmail === oldRecipientEmail) return;

    try {
      const response = await fetch(
        `http://localhost:8080/file-researcher/file-sets/${fileSetId}/recipient-email?newRecipientEmail=${newRecipientEmail}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Basic " +
              btoa(
                loggedInUser.credentials.username +
                  ":" +
                  loggedInUser.credentials.password
              ),
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        alert("Recipient email updated successfully");
        setFileSets((prev) =>
          prev.map((set) =>
            set.id === fileSetId
              ? { ...set, recipientEmail: newRecipientEmail }
              : set
          )
        );
      } else {
        alert("Failed to update recipient email");
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
              <th>Creation Date</th>
              <th>Delete</th>
              <th>Send</th>
            </tr>
          </thead>
          <tbody>
            {fileSets.map((set) => (
              <tr key={set.id}>
                <td>{set.id}</td>
                <td>{set.name}</td>
                <td>{set.description}</td>
                <td
                  onClick={() =>
                    changeRecipientEmail(set.id, set.recipientEmail)
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
