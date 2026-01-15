import React, { useEffect, useState, useRef } from "react";
import "./FileSetsPage.css";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import { authFetch } from "../api_helper";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import ProgressBar from "../ProgressBar/ProgressBar";

function FileSetsPage({ loggedInUser }) {
  const [fileSets, setFileSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const stompClientRef = useRef(null);

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await authFetch(
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

  const disconnectSocket = () => {
    if (stompClientRef.current) {
      stompClientRef.current.disconnect();
      stompClientRef.current = null;
    }
  };

  async function handleDeleteFileSet(fileSetId) {
    if (isProcessing) return; // Blokada podczas wysyłania
    if (!window.confirm("Are you sure you want to delete this file set ?"))
      return;

    try {
      const response = await authFetch(
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
    if (isProcessing) return;
    if (
      !window.confirm(
        `Would you like to send this file set to ${recipientEmail}?`
      )
    )
      return;

    setIsProcessing(true);
    setProgress(0);
    setProgressMessage("Starting the sending process...");
    setIsError(false);

    try {
      const response = await authFetch(
        "POST",
        `http://localhost:8080/file-researcher/file-sets/${fileSetId}/zip-archives/send-progress?recipientEmail=${recipientEmail}`
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const taskId = await response.text();
      console.log("Task ID received:", taskId);

      const socket = new SockJS("http://localhost:8080/ws");
      const stompClient = Stomp.over(socket);

      stompClientRef.current = stompClient;

      stompClient.connect(
        {},
        () => {
          stompClient.subscribe(`/topic/progress/${taskId}`, (message) => {
            const body = JSON.parse(message.body);

            setProgress(body.percent);
            setProgressMessage(body.status);

            if (body.percent === -1) {
              setIsError(true);
              disconnectSocket();
              setTimeout(() => setIsProcessing(false), 5000); // Ukryć pasek po 5s
            } else if (body.percent >= 100) {
              setProgress(100);
              setProgressMessage(body.status); // "Completed!"
              disconnectSocket();
              setTimeout(() => {
                alert("Files have been sent successfully!");

                setIsProcessing(false);

                setFileSets((prev) =>
                  prev.map((s) =>
                    s.id === fileSetId ? { ...s, status: "SENT" } : s
                  )
                );
              }, 500);
            }
          });
        },
        (error) => {
          console.error("Socket connection error:", error);
          setIsError(true);
          setProgressMessage("Connection failed. Check server.");
          disconnectSocket();
          setTimeout(() => setIsProcessing(false), 3000);
        }
      );
    } catch (error) {
      alert("Something went wrong: " + error.message);
      setIsProcessing(false);
    }
  }

  async function updateFileSet(fileSetId, field, oldValue, promptText) {
    if (isProcessing) return;
    const newValue = window.prompt(promptText, oldValue);
    if (!newValue || newValue === oldValue) return;

    try {
      const response = await authFetch(
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
      {isProcessing && (
        <div className="progress-bar-container">
          <h3>Sending files...</h3>
          <ProgressBar
            percent={progress}
            message={progressMessage}
            isError={isError}
          />
        </div>
      )}

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
                  <DeleteIcon
                    onClick={() => handleDeleteFileSet(set.id)}
                    style={{
                      cursor: isProcessing ? "not-allowed" : "pointer",
                      opacity: isProcessing ? 0.3 : 1,
                    }}
                  />
                </td>
                <td className="action-cell-send">
                  <SendIcon
                    onClick={() =>
                      handleSendFileZip(set.id, set.recipientEmail)
                    }
                    style={{
                      cursor: isProcessing ? "not-allowed" : "pointer",
                      opacity: isProcessing ? 0.3 : 1,
                      color: isProcessing ? "grey" : "",
                    }}
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
