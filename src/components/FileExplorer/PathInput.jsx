import React from "react";

function PathInput({
  path,
  filter,
  files,
  onPathChange,
  onFilterChange,
  onScan,
  onFilterByExtension,
}) {
  function handlePathKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      onScan();
    }
  }

  function handleFilterKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      onScan();
    }
  }

  return (
    <div className="path-input-container">
      <div className="path-input-group">
        <input
          type="text"
          value={path}
          onChange={onPathChange}
          onKeyDown={handlePathKeyDown}
          placeholder="Enter path (e.g., C:/Users/...)"
          className="path-input"
        />
        <button onClick={onScan} className="scan-button">
          Scan
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
          <button onClick={onFilterByExtension} className="scan-button">
            Filter
          </button>
        </div>
      )}
    </div>
  );
}

export default PathInput;
