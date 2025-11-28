// src/api.js
const API_BASE = 'http://localhost:3000/api';

const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const api = {
  // Products
  products: {
    getAll: () => apiRequest('/products'),
    getById: (id) => apiRequest(`/products/${id}`),
    getBySupplier: (supplierId) => apiRequest(`/products/supplier/${supplierId}`),
    create: (data) => apiRequest('/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`/products/${id}`, { method: 'DELETE' }),
  },

  // Campaigns
  campaigns: {
    getAll: () => apiRequest('/campaigns'),
    getById: (id) => apiRequest(`/campaigns/${id}`),
    getBySupplier: (supplierId) => apiRequest(`/campaigns/supplier/${supplierId}`),
    create: (data) => apiRequest('/campaigns', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`/campaigns/${id}`, { method: 'DELETE' }),
  },

  // Orders
  orders: {
    getAll: () => apiRequest('/orders'),
    getById: (id) => apiRequest(`/orders/${id}`),
    create: (data) => apiRequest('/orders', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`/orders/${id}`, { method: 'DELETE' }),
  },

  // Stores
  stores: {
    getAll: () => apiRequest('/stores'),
    getById: (id) => apiRequest(`/stores/${id}`),
    create: (data) => apiRequest('/stores', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/stores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`/stores/${id}`, { method: 'DELETE' }),
  },

  // Suppliers
  suppliers: {
    getAll: () => apiRequest('/suppliers'),
    getById: (id) => apiRequest(`/suppliers/${id}`),
    create: (data) => apiRequest('/suppliers', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`/suppliers/${id}`, { method: 'DELETE' }),
  },

  // Users
  users: {
    getAll: () => apiRequest('/users'),
    getById: (id) => apiRequest(`/users/${id}`),
    create: (data) => apiRequest('/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`/users/${id}`, { method: 'DELETE' }),
  },
};