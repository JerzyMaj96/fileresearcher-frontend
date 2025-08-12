import React from "react";

function PathInput({ path, onPathChange, onScan }) {
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      onScan();
    }
  }

  return (
    <div className="path-input-group">
      <input
        type="text"
        value={path}
        onChange={onPathChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter path (e.g., C:/Users/...)"
        className="path-input"
      />
      <button onClick={onScan} className="scan-button">
        Scan
      </button>
    </div>
  );
}

export default PathInput;
