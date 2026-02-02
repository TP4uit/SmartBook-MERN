import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Giữ nguyên Interceptor cũ của bạn
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

// Giữ nguyên các hàm API cũ
export function getSellerOrders() {
  return api.get('/orders/seller/orders');
}
export function getAdminStats() {
  return api.get('/admin/stats');
}
export function getDashboardStats() {
  return api.get('/admin/dashboard');
}
export function getMyOrders() {
  return api.get('/orders/myorders');
}
export function createOrder(orderData: any) {
  return api.post('/orders', orderData);
}

export default api;