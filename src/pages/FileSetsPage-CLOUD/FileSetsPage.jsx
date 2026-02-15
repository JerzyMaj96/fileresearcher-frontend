import React, { useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import "./FileSetsPage.css";
import { fileSetService } from "../../api/services";

function FileSetsPage() {
  const [fileSets, setFileSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFileSets();
  }, []);

  const loadFileSets = async () => {
    try {
      const data = await fileSetService.getAll();
      setFileSets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this file set?")) return;
    try {
      await fileSetService.delete(id);
      setFileSets((prev) => prev.filter((s) => s.id !== id));
      alert("Deleted successfully");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdate = async (id, field, oldValue) => {
    const newValue = window.prompt(`Enter new ${field}`, oldValue);
    if (!newValue || newValue === oldValue) return;

    try {
      await fileSetService.update(id, field, newValue);
      setFileSets((prev) =>
        prev.map((s) => (s.id === id ? { ...s, [field]: newValue } : s)),
      );
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loader" />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="filesets-container">
      <h2>My Created FileSets</h2>
      <table className="filesets-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fileSets.map((set) => (
            <tr key={set.id}>
              <td>{set.id}</td>
              <td
                onClick={() => handleUpdate(set.id, "name", set.name)}
                className="editable"
              >
                {set.name}
              </td>
              <td
                onClick={() =>
                  handleUpdate(set.id, "description", set.description)
                }
                className="editable"
              >
                {set.description}
              </td>
              <td
                onClick={() =>
                  handleUpdate(set.id, "recipientEmail", set.recipientEmail)
                }
                className="editable"
              >
                {set.recipientEmail}
              </td>
              <td className={`status-${set.status.toLowerCase()}`}>
                {set.status}
              </td>
              <td>
                <DeleteIcon
                  onClick={() => handleDelete(set.id)}
                  style={{
                    cursor: "pointer",
                    color: "red",
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FileSetsPage;
