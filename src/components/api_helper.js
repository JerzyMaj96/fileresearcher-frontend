export const getAuthToken = () => {
  return localStorage.getItem("jwtToken");
};

export const setAuthToken = (token) => {
  localStorage.setItem("jwtToken", token);
};

export const request = (method, url, body) => {
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
