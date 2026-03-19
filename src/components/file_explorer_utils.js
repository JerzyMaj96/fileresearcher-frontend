// FileExplorer

export const getAllChildPaths = (node) => {
  let paths = [];
  if (node.directory && node.children?.length) {
    node.children.forEach((child) => {
      paths.push(child.path);
      if (child.directory) {
        paths = paths.concat(getAllChildPaths(child));
      }
    });
  }
  return paths;
};

// FileNode

export const formatSize = (bytes) => {
  if (bytes === 0) return "0 B";
  if (!bytes) return "0 B";

  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);

  return `${value.toFixed(2)} ${sizes[i]}`;
};

export const getIcon = (filename, isDirectory, expanded) => {
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

export const calculateDirectorySize = (node) => {
  if (!node.directory) {
    return node.size || 0;
  }
  if (!node.children) return 0;

  return node.children.reduce(
    (total, child) => total + calculateDirectorySize(child),
    0,
  );
};
