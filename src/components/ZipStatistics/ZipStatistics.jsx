import { useEffect, useState } from "react";
import ZipStatisticsInput from "./ZipStatisticsInput";

function ZipStatistics({ loggedInUser }) {
  const [zipStats, setZipStats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loggedInUser) {
      loadSentZipStats();
    }
  }, [loggedInUser]);

  async function loadSentZipStats() {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/file-researcher/zip-archives/stats",
        {
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
        }
      );

      if (response.ok) {
        const data = await response.json();
        setZipStats(data);
      } else {
        alert("Failed to fetch zip statistics");
      }
    } catch (error) {
      alert("Something went wrong: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="">
      <h2>Zip Statistics</h2>

      <ZipStatisticsInput />

      {loading && <div className="loader" />}

      {!loading && zipStats.length > 0 && (
        <table>
          <thead>
            <tr>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {zipStats.map((stat, index) => (
              <tr key={index}>
                <td></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ZipStatistics;
