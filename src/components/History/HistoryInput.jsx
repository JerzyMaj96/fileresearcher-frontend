import React from "react";

function HistoryInput({ zipArchiveId, onZipArchiveIdChange, onLoad }) {
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      onLoad();
    }
  }

  return (
    <div className="path-input-group">
      <input
        type="text"
        value={zipArchiveId}
        onChange={onZipArchiveIdChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter Zip archive ID)"
        className="path-input"
      />
      <button onClick={onLoad} className="scan-button">
        Load History
      </button>
    </div>
  );
}

export default HistoryInput;
