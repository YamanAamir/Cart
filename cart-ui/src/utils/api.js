// src/api/api.js

// const BASE_URL = "http://localhost:5000/api";

const BASE_URL = "https://api.clubpromfg.com/api";


/**
 * Generic request helper
 */
async function request(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "API request failed");
  }

  return response.json();
}

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options }),
  post: (endpoint, body, options = {}) =>
    request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      ...options, // ✅ merge options so headers can be sent
    }),
  put: (endpoint, body, options = {}) =>
    request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    }),
  delete: (endpoint, options = {}) =>
    request(endpoint, {
      method: "DELETE",
      ...options,
    }),
};

