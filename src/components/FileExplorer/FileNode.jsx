import React, { useState } from "react";
import {
  FaFolder,
  FaFolderOpen,
  FaFilePdf,
  FaFileWord,
  FaFileAlt,
  FaFileImage,
} from "react-icons/fa";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";

function FileNode({ node }) {
  const [expanded, setExpanded] = useState(false);
  const isDirectory = node.directory;

  const toggleExpand = () => {
    if (isDirectory) setExpanded(!expanded);
  };

  function getIcon(filename, isDirectory, expanded) {
    if (isDirectory) {
      return expanded ? (
        <FaFolderOpen color="#f4b400" />
      ) : (
        <FaFolder color="#f4b400" />
      );
    }
    const ext = filename.split(".").pop().toLowerCase();
    if (ext === "pdf") return <FaFilePdf color="#d32f2f" />;
    if (["doc", "docx"].includes(ext)) return <FaFileWord color="#1976d2" />;
    if (["jpg", "jpeg", "png"].includes(ext))
      return <FaFileImage color="#388e3c" />;
    return <FaFileAlt color="#616161" />;
  }

  function formatSize(bytes) {
    if (bytes == null) return "";
    if (bytes === 0) return "0 B";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, i);
    return `${value.toFixed(2)} ${sizes[i]}`;
  }

  return (
    <div className="file-node">
      <div
        className={`file-node-header ${expanded ? "expanded" : ""}`}
        onClick={toggleExpand}
      >
        {isDirectory ? (
          expanded ? (
            <IoIosArrowDown />
          ) : (
            <IoIosArrowForward />
          )
        ) : (
          <span style={{ width: "1em" }} />
        )}
        {getIcon(node.name, isDirectory, expanded)}
        <span className="file-name">{node.name}</span>
        <span className="file-meta">
          {isDirectory ? "Directory" : "File"}{" "}
          {!isDirectory && node.size != null
            ? `| ${formatSize(node.size)}`
            : ""}
        </span>
      </div>

      {expanded && isDirectory && (
        <div className="file-children">
          {node.children && node.children.length > 0 ? (
            node.children.map((child, index) => (
              <FileNode key={index} node={child} />
            ))
          ) : (
            <div className="empty-folder">📂 Empty folder</div>
          )}
        </div>
      )}
    </div>
  );
}

export default FileNode;
