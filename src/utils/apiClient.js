/**
 * API Client for MongoDB backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getToken = () => {
  return localStorage.getItem('projectflow_token');
};

// Set auth token in localStorage
const setToken = (token) => {
  if (token) {
    localStorage.setItem('projectflow_token', token);
  } else {
    localStorage.removeItem('projectflow_token');
  }
};

/**
 * Generic API request helper
 */
async function apiRequest(endpoint, options = {}) {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        message: `HTTP error! status: ${response.status}` 
      }));
      throw new Error(error.error || error.message || 'Request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

/**
 * Authentication API
 */
export const authAPI = {
  // Sign up
  signup: async (name, email, password, role) => {
    const response = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
    
    if (response.success && response.token) {
      setToken(response.token);
    }
    
    return response;
  },

  // Login
  login: async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.token) {
      setToken(response.token);
    }
    
    return response;
  },

  // Get current user
  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },

  // Get all users
  getAllUsers: async () => {
    return apiRequest('/auth/users');
  },

  // Logout (just clears token)
  logout: () => {
    setToken(null);
  },
};

/**
 * Health check
 */
export const checkHealth = async () => {
  return apiRequest('/health');
};

export default {
  authAPI,
  checkHealth,
  getToken,
  setToken,
};

