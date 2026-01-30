import axios from 'axios';

// 1. Tạo instance axios chuẩn
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Trỏ về Backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Tự động thêm Token vào mọi request (nếu có)
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Xử lý lỗi chung (Ví dụ: Hết hạn Token -> Auto Logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token hết hạn hoặc không hợp lệ -> Xóa và reload
      localStorage.removeItem('userInfo');
      // window.location.href = '/login'; // Có thể bật cái này nếu muốn đá ra trang login
    }
    return Promise.reject(error);
  }
);

export default api;