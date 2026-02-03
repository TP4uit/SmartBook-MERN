import axios from 'axios';

// 1. Định nghĩa kiểu dữ liệu User & Shop
export interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  shop_info?: {
    shop_name: string;
    shop_address: string;
    shop_avatar: string;
  };
}

// 2. Cấu hình Axios
// Fix lỗi TypeScript environment
const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Interceptors (Tự động thêm Token & Logout khi hết hạn)
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        const token = parsed.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        const token = localStorage.getItem('token'); // Fallback cũ
        if (token) config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        localStorage.removeItem('userInfo'); // Xóa sạch session
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ================= ADMIN API =================
export const getAdminStats = async () => {
  const { data } = await api.get('/admin/stats');
  return data;
};

export const getUsers = async () => {
  const { data } = await api.get<UserData[]>('/admin/users');
  return data;
};

export const deleteUser = async (id: string) => {
  const { data } = await api.delete(`/admin/users/${id}`);
  return data;
};

export const getAdminShops = async () => {
  const { data } = await api.get<UserData[]>('/admin/shops');
  return data;
};

// ================= SELLER API =================
export const getSellerOrders = async () => {
  const { data } = await api.get('/orders/seller/orders');
  return data;
};

// ================= USER & ORDER API =================
export const getMyOrders = async () => {
  const { data } = await api.get('/orders/myorders');
  return data;
};

export const createOrder = async (orderData: any) => {
  const { data } = await api.post('/orders', orderData);
  return data;
};

export const getOrderById = async (id: string) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};