function PathInput({ filter, files, onFileChange, onFilterChange, onScan }) {
  const handleFilterKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onScan();
    }
  };

  return (
    <div className="path-input-container">
      <div className="path-input-group">
        <input
          type="file"
          webkitdirectory=""
          directory=""
          onChange={onFileChange}
          className="path-input"
        />
        <button onClick={onScan} className="scan-button">
          Upload and Scan
        </button>
      </div>
      {files && (
        <div className="path-input-group">
          <input
            type="text"
            value={filter}
            onChange={onFilterChange}
            onKeyDown={handleFilterKeyDown}
            placeholder="Enter extension (e.g. , pdf, jpg)"
            className="path-input"
          />
          <button onClick={onScan} className="scan-button">
            Filter
          </button>
        </div>
      )}
    </div>
  );
}

export default PathInput;
