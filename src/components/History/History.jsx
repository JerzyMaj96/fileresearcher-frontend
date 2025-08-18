import { useState } from "react";
import "./History.css";
import HistoryInput from "./HistoryInput";

function History({ loggedInUser }) {
  const [zipArchiveId, setZipArchiveId] = useState("");
  const [sentHistory, setSentHistory] = useState(null);
  const [loading, setLoading] = useState(null);

  function handleChange(event) {
    setZipArchiveId(event.target.value);
  }

  async function loadSentHistory() {
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

  return (
    <div className="file-explorer">
      <h2>History Researcher</h2>
      <HistoryInput
        onLoad={loadSentHistory}
        onZipArchiveIdChange={handleChange}
      />

      {loading && <div className="loader" />}

      {zipArchiveId && !loading && sentHistory.length > 0 && <div></div>}
    </div>
  );
}

export default History;
