import { useEffect, useState } from "react";
import "./ZipStatistics.css";
import ZipStatisticsInput from "./ZipStatisticsInput";
import { zipService } from "../../api/services";
import { useAuth } from "../../hooks/useAuth";
import { formatSize } from "../../components/utils";

function ZipStatistics() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [largeZips, setLargeZips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, largeData] = await Promise.all([
        zipService.getStats(),
        zipService.getLargeArchives(0),
      ]);

      setStats(statsData);
      setLargeZips(largeData);
    } catch (error) {
      alert("Error loading statistics: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredZips = largeZips.filter(
    (zip) =>
      zip.recipientEmail?.toLowerCase().includes(filter.toLowerCase()) ||
      zip.status?.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div>
      <div className="zip-stats">
        <h2>Zip Statistics</h2>
        <ZipStatisticsInput onRefresh={fetchData} onFilterChange={setFilter} />

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
                📦 Total size: {formatSize(stats.totalSize)}
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
                <th>ID</th>
                <th>Archive Name</th>
                <th>Size</th>
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
