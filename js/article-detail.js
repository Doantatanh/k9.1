/**
 * File này xử lý việc tải và hiển thị chi tiết tin tức từ API
 */

async function loadArticleDetail() {
  try {
    const config = window.API_CONFIG;
    if (!config) {
      console.error("API_CONFIG không tìm thấy!");
      return;
    }

    // Lấy ID từ URL (vd: article.html?id=3)
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get("id");

    if (!articleId) {
      console.error("Không tìm thấy ID bài viết trong URL");
      return;
    }

    const apiUrl = `${config.getUrl("NEWS_DETAIL")}/${articleId}`;

    const response = await axios.get(apiUrl);
    const result = response.data;

    if (!result.success || !result.data) {
      console.error("API trả về lỗi hoặc không có dữ liệu bài viết");
      return;
    }

    const article = result.data;
    const container = document.getElementById("article-container");

    if (!container) return;

    const titleSize = "32px";
    const date = article.createdAt
      ? new Date(article.createdAt).toLocaleDateString("vi-VN")
      : "";
    const image = config.getImgUrl(article.presentationImage);

    container.innerHTML = `
      <div class="upper-box">
          <ul class="post-meta" style="display: flex; list-style: none; padding: 0; margin-bottom: 10px; color: #999; font-size: 14px;">
              <li style="margin-right: 20px;"><span class="icon fa fa-calendar"></span> ${date}</li>
              <li><span class="icon fa fa-user"></span> ${article.author || "La Rosette Macaron"}</li>
          </ul >
      <h2 style="font-size: ${titleSize}; color: #333; margin-bottom: 20px; font-weight: bold;">${article.title || ""}</h2>
      </div >

      ${image
        ? `
      <div class="image-box" style="margin-bottom: 30px;">
          <figure class="image">
              <img src="${image}" alt="${article.title}" style="width: 100%; border-radius: 8px;">
          </figure>
      </div>`
        : ""
      }

    <div class="lower-content">
      <div class="text">
        <div class="lead-text" style="font-weight: 500; font-size: 18px; line-height: 1.6; color: #555; margin-bottom: 25px;">
          ${article.lead || ""}
        </div>
        <div class="content-text" style="line-height: 1.8; color: #666; font-size: 16px;">
          ${article.detail || ""}
        </div>
      </div>
      <div class="devider"><img src="../images/icons/icon-devider-gray.png" alt=""></div>
    </div>
    `;

    // Cập nhật SEO nếu cần
    if (article.seoTitle) document.title = article.seoTitle;
  } catch (err) {
    console.error("Lỗi khi tải chi tiết bài viết:", err);
    const container = document.getElementById("article-container");
    if (container) {
      container.innerHTML = `< div class="alert alert-danger" > Không thể tải nội dung bài viết.Vui lòng thử lại sau.</div > `;
    }
  }
}

// Khởi chạy khi DOM đã sẵn sàng
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadArticleDetail);
} else {
  loadArticleDetail();
}
