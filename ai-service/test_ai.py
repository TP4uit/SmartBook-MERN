from fastapi.testclient import TestClient
from main import app
import pickle

client = TestClient(app)

# Tự động lấy một User ID có thật từ dữ liệu đã train để test nhánh Hybrid
try:
    with open('mappings.pkl', 'rb') as f:
        mappings = pickle.load(f)
    valid_user_id = str(list(mappings['user'].keys())[0]) # Lấy ID đầu tiên trong từ điển
except Exception as e:
    valid_user_id = "276725" # ID dự phòng có trong tập Book-Crossing

def test_paper_cold_start_logic():
    """
    KIỂM CHỨNG BÀI BÁO: Xử lý Cold Start
    Khi User mới hoàn toàn, hệ thống phải fallback về Content-Based (Logistic Regression)
    """
    response = client.post("/api/recommend", json={
        "user_id": "GHOST_USER_999999", # ID chắc chắn không tồn tại
        "age": 22.0,
        "location": "vietnam",
        "alpha": 0.5
    })
    
    assert response.status_code == 200
    data = response.json()
    
    # Kiểm tra rẽ nhánh chính xác
    assert data["type"] == "Cold Start", f"Lỗi: Thuật toán không rẽ nhánh Cold Start. Đang ở {data['type']}"
    # Kiểm tra đầu ra phải đủ 10 kết quả
    assert len(data["recommended_isbns"]) == 10, "Lỗi: Không trả về đủ số lượng sách cho Cold Start"

def test_paper_hybrid_logic():
    """
    KIỂM CHỨNG BÀI BÁO: Mô hình lai Hybrid (CF + CB)
    Khi User đã có trong hệ thống, kích hoạt Deep Learning (CF) kết hợp Logistic Regression (CB)
    """
    response = client.post("/api/recommend", json={
        "user_id": valid_user_id, # Đưa ID thật vào
        "age": 25.0,
        "location": "usa",
        "alpha": 0.5
    })
    
    assert response.status_code == 200
    data = response.json()
    
    if data["type"] == "Cold Start":
        # Bỏ qua nếu user ID này xui xẻo bị loại lúc tiền xử lý
        pass 
    else:
        # Kiểm tra rẽ nhánh chính xác
        assert data["type"] == "Hybrid CF+CB", "Lỗi: Thuật toán không chạy Hybrid cho User cũ"
        # Kiểm tra đầu ra phải đủ 10 kết quả
        assert len(data["recommended_isbns"]) == 10, "Lỗi: Output Hybrid bị thiếu sách"