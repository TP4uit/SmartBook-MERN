# 📚 SmartBook - MERN Stack E-commerce with AI Integration

## 📖 Giới thiệu

**SmartBook** là nền tảng thương mại điện tử chuyên về sách, được xây dựng trên MERN Stack (MongoDB, Express, React, Node.js). Điểm đặc biệt của dự án là việc tích hợp **Google Gemini AI** để nâng cao trải nghiệm người dùng thông qua Chatbot tư vấn và Hệ thống gợi ý sách thông minh.

Đồ án được thực hiện nhằm mục đích học tập và áp dụng các công nghệ web hiện đại.

## 🚀 Tính năng nổi bật

### 🤖 AI Powered (Sử dụng Google Gemini)
- **Chatbot thông minh:** Hỗ trợ giải đáp thắc mắc khách hàng ngay trên website.
- **Smart Search & Recommendation:** Tìm kiếm và gợi ý sách dựa trên ngữ nghĩa (Semantic Search) và phân tích nhu cầu người dùng.
- **Vector Embedding:** Sử dụng `text-embedding-004` để tối ưu hóa kết quả tìm kiếm.

### 🛒 E-commerce Features
- **Phân quyền người dùng:** - **Customer:** Mua hàng, giỏ hàng, lịch sử đơn hàng, profile cá nhân.
  - **Seller:** Dashboard quản lý, đăng bán sách, quản lý đơn hàng & tài chính.
  - **Admin:** Quản lý người dùng, duyệt shop, quản lý hệ thống.
- **Quản lý đơn hàng:** Quy trình Checkout, theo dõi trạng thái đơn hàng.
- **Giao diện hiện đại:** Responsive design, Dark/Light mode support (nền tảng Radix UI).

## 🛠️ Công nghệ sử dụng

### Client
- **Core:** React 18, TypeScript, Vite.
- **UI/Styling:** Tailwind CSS, Radix UI (Shadcn/ui ideas), Lucide React.
- **State/Routing:** React Router DOM v7, React Hook Form, Axios.

### Server
- **Runtime:** Node.js, Express.js.
- **Database:** MongoDB, Mongoose.
- **AI Integration:** @google/generative-ai.
- **Authentication:** JWT (JSON Web Tokens), Bcryptjs.
- **Upload:** Multer.

## ⚙️ Cài đặt và Chạy dự án

### Yêu cầu tiên quyết
- Node.js (v18 trở lên)
- MongoDB (Local hoặc Atlas)
- Google Gemini API Key

### 1. Clone dự án
```bash
git clone [https://github.com/tp4uit/smartbook-mern.git](https://github.com/tp4uit/smartbook-mern.git)
cd smartbook-mern

2. Cấu hình Backend (Server)
Bash
cd server
npm install
Tạo file .env trong thư mục server và điền các thông tin:

Đoạn mã
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
NODE_ENV=development
Chạy server:

Bash
npm run dev
3. Cấu hình Frontend (Client)
Mở một terminal mới:

Bash
cd client
npm install
npm run dev
Truy cập http://localhost:5173 để xem ứng dụng.

📂 Cấu trúc thư mục
smartbook-mern/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components & Screens
│   │   ├── services/       # API Calls (Axios)
│   │   └── ...
├── server/                 # Express Backend
│   ├── config/             # Database config
│   ├── controllers/        # Logic xử lý
│   ├── models/             # Mongoose Schemas
│   ├── routes/             # API Routes
│   └── utils/              # Helper functions (AI, Token...)
└── ...
