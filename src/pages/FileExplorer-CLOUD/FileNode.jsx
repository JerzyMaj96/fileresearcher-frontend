import { useState } from "react";
import {
  formatSize,
  getIcon,
  calculateDirectorySize,
} from "../../components/file_explorer_utils";

function FileNode({ node, toggleSelect, selectedPaths }) {
  const [expanded, setExpanded] = useState(false);
  const isDirectory = node.directory;

  const toggleExpand = () => {
    setExpanded(!expanded);
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
