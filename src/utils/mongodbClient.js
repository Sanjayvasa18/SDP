/**
 * MongoDB Client for frontend
 * This utility provides functions to interact with the backend MongoDB API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic API request helper
 */
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

/**
 * Health check - verify server and database connection
 */
export async function checkHealth() {
  return apiRequest('/health');
}

/**
 * Test MongoDB connection
 */
export async function testConnection() {
  return apiRequest('/test');
}

/**
 * Example: Get all items from a collection
 * Replace 'items' with your actual collection name
 */
export async function getItems(collection = 'items') {
  return apiRequest(`/${collection}`);
}

/**
 * Example: Get a single item by ID
 */
export async function getItemById(collection, id) {
  return apiRequest(`/${collection}/${id}`);
}

/**
 * Example: Create a new item
 */
export async function createItem(collection, data) {
  return apiRequest(`/${collection}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Example: Update an item
 */
export async function updateItem(collection, id, data) {
  return apiRequest(`/${collection}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Example: Delete an item
 */
export async function deleteItem(collection, id) {
  return apiRequest(`/${collection}/${id}`, {
    method: 'DELETE',
  });
}

export default {
  checkHealth,
  testConnection,
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};

