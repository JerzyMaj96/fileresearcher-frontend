import React, { useEffect, useState } from "react";

function FileSetsPage({ loggedInUser }) {
  const [fileSets, setFileSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchFileSets();
  }, []);

  if (loading) return <div className="loader" />;
  if (error) return <p>Error loading file sets: {error}</p>;

  return (
    <div>
      <h2>My Created FileSets</h2>
      <ul>
        {fileSets.map((set) => (
          <li key={set.id}>
            <strong>{set.name}</strong> - {set.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileSetsPage;
