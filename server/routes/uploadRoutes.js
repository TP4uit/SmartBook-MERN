const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();

// Cấu hình nơi lưu trữ và tên file
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Lưu vào thư mục uploads ở root
  },
  filename(req, file, cb) {
    // Đặt tên file = tên gốc + ngày tháng + đuôi file (tránh trùng tên)
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Hàm kiểm tra định dạng file (chỉ cho phép ảnh)
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!'); // Chỉ chấp nhận file ảnh
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Route nhận file upload
// Frontend sẽ gọi POST /api/upload và gửi file qua key 'image'
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
      res.status(400);
      throw new Error('Chưa chọn file ảnh');
  }
  // Trả về đường dẫn ảnh để frontend lưu vào DB
  // Ví dụ: /uploads/image-123456.jpg
  res.send(`/${req.file.path.replace(/\\/g, '/')}`);
});

module.exports = router;