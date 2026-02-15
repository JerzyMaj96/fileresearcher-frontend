import { authFetch, baseUrl } from "./api_helper";

export const authService = {
  login: async (username, password) => {
    const response = await fetch(`${baseUrl}/file-researcher/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.text();
  },
  getCurrentUser: async () => {
    const response = await authFetch(
      "GET",
      `${baseUrl}/file-researcher/users/authentication`,
    );
    if (!response.ok) throw new Error("Failed to get user");
    return response.json();
  },
  register: async (userData) => {
    const response = await fetch(`${baseUrl}/file-researcher/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },
};

export const fileSetService = {
  getAll: async () => {
    const response = await authFetch(
      "GET",
      `${baseUrl}/file-researcher/file-sets`,
    );
    if (!response.ok) throw new Error("Failed to fetch file sets");
    return response.json();
  },
  delete: async (id) => {
    const response = await authFetch(
      "DELETE",
      `${baseUrl}/file-researcher/file-sets/${id}`,
    );
    if (!response.ok) throw new Error(await response.text());
  },
  update: async (id, field, value) => {
    const response = await authFetch(
      "PATCH",
      `${baseUrl}/file-researcher/file-sets/${id}/${field}?${field}=${value}`,
    );
    if (!response.ok) throw new Error(await response.text());
  },
  initiateSend: async (fileSetId, email, files) => {
    const formData = new FormData();
    formData.append("recipientEmail", email);
    files.forEach((file) => {
      formData.append("files", file);
    });
    const response = await authFetch(
      "POST",
      `${baseUrl}/file-researcher/file-sets/${fileSetId}/zip-archives/send-uploaded-files`,
      formData,
    );
    if (!response.ok) throw new Error(await response.text());
    return response.text();
  },
};

export const zipService = {
  getAll: async () => {
    const response = await authFetch(
      "GET",
      `${baseUrl}/file-researcher/zip-archives`,
    );
    if (!response.ok) throw new Error("Failed to fetch archives");
    return response.json();
  },
  getByFileSet: async (fileSetId) => {
    const response = await authFetch(
      "GET",
      `${baseUrl}/file-researcher/file-sets/${fileSetId}/zip-archives`,
    );
    if (!response.ok) throw new Error("Failed to fetch archives");
    return response.json();
  },
  getStats: async () => {
    const response = await authFetch(
      "GET",
      `${baseUrl}/file-researcher/zip-archives/stats`,
    );
    if (!response.ok) throw new Error("Failed to fetch stats");
    return response.json();
  },
  getLargeArchives: async (minSize) => {
    const response = await authFetch(
      "GET",
      `${baseUrl}/file-researcher/zip-archives/large?minSize=${minSize}`,
    );
    if (!response.ok) throw new Error("Failed to fetch large archives");
    return response.json();
  },
  getHistory: async (archiveId) => {
    const url = archiveId
      ? `${baseUrl}/file-researcher/zip-archives/${archiveId}/history`
      : `${baseUrl}/file-researcher/zip-archives/history`;
    const response = await authFetch("GET", url);
    if (!response.ok) throw new Error("Failed to fetch history");
    return response.json();
  },
  getLastRecipient: async (archiveId) => {
    const response = await authFetch(
      "GET",
      `${baseUrl}/file-researcher/zip-archives/${archiveId}/history/last-recipient`,
    );
    if (!response.ok) throw new Error("Failed to fetch recipient");
    return response.text();
  },
};
