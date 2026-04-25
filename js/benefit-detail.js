/**
 * Logic xử lý hiển thị chi tiết lợi ích (Benefit Detail)
 * Lấy dữ liệu từ benefits.json dựa trên ID từ URL
 */

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const benefitId = urlParams.get('id');

    // Nếu không có ID, quay về trang chủ
    if (!benefitId) {
        window.location.href = 'index.html';
        return;
    }

    fetch('json/benefits.json')
        .then(res => res.json())
        .then(data => {
            const info = data[benefitId];
            
            // Nếu ID không tồn tại trong dữ liệu JSON
            if (!info) {
                window.location.href = 'index.html';
                return;
            }

            // 1. Đổ dữ liệu cơ bản
            document.title = info.title + " | Luminia IT";
            
            const elements = {
                'b-title': info.title,
                'd-title': info.title,
                'd-desc': info.description,
                'd-full-content': info.full_content
            };

            // Cập nhật text content an toàn
            for (const [id, value] of Object.entries(elements)) {
                const el = document.getElementById(id);
                if (el) el.innerText = value;
            }

            // Cập nhật Icon và Image
            const iconEl = document.getElementById('d-icon');
            if (iconEl) iconEl.className = info.icon;

            const imgEl = document.getElementById('d-image');
            if (imgEl) imgEl.src = info.image;

            // 2. Đổ danh sách Features
            const featureList = document.getElementById('d-features');
            if (featureList && info.features) {
                featureList.innerHTML = info.features.map(f => `
                    <li class="mb-3 d-flex align-items-start gap-3">
                        <i class="fa-solid fa-circle-check text-success mt-1"></i>
                        <span class="text-secondary">${f}</span>
                    </li>
                `).join('');
            }

            // 3. Đổ dữ liệu thống kê (Stats)
            const statsRow = document.getElementById('d-stats');
            if (statsRow && info.stats) {
                statsRow.innerHTML = Object.entries(info.stats).map(([key, value]) => `
                    <div class="col-4">
                        <div class="p-3 bg-white border rounded-4 text-center h-100 shadow-sm hover-up">
                            <div class="fw-bold fs-4 text-primary">${value}</div>
                            <div class="x-small text-uppercase text-muted fw-bold" style="font-size: 10px">
                                ${key.replace(/_/g, ' ')}
                            </div>
                        </div>
                    </div>
                `).join('');
            }

            // 4. GSAP Animation (Khởi tạo sau khi DOM đã được cập nhật dữ liệu)
            if (typeof gsap !== 'undefined') {
                gsap.from(".reveal", {
                    y: 30, 
                    opacity: 0, 
                    stagger: 0.1, 
                    duration: 1, 
                    ease: "power3.out"
                });
                
                gsap.from(".reveal-img", {
                    x: 50, 
                    opacity: 0, 
                    duration: 1.2, 
                    delay: 0.3, 
                    ease: "power3.out"
                });
            }
        })
        .catch(err => {
            console.error("Lỗi tải dữ liệu lợi ích:", err);
            // Có thể hiển thị thông báo lỗi nhẹ ở đây thay vì redirect
        });
});
