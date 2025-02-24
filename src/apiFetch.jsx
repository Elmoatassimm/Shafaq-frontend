

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Default headers for all API calls
const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// A helper that wraps fetch and adds common headers
 const apiFetch = async (endpoint, { auth = true, ...options } = {}) => {
  const token = localStorage.getItem("jwtToken");
  const headers = {
    ...defaultHeaders,
    // Conditionally add the auth header if requested and a token exists
    ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  return response;
};

export default apiFetch;
