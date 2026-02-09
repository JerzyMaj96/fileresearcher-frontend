import React from "react";

function HistoryInput({
  zipArchiveId,
  onZipArchiveIdChange,
  onLoad,
  onGetLastRecipient,
  lastRecipient,
}) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onLoad();
    }
  }

  return (
    <div className="path-input-group">
      <div className="input-fields">
        <input
          type="text"
          value={zipArchiveId}
          onChange={onZipArchiveIdChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter Zip archive ID"
          className="path-input"
        />
        {zipArchiveId && (
          <input
            type="text"
            value={lastRecipient}
            readOnly
            placeholder="Last recipient will appear here"
            className="path-input"
          />
        )}
      </div>

      <div className="button-group">
        <button onClick={onLoad} className="scan-button">
          Load History
        </button>
        {zipArchiveId && (
          <button onClick={onGetLastRecipient} className="scan-button">
            Get the last recipient
          </button>
        )}
      </div>
    </div>
  );
}

export default HistoryInput;
