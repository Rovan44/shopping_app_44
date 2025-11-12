import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const dashboardApi = {
  getStats: () => api.get('/dashboard'),
};

export const productApi = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (product) => api.post('/products', product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`),
  reduceStock: (id, quantity) => api.patch(`/products/${id}/reduce-stock`, { quantity }),
};

export const categoryApi = {
  getAll: () => api.get('/categories'),
};

export const paymentModeApi = {
  getAll: () => api.get('/payment-modes'),
  getActive: () => api.get('/payment-modes/active'),
  getById: (id) => api.get(`/payment-modes/${id}`),
  create: (paymentMode) => api.post('/payment-modes', paymentMode),
  update: (id, paymentMode) => api.put(`/payment-modes/${id}`, paymentMode),
  toggleActive: (id) => api.patch(`/payment-modes/${id}/toggle-active`),
  delete: (id) => api.delete(`/payment-modes/${id}`),
};

export const paymentApi = {
  getAll: () => api.get('/payments'),
  getById: (id) => api.get(`/payments/${id}`),
  getByTransactionId: (transactionId) => api.get(`/payments/transaction/${transactionId}`),
  getByStatus: (status) => api.get(`/payments/status/${status}`),
  getTotalCompleted: () => api.get('/payments/total/completed'),
  getCountByStatus: (status) => api.get(`/payments/count/status/${status}`),
  create: (payment) => api.post('/payments', payment),
  updateStatus: (id, status) => api.patch(`/payments/${id}/status`, { status }),
  delete: (id) => api.delete(`/payments/${id}`),
};

export default api;
