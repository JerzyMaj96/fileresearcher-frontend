import React, { useState } from "react";
import {
  FaFolder,
  FaFolderOpen,
  FaFilePdf,
  FaFileWord,
  FaFileAlt,
  FaFileImage,
} from "react-icons/fa";
import { formatSize } from "../../components/utils";

function FileNode({ node, toggleSelect, selectedPaths }) {
  const [expanded, setExpanded] = useState(false);
  const isDirectory = node.directory;

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const getIcon = (filename, isDirectory, expanded) => {
    if (isDirectory) {
      return expanded ? (
        <FaFolderOpen color="orange" />
      ) : (
        <FaFolder color="orange" />
      );
    }
    const ext = filename.split(".").pop().toLowerCase();
    if (ext === "pdf") return <FaFilePdf color="red" />;
    if (["doc", "docx"].includes(ext)) return <FaFileWord color="blue" />;
    if (["jpg", "jpeg", "png"].includes(ext))
      return <FaFileImage color="green" />;
    return <FaFileAlt color="gray" />;
  };

  const calculateDirectorySize = (node) => {
    if (!node.directory) {
      return node.size || 0;
    }
    if (!node.children) return 0;

    return node.children.reduce(
      (total, child) => total + calculateDirectorySize(child),
      0,
    );
  };

  return (
    <div className="file-node">
      <div className="file-node-header">
        <input
          type="checkbox"
          checked={selectedPaths.includes(node.path)}
          onChange={() => toggleSelect(node)}
        />
        <span
          onClick={toggleExpand}
          style={{ cursor: isDirectory ? "pointer" : "default" }}
        >
          {getIcon(node.name, isDirectory, expanded)}
        </span>
        <span
          className="file-name"
          onClick={isDirectory ? toggleExpand : undefined}
        >
          {node.name}
        </span>
        <span className="file-meta">
          {isDirectory ? "Directory" : "File"}{" "}
          {node.size != null || isDirectory
            ? `| ${formatSize(
                isDirectory ? calculateDirectorySize(node) : node.size,
              )}`
            : ""}
        </span>
      </div>

      {expanded && isDirectory && (
        <div className="file-children">
          {node.children && node.children.length > 0 ? (
            node.children.map((child, index) => (
              <FileNode
                key={index}
                node={child}
                toggleSelect={toggleSelect}
                selectedPaths={selectedPaths}
              />
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
