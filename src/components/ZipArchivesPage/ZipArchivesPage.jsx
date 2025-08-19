import { useEffect, useState } from "react";
import "./ZipArchivesPage.css";
import ZipArchivesInput from "./ZipArchivesInput";

function ZipArchivesPage({ loggedInUser }) {
  const [fileSetId, setFileSetId] = useState("");
  const [zipArchives, setZipArchives] = useState([]);
  const [loading, setLoading] = useState(true);

  function handleChange(event) {
    setFileSetId(event.target.value);
  }

  useEffect(() => {
    loadZipArchivesForUser();
  }, [loggedInUser]);

  async function loadZipArchivesForUser() {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/file-researcher/zip-archives",
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
        setZipArchives(data);
        setLoading(false);
      } else {
        alert("Failed to fetch sent Zip archives ");
        setLoading(false);
      }
    } catch (error) {
      alert("Something went wrong" + error.message);
      setLoading(false);
    }
  }

  async function loadZipArchivesForFileSet() {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8080/file-researcher//file-sets/${fileSetId}/zip-archives`,
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
        setZipArchives(data);
        setLoading(false);
      } else {
        alert("Failed to fetch sent Zip archives ");
        setLoading(false);
      }
    } catch (error) {
      alert("Something went wrong" + error.message);
      setLoading(false);
    }
  }

  return (
    <div className="ziparchives-explorer">
      <h2>Zip Archive Researcher</h2>
      <ZipArchivesInput
        zipArchiveId={fileSetId}
        onLoad={loadZipArchivesForFileSet}
        onFileSetIdChange={handleChange}
      />

      {loading && <div className="loader" />}

      {zipArchives && !loading && zipArchives.length > 0 && (
        <div className="table-wrapper">
          <table className="table-ziparchive">
            <thead>
              <tr>
                <th>Zip Archive ID</th>
                <th>Archive Name</th>
                <th>Size</th>
                <th>Creation Date</th>
                <th>STATUS</th>
                <th>Recipient Email</th>
              </tr>
            </thead>
            <tbody>
              {zipArchives.map((zipArchive) => (
                <tr key={zipArchive.id}>
                  <td>{zipArchive.id}</td>
                  <td>{zipArchive.archiveName}</td>
                  <td>{zipArchive.size}</td>
                  <td>
                    {new Date(zipArchive.creationDate).toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className={`status-${zipArchive.status.toLowerCase()}`}>
                    {zipArchive.status}
                  </td>
                  <td>{zipArchive.recipientEmail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && zipArchives.length === 0 && fileSetId && (
        <p>No history found for archive ID: {fileSetId}</p>
      )}
    </div>
  );
}

export default ZipArchivesPage;
