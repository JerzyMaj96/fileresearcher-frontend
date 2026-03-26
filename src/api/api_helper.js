export const getAuthToken = () => {
  return sessionStorage.getItem("jwtToken");
};

export const setAuthToken = (token) => {
  if (token) {
    sessionStorage.setItem("jwtToken", token);
  } else {
    sessionStorage.removeItem("jwtToken");
  }
};

export const authFetch = (method, url, body) => {
  const token = getAuthToken();
  const headers = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  const finalUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;
  return fetch(finalUrl, options);
};

export const baseUrl = import.meta.env.VITE_API_BASE_URL;
