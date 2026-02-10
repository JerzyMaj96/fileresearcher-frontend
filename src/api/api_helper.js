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
  let headers = {
    "Content-Type": "application/json",
  };

  const token = getAuthToken();

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return fetch(url, options);
};

export const baseUrl = import.meta.env.VITE_API_BASE_URL;
