/**
 * File này xử lý việc tải và hiển thị chi tiết tuyển dụng từ API
 */

async function loadJobDetail() {
  try {
    const config = window.API_CONFIG;
    if (!config) {
      console.error("API_CONFIG không tìm thấy!");
      return;
    }

    // Lấy ID từ URL (vd: job-detail.html?id=5)
    const params = new URLSearchParams(window.location.search);
    const jobId = params.get("id");

    const container = document.getElementById("job-detail");
    if (!container) return;

    if (!jobId) {
      container.innerHTML = "<div class='text-center py-5'><h3>Không tìm thấy ID tuyển dụng.</h3><p><a href='tuyen-dung.html'>Quay lại danh sách</a></p></div>";
      return;
    }

    const apiUrl = `${config.getUrl("JOBS_DETAIL")}/${jobId}`;

    const response = await axios.get(apiUrl);
    const result = response.data;

    // API Recruitment không trả về success: true/false trong một số trường hợp, 
    // nhưng ở request mẫu của user thì CÓ success: true.
    if (!result.data) {
      console.error("API không có dữ liệu tuyển dụng");
      container.innerHTML = "<div class='text-center py-5'><h3>Công việc không tồn tại hoặc đã hết hạn.</h3><p><a href='tuyen-dung.html'>Quay lại danh sách</a></p></div>";
      return;
    }

    const job = result.data;
    const image = config.getImgUrl(job.avatarUrl || "/images/resource/news-1.jpg");
    const deadline = job.deadline
      ? new Date(job.deadline).toLocaleDateString("vi-VN")
      : "Đang cập nhật";

    // Format lương (nếu là số thì thêm đ, nếu không thì giữ nguyên)
    const formattedSalary = (job.salary && !isNaN(job.salary))
      ? new Intl.NumberFormat('vi-VN').format(job.salary) + " đ"
      : (job.salary || "Thỏa thuận");

    container.innerHTML = `
      <div class="inner-box">
          <div class="upper-box" style="margin-bottom: 30px;">
              <h2 style="font-size: 32px; color: #333; margin-bottom: 15px; font-weight: bold;">${job.title || ""}</h2>
              <ul class="job-meta" style="display: flex; flex-wrap: wrap; list-style: none; padding: 0; color: #666; font-size: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                  <li style="margin-right: 25px; margin-bottom: 10px;"><span class="icon fa fa-map-marker" style="color: #d63384;"></span> <strong>Địa điểm:</strong> ${job.location || "Toàn quốc"}</li>
                  <li style="margin-right: 25px; margin-bottom: 10px;"><span class="icon fa fa-money" style="color: #d63384;"></span> <strong>Mức lương:</strong> <span style="color: #d63384; font-weight: bold;">${formattedSalary}</span></li>
                  <li style="margin-right: 25px; margin-bottom: 10px;"><span class="icon fa fa-clock-o" style="color: #d63384;"></span> <strong>Hình thức:</strong> ${job.jobType || "Full-time"}</li>
                  <li style="margin-right: 25px; margin-bottom: 10px;"><span class="icon fa fa-calendar-check-o" style="color: #d63384;"></span> <strong>Hạn nộp:</strong> ${deadline}</li>
              </ul>
          </div>

          ${job.avatarUrl ? `
          <div class="image-box" style="margin-bottom: 35px;">
              <figure class="image">
                  <img src="${image}" alt="${job.title}" style="width: 100%; border-radius: 12px; max-height: 450px; object-fit: cover; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
              </figure>
          </div>` : ""}

          <div class="lower-content">
              <div class="text">
                  <!-- Mô tả công việc (Dữ liệu HTML từ API) -->
                  ${job.jobDescription ? `
                  <div class="job-section mb-4" style="margin-top: 30px;">
                      <h3 style="font-size: 22px; color: #2a5caa; margin-bottom: 15px; font-weight: 700;">Mô tả công việc</h3>
                      <div style="line-height: 1.8; color: #444; font-size: 16px;">${job.jobDescription}</div>
                  </div>
                  ` : ""}

                  <!-- Yêu cầu công việc -->
                  ${job.jobRequirement ? `
                  <div class="job-section mb-4" style="margin-top: 30px;">
                      <h3 style="font-size: 22px; color: #2a5caa; margin-bottom: 15px; font-weight: 700;">Yêu cầu công việc</h3>
                      <div style="line-height: 1.8; color: #444; font-size: 16px;">${job.jobRequirement}</div>
                  </div>
                  ` : ""}

                  <!-- Quyền lợi -->
                  ${job.benefits ? `
                  <div class="job-section mb-4" style="margin-top: 30px;">
                      <h3 style="font-size: 22px; color: #2a5caa; margin-bottom: 15px; font-weight: 700;">Quyền lợi được hưởng</h3>
                      <div style="line-height: 1.8; color: #444; font-size: 16px;">${job.benefits}</div>
                  </div>
                  ` : ""}

                  <!-- Thông tin liên hệ -->
                  ${job.contactInfo ? `
                  <div class="contact-info-box" style="margin-top: 50px; padding: 30px; background: #fff5f5; border-radius: 15px; border: 2px dashed #ff4d4d; text-align: center;">
                      <h4 style="margin-bottom: 15px; color: #c53030; font-size: 24px; font-weight: bold;">Ứng tuyển ngay!</h4>
                      <p style="font-size: 18px; color: #555; margin-bottom: 5px;">Mọi chi tiết thắc mắc vui lòng liên hệ Zalo/SĐT:</p>
                      <p style="font-size: 18px; margin-bottom: 0;"><strong style="color: #c53030; font-size: 28px;">${job.contactInfo}</strong></p>
                      <p style="margin-top: 15px; font-style: italic; color: #777;">(Lưu ý: Ghi rõ vị trí ứng tuyển khi kết bạn)</p>
                  </div>
                  ` : ""}
              </div>
          </div>
          <div class="devider"><img src="../images/icons/icon-devider-gray.png" alt=""></div>
      </div>
    `;

    // Cập nhật SEO
    if (job.seoTitle) {
      document.title = job.seoTitle;
    } else {
      document.title = job.title + " | Tuyển Dụng La Rosette Macaron";
    }

  } catch (err) {
    console.error("Lỗi khi tải chi tiết tuyển dụng:", err);
    const container = document.getElementById("job-detail");
    if (container) {
      container.innerHTML = `<div class="alert alert-danger text-center py-5">Không thể tải nội dung tuyển dụng lúc này. Vui lòng thử lại sau.</div>`;
    }
  }
}

// Khởi chạy khi DOM sẵn sàng
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadJobDetail);
} else {
  loadJobDetail();
}
