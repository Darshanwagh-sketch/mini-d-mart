const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

export const getToken = () => localStorage.getItem('minidmart_token');
export const setToken = (token) => localStorage.setItem('minidmart_token', token);
export const removeToken = () => localStorage.removeItem('minidmart_token');

export const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await fetch(`${API_BASE}${cleanEndpoint}`, {
    ...options,
    headers,
  });


  if (response.status === 401) {
    // Unauthorized
  }

  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errObj = await response.json();
      errorMsg = errObj.message || errObj.error || JSON.stringify(errObj);
    } catch (e) {
      errorMsg = response.statusText;
    }
    throw new Error(errorMsg);
  }

  if (response.status === 24 || response.status === 204) {
    return null;
  }

  return response.json();
};

export const api = {
  // Auth
  login: (data) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => apiFetch('/auth/me'),

  // Products & Stores
  getProducts: (categoryId, search) => {
    const params = new URLSearchParams();
    if (categoryId) params.append('categoryId', categoryId);
    if (search) params.append('search', search);
    return apiFetch(`/products?${params.toString()}`);
  },
  getCategories: () => apiFetch('/categories'),
  getStores: () => apiFetch('/stores'),

  // Cart
  getCart: () => apiFetch('/cart'),
  addToCart: (productId, quantity = 1) => apiFetch('/cart/add', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
  updateCartItem: (id, quantity) => apiFetch(`/cart/${id}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  removeCartItem: (id) => apiFetch(`/cart/${id}`, { method: 'DELETE' }),
  clearCart: () => apiFetch('/cart/clear', { method: 'DELETE' }),

  // Orders
  placeOrder: (data) => apiFetch('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getMyOrders: () => apiFetch('/orders/my-orders'),
  getOrderById: (id) => apiFetch(`/orders/${id}`),
  cancelOrder: (id) => apiFetch(`/orders/${id}/cancel`, { method: 'POST' }),

  // Returns
  createReturnRequest: (data) => apiFetch('/returns', { method: 'POST', body: JSON.stringify(data) }),
  getMyReturns: () => apiFetch('/returns/my-requests'),

  // Staff
  getStaffOrders: (status) => apiFetch(`/staff/orders${status ? '?status=' + status : ''}`),
  getOrderByPickupCode: (code) => apiFetch(`/staff/orders/pickup/${code}`),
  updateOrderStatus: (id, status, notes) => apiFetch(`/staff/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, notes }) }),
  getStaffReturns: (status) => apiFetch(`/staff/returns${status ? '?status=' + status : ''}`),
  processReturnRequest: (id, status, adminNotes) => apiFetch(`/staff/returns/${id}/process`, { method: 'PUT', body: JSON.stringify({ status, adminNotes }) }),

  // Admin
  getAdminDashboard: () => apiFetch('/admin/dashboard'),
  getAdminUsers: () => apiFetch('/admin/users'),
  updateUserRole: (id, role) => apiFetch(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  createProduct: (data) => apiFetch('/admin/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => apiFetch(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => apiFetch(`/admin/products/${id}`, { method: 'DELETE' }),
  getLowStockProducts: () => apiFetch('/admin/products/low-stock'),
  getAuditLogs: () => apiFetch('/admin/audit-logs'),
};
