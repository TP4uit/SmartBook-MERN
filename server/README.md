# SmartBook Server

## Seeder (Dữ liệu mẫu)

Chạy seeder để nạp Users, Books (có embedding), Orders:

```bash
cd server
npm run seed
```

**Yêu cầu:** `MONGO_URI` và `GEMINI_API_KEY` trong `.env`.

Sau khi chạy:
- 1 Admin: `admin@smartbook.vn` / `admin123`
- 2 Sellers: `fahasa@smartbook.vn` / `fahasa123`, `tiki@smartbook.vn` / `tiki123`
- 1 Customer: `khach@smartbook.vn` / `khach123`
- 10 sách mẫu (đã có `embedding_vector`)
- 2 đơn hàng mẫu

## Vector Search (MongoDB Atlas)

Tìm kiếm AI dùng `$vectorSearch`. Nếu dùng **MongoDB Atlas**, tạo Search Index:

1. Vào Atlas → Cluster → Search → Create Index.
2. JSON Editor, đặt tên index: `vector_index`.
3. Định nghĩa:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding_vector",
      "numDimensions": 768
    }
  ]
}
```

4. Chọn collection `books` (tên collection tương ứng model `Book`).

Nếu không tạo index (hoặc dùng MongoDB local), API sẽ tự fallback sang tìm kiếm regex theo title/description/author.
