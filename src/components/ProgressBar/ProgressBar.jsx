import React from "react";
import "./ProgressBar.css";

function ProgressBar({ percent, message, isError }) {
  const getBackgroundColor = () => {
    if (isError) return "#ff4d4f";
    if (percent >= 100) return "#4caf50";
    return "#2196f3";
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <div className="progress-container">
        <div
          className="progress-fill"
          style={{
            width: `${Math.max(0, percent || 0)}%`,
            backgroundColor: getBackgroundColor(),
          }}
        >
          <span className="progress-label">{`${percent}%`}</span>
        </div>
      </div>
      <p style={{ fontSize: "14px", color: "#666" }}>{message}</p>
    </div>
  );
}

export default ProgressBar;
