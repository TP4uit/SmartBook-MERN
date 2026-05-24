from fastapi import FastAPI
from pydantic import BaseModel
import tensorflow as tf
import pickle
import numpy as np

app = FastAPI(title="SmartBook AI Microservice")

# 1. Load Model và Dictionary Mapping
print("Đang tải Models và Mappings...")
cf_model = tf.keras.models.load_model('cf_model.h5', compile=False)
with open('cb_model.pkl', 'rb') as f:
    cb_model = pickle.load(f)
with open('mappings.pkl', 'rb') as f:
    mappings = pickle.load(f)

# Tạo dict ngược để tra cứu từ Book_Code (0, 1, 2...) ra ISBN thật của sách
reverse_book_mapping = {v: k for k, v in mappings['book'].items()}
all_book_codes = np.array(list(reverse_book_mapping.keys()))

# 2. Định nghĩa cấu trúc request từ Node.js gửi sang
class RecommendRequest(BaseModel):
    user_id: str
    age: float = 22.0
    location: str = "vietnam"
    alpha: float = 0.5  # Trọng số Hybrid: 50% CF, 50% CB

# 3. Endpoint Gợi ý sách
@app.post("/api/recommend")
def recommend_books(req: RecommendRequest):
    user_code = mappings['user'].get(req.user_id)
    
    if user_code is None:
        # --- COLD START (User Mới) ---
        # Theo bài báo, ta dùng Content-Based cho Cold Start.
        # Ở đây ta lấy top 10 sách mặc định để xử lý giao diện cho user mới tinh
        fallback_isbns = list(reverse_book_mapping.values())[:10]
        return {
            "status": 200,
            "type": "Cold Start",
            "recommended_isbns": fallback_isbns
        }
    else:
        # --- WARM START (User Cũ - Áp dụng Hybrid CF + CB) ---
        user_codes_array = np.array([user_code] * len(all_book_codes))
        
        # Điểm CF (Deep Learning Embedding)
        cf_scores = cf_model.predict([user_codes_array, all_book_codes], verbose=0).flatten()
        
        # Điểm CB (Logistic Regression) 
        loc_code = mappings['location'].get(req.location, 0)
        X_input = np.array([[req.age, loc_code]] * len(all_book_codes))
        cb_scores = cb_model.predict_proba(X_input)[:, 1]
        
        # Công thức tính điểm Hybrid
        hybrid_scores = (req.alpha * cf_scores) + ((1 - req.alpha) * cb_scores)
        
        # Lấy Top 10 ID sách (ISBN) có điểm Hybrid cao nhất
        top_10_indices = hybrid_scores.argsort()[-10:][::-1]
        recommended_isbns = [reverse_book_mapping[idx] for idx in top_10_indices]
        
        return {
            "status": 200,
            "type": "Hybrid CF+CB",
            "recommended_isbns": recommended_isbns
        }