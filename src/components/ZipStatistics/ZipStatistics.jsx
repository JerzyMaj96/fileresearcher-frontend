import { useEffect, useState } from "react";
import "./ZipStatistics.css";
import ZipStatisticsInput from "./ZipStatisticsInput";

function ZipStatistics({ loggedInUser }) {
  const [stats, setStats] = useState(null);
  const [largeZips, setLargeZips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (loggedInUser) {
      loadStats();
      loadLargeZips();
    }
  }, [loggedInUser]);

  async function fetchWithAuth(url) {
    return fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization:
          "Basic " +
          btoa(
            loggedInUser.credentials.username +
              ":" +
              loggedInUser.credentials.password
          ),
      },
      credentials: "include",
    });
  }

  async function loadStats() {
    setLoading(true);
    try {
      const response = await fetchWithAuth(
        "http://localhost:8080/file-researcher/zip-archives/stats"
      );
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        alert("Failed to fetch statistics");
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  const minLargeSize = 0; //POSSIBLE TO CHANGE FOR 1024 * 1024 * 1024 = 1GB

  async function loadLargeZips() {
    try {
      const response = await fetchWithAuth(
        `http://localhost:8080/file-researcher/zip-archives/large?minSize=${minLargeSize}`
      );
      if (response.ok) {
        const data = await response.json();
        setLargeZips(data);
      } else {
        alert("Failed to fetch large zip archives");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  }

  const filteredZips = largeZips.filter(
    (zip) =>
      zip.recipientEmail?.toLowerCase().includes(filter.toLowerCase()) ||
      zip.status?.toLowerCase().includes(filter.toLowerCase())
  );

  function formatSize(bytes) {
    if (bytes === 0) return "0 B";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, i);
    return `${value.toFixed(2)} ${sizes[i]}`;
  }

  return (
    <div className="zip-stats">
      <h2>Zip Statistics</h2>

      <ZipStatisticsInput onRefresh={loadStats} onFilterChange={setFilter} />

      {loading && <div className="loader"></div>}

      {stats && (
        <div className="stats-summary">
          <div className="stat-card success">
            ✅ Successful: {stats.successCount}
          </div>
          <div className="stat-card failure">
            ❌ Failed: {stats.failureCount}
          </div>
          {stats.totalSize && (
            <div className="stat-card">
              📦 Total size: {stats.totalSize} bytes
            </div>
          )}
        </div>
      )}

      {filteredZips.length > 0 && (
        <div className="large-archives">
          <h3>Large Zip Archives</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Archive Name</th>
                <th>Size (MB)</th>
                <th>Status</th>
                <th>Recipient</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredZips.map((zip) => (
                <tr key={zip.id}>
                  <td>{zip.id}</td>
                  <td>{zip.archiveName}</td>
                  <td>{formatSize(zip.size)}</td>
                  <td className={`status ${zip.status.toLowerCase()}`}>
                    {zip.status}
                  </td>
                  <td>{zip.recipientEmail}</td>
                  <td>{new Date(zip.creationDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ZipStatistics;
