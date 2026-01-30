import axios from 'axios';

// 1. Khởi tạo Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Đảm bảo Port 5000 trùng với server/app.js của bạn
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptor: Tự động gắn Token vào Header trước khi gửi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Lấy token từ LocalStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Interceptor: Xử lý lỗi trả về từ Server (Ví dụ: Token hết hạn)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Nếu lỗi 401 (Unauthorized), có thể logout user (tuỳ logic sau này)
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;