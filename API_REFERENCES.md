# Tài liệu tham chiếu API Fetch

Tài liệu này liệt kê các vị trí trong source code sử dụng `fetch` để lấy dữ liệu JSON. Bạn có thể thay thế các đường dẫn file JSON tĩnh này bằng các API endpoint từ server của bạn.

## 1. Các file Javascript chính (JS)

| Tên File                     | Dòng | URL Hiện Tại (JSON Tĩnh)                   | Mục Đích                                                        |
| ---------------------------- | ---- | ------------------------------------------ | --------------------------------------------------------------- |
| `js/article-detail.js`       | 15   | `../JSON/article-detail.json`              | Lấy chi tiết bài viết (blog/tin tức).                           |
| `js/birthday-cake.js`        | 3    | `../JSON/products-category.json`           | Lấy danh sách sản phẩm danh mục Bánh sinh nhật.                 |
| `js/cart-page.js`            | 189  | `https://api.yourdomain.com/orders`        | Gửi đơn hàng (POST). Đây là ví dụ API endpoint.                 |
| `js/combo-gift.js`           | 3    | `../JSON/products-category.json`           | Lấy danh sách sản phẩm Combo quà tặng.                          |
| `js/contact.js`              | 3    | `../JSON/contact.json`                     | Lấy thông tin liên hệ.                                          |
| `js/doi-ngon-ngu.js`         | 34   | `${CONFIG.langDir}${lang}.json`            | Lấy file ngôn ngữ (đa ngôn ngữ).                                |
| `js/fatcaron.js`             | 3    | `../JSON/products-category.json`           | Lấy danh sách sản phẩm Fatcaron.                                |
| `js/job-detail.js`           | 15   | `../JSON/jobs-detail.json`                 | Lấy chi tiết công việc tuyển dụng.                              |
| `js/jobs-list.js`            | 3    | `../JSON/jobs.json`                        | Lấy danh sách các công việc tuyển dụng.                         |
| `js/load-set-dac-biet.js`    | 3    | `../JSON/sets.json`                        | Lấy danh sách các Set đặc biệt.                                 |
| `js/macaron-menu.js`         | 3    | `JSON/menu-element.json`                   | Lấy dữ liệu menu hiển thị (có thể là menu chính hoặc sub-menu). |
| `js/macaron-truyen-thong.js` | 3    | `../JSON/products-category.json`           | Lấy danh sách sản phẩm Macaron truyền thống.                    |
| `js/news-list.js`            | 3    | `../JSON/tin-tuc.json`                     | Lấy danh sách tin tức.                                          |
| `js/product-detail.js`       | 99   | `../JSON/products-detail.json`             | Lấy chi tiết sản phẩm.                                          |
| `js/product-detail.js`       | 114  | `../JSON/products-category.json`           | Lấy danh mục sản phẩm (hoặc sản phẩm liên quan).                |
| `js/set-dip-dac-biet.js`     | 6    | `../JSON/products-category.json`           | Lấy sản phẩm cho Set dịp đặc biệt.                              |
| `js/slider-loader.js`        | 2    | `JSON/slider.json`                         | Lấy dữ liệu ảnh và nội dung cho Slider trang chủ.               |
| `js/workshop-detail.js`      | 8    | `../JSON/workshop-detail.json`             | Lấy chi tiết Workshop.                                          |
| `js/workshops-list.js`       | 3    | `../JSON/workshops.json`                   | Lấy danh sách các Workshop.                                     |
| `js/header-loader.js`        | 9    | `../json/menu.json` hoặc `/json/menu.json` | Lấy dữ liệu Menu điều hướng chính (Header).                     |

## 2. Lưu ý khi thay thế API

Khi thay thế các file JSON bằng API thực tế, bạn cần lưu ý:

1.  **Cấu trúc dữ liệu (Response Structure)**: API server trả về phải khớp với cấu trúc JSON hiện tại mà frontend đang mong đợi (ví dụ: tên các trường `id`, `name`, `price`, `image`, v.v.). Nếu API trả về khác, bạn cần sửa code JS để map lại dữ liệu.
2.  **Đường dẫn (Path)**:
    - Các file trong `js/` có thể sử dụng đường dẫn tương đối (`../`) tùy thuộc vào trang HTML đang gọi nó.
    - Khi dùng API, bạn nên dùng đường dẫn tuyệt đối (ví dụ: `https://api.domain.com/v1/products`) hoặc đường dẫn tương đối từ root domain (ví dụ: `/api/v1/products`).
3.  **Phương thức (Method)**: Mặc định `fetch(url)` là `GET`. Nếu cần `POST`, `PUT`, `DELETE` (ví dụ trong giỏ hàng hoặc đăng ký), bạn cần thêm option object vào hàm `fetch`.

## 3. Ví dụ Code thay thế

**Code cũ (dùng JSON file):**

```javascript
const res = await fetch("../JSON/products-category.json");
const data = await res.json();
renderProducts(data);
```

**Code mới (dùng API):**

```javascript
// Ví dụ API trả về danh sách sản phẩm macaron
const res = await fetch("https://api.myshop.com/products?category=macaron");
if (!res.ok) throw new Error("API Error");
const data = await res.json();
// Nếu data từ API không khớp format cũ, cần map lại:
// const products = data.map(item => ({ ... }))
renderProducts(data);





Cách 1: Gỡ bỏ hoàn toàn (Khuyên dùng)
Đây là cách sạch nhất. Bạn chỉ cần thực hiện 2 bước:

Xóa file: Xóa file
js/api-auth.js
 khỏi thư mục dự án.
Gỡ liên kết trong HTML: Tìm và xóa dòng <script src=".../js/api-auth.js"></script> trong tất cả các file HTML (
index.html
,
menu.html
,
lien-he.html
,
gioi-thieu.html
).
Khi không còn script này, Axios sẽ chạy như bình thường mà không đính kèm bất kỳ Header Authorization nào vào request.

Cách 2: Vô hiệu hóa nhanh (Tạm thời)
Nếu bạn không muốn sửa nhiều file HTML, bạn có thể chỉ cần vào file
js/api-auth.js
 và comment (vô hiệu hóa) phần thiết lập interceptor.

Bạn chỉ cần comment đoạn code từ dòng axios.interceptors.request.use trở đi:

javascript
/* Comment đoạn này lại
axios.interceptors.request.use(async (config) => {
    ...
});
axios.interceptors.response.use(
    ...
);
*/
Một số lưu ý quan trọng:
Không cần sửa code gọi API: Trong các file như
macaron-menu-loader.js
, bạn không cần phải sửa bất cứ thứ gì. Vì chúng ta dùng Axios Interceptor, nên việc có token hay không là do file
api-auth.js
 quyết định, logic gọi dữ liệu vẫn giữ nguyên.
Hiệu năng: Việc gỡ bỏ file
api-auth.js
 (Cách 1) sẽ giúp trang web tải nhanh hơn một chút vì không phải thực hiện thêm một request đăng nhập chạy ngầm mỗi khi người dùng truy cập.
Lời khuyên: Khi API đã ổn định và không cần bảo mật bằng token cho các tác vụ xem dữ liệu (Public API), bạn nên dùng Cách 1 để code của dự án trở nên nhẹ nhàng và chuyên nghiệp hơn.

```
