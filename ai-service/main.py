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
    
    # 1. Tính toán điểm Content-Based (CB) dựa trên Age và Location cho TẤT CẢ các trường hợp
    loc_code = mappings['location'].get(req.location, 0)
    X_input = np.array([[req.age, loc_code]] * len(all_book_codes))
    cb_scores = cb_model.predict_proba(X_input)[:, 1] # Điểm xác suất thích sách từ Logistic Regression
    
    if user_code is None:
        # --- COLD START (User Mới) ---
        # Bài báo sử dụng Linear/Logistic Regression dựa trên Age và Location cho Cold Start
        top_10_indices = cb_scores.argsort()[-10:][::-1]
        recommended_isbns = [reverse_book_mapping[idx] for idx in top_10_indices]
        
        return {
            "status": 200,
            "type": "Cold Start (Content-Based)",
            "recommended_isbns": recommended_isbns
        }
    else:
        # --- WARM START (User Cũ - Hybrid CF + CB) ---
        user_codes_array = np.array([user_code] * len(all_book_codes))
        
        # 2. Tính điểm Collaborative Filtering (CF) với Embedding + Biases
        cf_scores = cf_model.predict([user_codes_array, all_book_codes], verbose=0).flatten()
        
        # 3. Phương trình Hybrid của bài báo
        hybrid_scores = (req.alpha * cf_scores) + ((1 - req.alpha) * cb_scores)
        
        # Lấy Top 10 ID sách (ISBN)
        top_10_indices = hybrid_scores.argsort()[-10:][::-1]
        recommended_isbns = [reverse_book_mapping[idx] for idx in top_10_indices]
        
        return {
            "status": 200,
            "type": "Hybrid CF+CB",
            "recommended_isbns": recommended_isbns
        }