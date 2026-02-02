const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Lưu vào thư mục uploads ở root server
  },
  filename(req, file, cb) {
    // Đặt tên file: image-[timestamp].[ext]
    cb(null, `image-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Validate file type
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Route upload single image
router.post('/', upload.single('image'), (req, res) => {
  // Trả về đường dẫn tương đối (ví dụ: /uploads/image-123.jpg)
  res.send(`/${req.file.path.replace(/\\/g, '/')}`);
});

module.exports = router;