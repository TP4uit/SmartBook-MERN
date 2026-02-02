import axios from 'axios';

// 1. Định nghĩa kiểu dữ liệu User (Cho AdminUsersScreen dùng)
export interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  shop_info?: {
    name: string;
    description: string;
  };
}

// 2. Cấu hình Axios
// FIX LỖI Ở ĐÂY: Dùng (import.meta as any) để TypeScript không bắt bẻ nữa
const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Interceptors (Quan trọng: Tự động logout khi token lỗi)
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo'); // Hoặc 'token' tùy cách bạn lưu
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        const token = parsed.token || localStorage.getItem('token'); // Fallback check
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        // Nếu userInfo không phải JSON, thử lấy trực tiếp token (dự phòng)
        const token = localStorage.getItem('token');
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
      // Chỉ redirect nếu không phải đang ở trang login/register
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        localStorage.removeItem('cartItems');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// --- CÁC HÀM API (HỢP NHẤT CŨ & MỚI) ---

// ================= ADMIN (MỚI THÊM) =================
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

export const createUser = async (userData: any) => {
  const { data } = await api.post('/admin/users', userData);
  return data;
};

export const updateUser = async (id: string, userData: any) => {
  const { data } = await api.put(`/admin/users/${id}`, userData);
  return data;
};

// ================= SELLER & ORDER (GIỮ NGUYÊN TỪ CODE CŨ) =================
export function getSellerOrders() {
  return api.get('/orders/seller/orders');
}

// Wrapper cho Dashboard Stats
export function getDashboardStats() {
  return api.get('/admin/stats'); 
}

export function getMyOrders() {
  return api.get('/orders/myorders');
}

export function createOrder(orderData: any) {
  return api.post('/orders', orderData);
}