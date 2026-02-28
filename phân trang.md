Hướng Dẫn Tổng Hợp: Cách Làm Phân Trang (Pagination) Kèm Giữ Trạng Thái (Fix Lỗi Nút Back)
Phân trang là kỹ thuật chia một danh sách dài thành nhiều phần nhỏ. Tuy nhiên, một bài toán khó mà người mới hay gặp là: Làm sao khi người dùng bấm vào xem 1 bài, rồi nhấn nút "Back" quay lại thì vẫn ở đúng cái trang họ đang xem (không bị văng về trang 1)?

Bí quyết chính là: Lưu số trang hiện tại lên thanh địa chỉ URL (ví dụ: ?page=2) thay vì chỉ lưu ngầm trong biến.

Dưới đây là công thức hoàn chỉnh kết hợp HTML, CSS và JavaScript (dựa trên file 

news-list.js
).

1. Thành phần HTML: Nơi chứa phần phân trang
Bạn cần một khu vực sẵn sàng trong file HTML.

html
<div class="row" id="news-list">
    <!-- Nơi render danh sách tin tức -->
</div>
<div class="pagination-wrapper">
    <button id="prev-page" class="nav-btn">←</button> <!-- Nút lùi lại -->
    <div id="pagination-numbers" class="page-numbers"></div> <!-- Nơi chứa số 1, 2, 3... -->
    <button id="next-page" class="nav-btn">→</button> <!-- Nút tiến lên -->
</div>
2. Thành phần API: Yêu cầu cần có
API phân trang cần hỗ trợ 2 tham số:

PageIndex: Số trang cần lấy.
PageSize: Số lượng bản ghi trên / 1 trang.
Khi gọi thành công, API sẽ trả về dữ liệu mẫu:

json
{
  "data": [ ... ], // Danh sách dữ liệu
  "pagination": {
    "totalPages": 3,   // Dữ liệu quan trọng nhất: Tổng số trang để ta vẽ nút bấm
    "totalRecords": 7  // Tổng số bản ghi thực tế
  }
}
3. Thành phần JavaScript: Bộ Não Điều Khiển (Giải thích từng Bước)
Bước A: Đọc số trang từ URL (Khởi tạo)
Thay vì mặc định cứng luôn luôn là trang 1: let currentPage = 1; => Chúng ta phải "nhìn" lên thanh địa chỉ để xem có chữ ?page=... nào không.

javascript
// Đọc tham số từ URL
const params = new URLSearchParams(window.location.search);
// Nếu trên URL có ?page=3 thì lấy số 3, nếu không có gì (mới vào) thì mặc định là 1
let currentPage = parseInt(params.get("page")) || 1; 
const limit = 10; // Cài đặt mỗi trang chứa 10 tin
Bước B: Cập nhật URL mà KHÔNG Load lại web (Hàm goToPage)
Đây là "vũ khí bí mật" xử lý lỗi nút Back. Khi khách bấm sang trang 2, URL biến đổi ngay lập tức thành ?page=2 nhưng web chớp nhoáng tải data chứ không tải lại toàn cục.

javascript
function goToPage(page) {
    currentPage = page; // Cập nhật biến số
    
    // Tạo link mới và đẩy lên trình duyệt (pushState)
    const newUrl = `${window.location.pathname}?page=${page}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    
    // Gọi hàm fetch data & cuộn màn hình lên đẹp mắt
    loadNewsList(page);
    window.scrollTo({ top: 300, behavior: "smooth" });
}
Bước C: Hàm Gọi API Chính (loadNewsList)
Làm nhiệm vụ: Tải dữ liệu -> Bơm code HTML bài viết -> Vẽ lại số phân trang (1,2,3... và Nút mũi tên).

javascript
async function loadNewsList(page = 1) {
    try {
        // Gửi request API (Nhớ viết hoa chữ PageIndex và PageSize nếu API yêu cầu)
        const apiUrl = `URL_CUA_BAN?PageIndex=${page}&PageSize=${limit}`;
        const response = await axios.get(apiUrl);
        const result = response.data;
        
        const newsList = result.data || [];
        
        // Cố gắng đọc ra "tổng số trang" do API cung cấp
        const totalPages = result.pagination ? result.pagination.totalPages : 1;
        // Vẽ bài viết ra giao diện
        renderNews(newsList);
        // Vẽ dãy số trang (Truyền tổng số trang vào)
        renderPaginationNumbers(totalPages);
        // Cập nhật trạng thái "Ẩn/Hiện" của nút mũi tên Trái - Phải
        updatePaginationControls(totalPages);
        
    } catch (error) { ... }
}
Bước D: Vẽ Số Trang & Bắt Sự Kiện
Tạo số lượng thẻ <button> tương ứng số trang. Nếu số nào đang trùng với biến currentPage thì làm nổi bật thẻ đó lên.

javascript
function renderPaginationNumbers(totalPages) {
    const container = document.getElementById("pagination-numbers");
    container.innerHTML = ""; // Xóa bộ nút cũ
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.innerText = i;
        btn.className = (i === currentPage) ? "active" : ""; // Nếu đúng trang -> Thêm class đổi màu
        
        // Khi bấm vào 1 số -> Chạy hàm siêu năng lực goToPage()
        btn.onclick = () => goToPage(i); 
        container.appendChild(btn);
    }
}
Bước E: Cập nhật Mũi Tên Trái, Phải
Tự tính logic để Khoá (disabled) các nút này:

Nếu đứng ở Trang 1 -> Tắt nút Trái (Vì không lùi được nữa).
Nếu đứng ở Trang Cuối -> Tắt nút Phải (Vì hết rồi).
javascript
function updatePaginationControls(totalPages) {
    const prevBtn = document.getElementById("prev-page");
    const nextBtn = document.getElementById("next-page");
    if (prevBtn) {
        prevBtn.disabled = (currentPage === 1);
        prevBtn.onclick = () => goToPage(currentPage - 1); // Lùi 1 trang
    }
    if (nextBtn) {
        nextBtn.disabled = (currentPage >= totalPages);
        nextBtn.onclick = () => goToPage(currentPage + 1); // Tiến 1 trang
    }
}