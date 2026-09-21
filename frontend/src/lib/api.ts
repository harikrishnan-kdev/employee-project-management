const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function fetchWrapper(endpoint: string, options: RequestInit = {}) {
  const url = `${baseURL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  
  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || 'API Error');
  }

  return { data };
}

const api = {
  get: (endpoint: string) => fetchWrapper(endpoint, { method: 'GET' }),
  post: (endpoint: string, body?: any) => fetchWrapper(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  patch: (endpoint: string, body?: any) => fetchWrapper(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint: string) => fetchWrapper(endpoint, { method: 'DELETE' }),
};

export default api;