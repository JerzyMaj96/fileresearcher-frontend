import { useEffect, useState } from "react";
import "./History.css";
import HistoryInput from "./HistoryInput";

function History({ loggedInUser }) {
  const [zipArchiveId, setZipArchiveId] = useState("");
  const [sentHistory, setSentHistory] = useState([]);
  const [lastRecipient, setLastRecipient] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSentHistoryForUser();
  }, [loggedInUser]);

  function handleChange(event) {
    setZipArchiveId(event.target.value);
  }

  async function loadSentHistoryForUser() {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8080/file-researcher/zip-archives/history`,
        {
          method: "GET",
          headers: {
            "Content-type": "Application/json",
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
        const data = await response.json();
        setSentHistory(data);
        setLoading(false);
      } else {
        alert("Failed to fetch sent history");
        setLoading(false);
      }
    } catch (error) {
      alert("Something went wrong" + error.message);
      setLoading(false);
    }
  }

  async function loadSentHistoryForZipArchive() {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8080/file-researcher/zip-archives/${zipArchiveId}/history`,
        {
          method: "GET",
          headers: {
            "Content-type": "Application/json",
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
        const data = await response.json();
        setSentHistory(data);
        setLoading(false);
      } else {
        alert(
          "Failed to fetch sent history of a ZipArchive with ID: " +
            zipArchiveId
        );
        setLoading(false);
      }
    } catch (error) {
      alert("Something went wrong" + error.message);
      setLoading(false);
    }
  }

  async function displayLastRecipient() {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8080/file-researcher/zip-archives/${zipArchiveId}/history/last-recipient`,
        {
          method: "GET",
          headers: {
            "Content-type": "Application/json",
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
        const data = await response.text();
        setLastRecipient(data);
        setLoading(false);
      } else {
        alert("Failed to fetch the last recipient");
        setLoading(false);
      }
    } catch (error) {
      alert("Something went wrong" + error.message);
      setLoading(false);
    }
  }

  return (
    <div className="history-explorer">
      <h2>History Researcher</h2>
      <HistoryInput
        zipArchiveId={zipArchiveId}
        lastRecipient={lastRecipient}
        onLoad={loadSentHistoryForZipArchive}
        onGetLastRecipient={displayLastRecipient}
        onZipArchiveIdChange={handleChange}
      />

      {loading && <div className="loader" />}

      {sentHistory && !loading && sentHistory.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Send ID</th>
              <th>Attempt Date</th>
              <th>STATUS</th>
              <th>Recipient email</th>
            </tr>
          </thead>
          <tbody>
            {sentHistory.map((history) => (
              <tr key={history.id}>
                <td>{history.id}</td>
                <td>
                  {new Date(history.sentAttemptDate).toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className={`status-${history.status.toLowerCase()}`}>
                  {history.status}
                </td>
                <td>{history.sentToEmail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && sentHistory.length === 0 && zipArchiveId && (
        <p>No history found for archive ID: {zipArchiveId}</p>
      )}
    </div>
  );
}

export default History;
