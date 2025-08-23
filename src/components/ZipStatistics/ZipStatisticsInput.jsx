import React, { useState } from "react";

function ZipStatisticsInput({ onRefresh, onFilterChange }) {
  const [filter, setFilter] = useState("");

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      onRefresh();
    }
  }

  function handleChange(e) {
    setFilter(e.target.value);
    if (onFilterChange) {
      onFilterChange(e.target.value);
    }
  }

  return (
    <div className="zip-stats-input-group">
      <input
        type="text"
        value={filter}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Filter by recipient or status..."
        className="zip-stats-input"
      />
      <button onClick={onRefresh} className="zip-stats-refresh">
        Refresh
      </button>
    </div>
  );
}

export default ZipStatisticsInput;
