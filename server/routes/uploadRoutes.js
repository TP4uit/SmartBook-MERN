const path = require('path');
const express = require('express');
const multer = require('multer');

const router = express.Router();

// 1. Cấu hình nơi lưu trữ (Storage)
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Lưu vào thư mục uploads ở root server
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    // Đặt tên file duy nhất: fieldname + ngày tháng + đuôi file gốc
    // VD: image-1770061449442.jpg
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// 2. Bộ lọc file (Chỉ nhận ảnh)
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  // Check extension (đuôi file)
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (jpg, jpeg, png, webp)!'));
  }
}

// 3. Khởi tạo Middleware Multer
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// 4. Route xử lý Upload
// Frontend gửi POST /api/upload với key 'image'
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'Vui lòng chọn file ảnh' });
  }
  // Trả về đường dẫn để Frontend lưu vào DB
  // Chuyển đổi dấu \ thành / để tránh lỗi trên Windows
  res.send(`/${req.file.path.replace(/\\/g, '/')}`);
});

module.exports = router;