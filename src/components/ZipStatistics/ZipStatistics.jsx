import { useEffect, useState } from "react";
import "./ZipStatistics.css";
import ZipStatisticsInput from "./ZipStatisticsInput";
import { authFetch } from "../api_helper";
import { formatSize } from "../utils";

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

  async function loadStats() {
    setLoading(true);
    try {
      const response = await authFetch(
        "GET",
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

  const minLargeSize = 0; //POSSIBLE TO CHANGE TO 1024 * 1024 * 1024 = 1GB

  async function loadLargeZips() {
    try {
      const response = await authFetch(
        "GET",
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

  return (
    <div>
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
      </div>

      {filteredZips.length > 0 && (
        <div className="large-archives">
          <h3>Large Zip Archives</h3>
          <table>
            <thead>
              <tr>
                <th>Zip Archive ID</th>
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
