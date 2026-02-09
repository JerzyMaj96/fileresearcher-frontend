import { useEffect, useState } from "react";
import "./History.css";
import HistoryInput from "./HistoryInput";
import { zipService } from "../../api/services";
import { useAuth } from "../../hooks/useAuth";

function History() {
  const { user } = useAuth();
  const [zipArchiveId, setZipArchiveId] = useState("");
  const [sentHistory, setSentHistory] = useState([]);
  const [lastRecipient, setLastRecipient] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadSentHistoryForUser();
    }
  }, [user]);

  const handleChange = (event) => setZipArchiveId(event.target.value);

  const loadSentHistoryForUser = async () => {
    setLoading(true);
    try {
      const data = await zipService.getHistory(zipArchiveId || null);
      setSentHistory(data);
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const displayLastRecipient = async () => {
    if (!zipArchiveId) return;
    setLoading(true);
    try {
      const data = await zipService.getLastRecipient(zipArchiveId);
      setLastRecipient(data);
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="history-explorer">
      <h2>History Researcher</h2>
      <HistoryInput
        zipArchiveId={zipArchiveId}
        lastRecipient={lastRecipient}
        onLoad={loadSentHistoryForUser}
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

      {!loading && sentHistory.length === 0 && <p>No history found.</p>}
    </div>
  );
}

export default History;
