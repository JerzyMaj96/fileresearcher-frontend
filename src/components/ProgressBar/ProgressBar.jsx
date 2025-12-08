import React from "react";

function ProgressBar({ percent, message, isError }) {
  const containerStyle = {
    height: "20px",
    width: "100%",
    backgroundColor: "#e0e0de",
    borderRadius: "50px",
    margin: "10px 0",
    overflow: "hidden",
  };

  const fillerStyle = {
    height: "100%",
    width: `${Math.max(0, percent || 0)}%`,
    backgroundColor: isError
      ? "#ff4d4f"
      : percent >= 100
      ? "#4caf50"
      : "#2196f3",
    borderRadius: "inherit",
    textAlign: "right",
    transition: "width 0.5s ease-in-out",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  };

  const labelStyle = {
    padding: "5px",
    color: "white",
    fontWeight: "bold",
    fontSize: "12px",
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <div style={containerStyle}>
        <div style={fillerStyle}>
          <span style={labelStyle}>{`${percent}%`}</span>
        </div>
      </div>
      <p style={{ fontSize: "14px", color: "#666" }}>{message}</p>
    </div>
  );
}

export default ProgressBar;
