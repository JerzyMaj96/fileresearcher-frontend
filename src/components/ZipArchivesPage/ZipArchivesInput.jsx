import React from "react";

function ZipArchivesInput({ fileSetId, onFileSetIdChange, onLoad }) {
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
        value={fileSetId}
        onChange={onFileSetIdChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter File Set ID"
        className="path-input"
      />
      <button onClick={onLoad} className="scan-button">
        Load Zip Archives
      </button>
    </div>
  );
}

export default ZipArchivesInput;
