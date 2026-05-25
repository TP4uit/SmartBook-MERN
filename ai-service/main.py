from fastapi import FastAPI
from pydantic import BaseModel
import tensorflow as tf
import pickle
import numpy as np
import pandas as pd  # Import thêm thư viện này để xử lý lỗi Scikit-Learn
import traceback

app = FastAPI(title="SmartBook AI Microservice")

print("Đang tải Models và Mappings...")
cf_model = tf.keras.models.load_model('cf_model.h5', compile=False)
with open('cb_model.pkl', 'rb') as f:
    cb_model = pickle.load(f)
with open('mappings.pkl', 'rb') as f:
    mappings = pickle.load(f)

# FIX 1: Ép kiểu tất cả các KEY về integer nguyên thủy để tránh KeyError của Numpy
reverse_book_mapping = {int(k): v for k, v in mappings['book'].items()}
all_book_codes = np.array(list(reverse_book_mapping.keys()))

# FIX 2: Đảo ngược Dictionary Location (Vì mappings gốc thường lưu dạng 0: "vietnam", ta cần "vietnam": 0 để tra cứu)
location_to_code = {str(v).lower(): int(k) for k, v in mappings['location'].items()}

class RecommendRequest(BaseModel):
    user_id: str
    age: float = 22.0
    location: str = "vietnam"
    alpha: float = 0.5 

@app.post("/api/recommend")
def recommend_books(req: RecommendRequest):
    try:
        user_code = mappings['user'].get(req.user_id)
        
        # --- Tính điểm CB (Dùng chung) ---
        loc_str = req.location.lower() if req.location else "vietnam"
        loc_code = location_to_code.get(loc_str, 0) # Mặc định là 0 nếu không tìm thấy
        
        # FIX 3: Dùng Pandas DataFrame và đặt tên cột chuẩn xác thay vì Numpy Array trơn
        # Lưu ý: Nếu lúc Train bạn đặt tên cột là chữ thường (age, location), hãy sửa lại 'Age', 'Location' bên dưới.
        X_input = pd.DataFrame(
            [[req.age, loc_code]] * len(all_book_codes), 
            columns=['Age', 'Location_Code'] # Đã sửa đúng chuẩn lúc train
        )
        
        cb_scores = cb_model.predict_proba(X_input)[:, 1]
        
        if user_code is None:
            # --- COLD START (User Mới) ---
            top_10_indices = cb_scores.argsort()[-10:][::-1]
            
            # Ép kiểu int(all_book_codes[idx]) để xử lý an toàn
            recommended_isbns = [reverse_book_mapping[int(all_book_codes[idx])] for idx in top_10_indices]
            
            return {
                "status": 200,
                "type": "Cold Start (Content-Based)",
                "recommended_isbns": recommended_isbns
            }
        else:
            # --- WARM START (User Cũ - Hybrid CF+CB) ---
            user_codes_array = np.array([user_code] * len(all_book_codes))
            
            cf_scores = cf_model.predict([user_codes_array, all_book_codes], verbose=0).flatten()
            hybrid_scores = (req.alpha * cf_scores) + ((1 - req.alpha) * cb_scores)
            
            top_10_indices = hybrid_scores.argsort()[-10:][::-1]
            recommended_isbns = [reverse_book_mapping[int(all_book_codes[idx])] for idx in top_10_indices]
            
            return {
                "status": 200,
                "type": "Hybrid CF+CB",
                "recommended_isbns": recommended_isbns
            }
            
    except Exception as e:
        # Bắt mọi lỗi và in đỏ ra Terminal của Python để ta bắt bệnh chính xác!
        print("====== LỖI TRONG QUÁ TRÌNH TÍNH TOÁN ======")
        traceback.print_exc()
        return {"status": 500, "error": str(e)}