/**
 * File cấu hình tập trung cho toàn bộ API của hệ thống
 */
const API_CONFIG = {
  BASE_URL: "http://macaron.a.csoftlife.com",

  // Danh sách các link API
  ENDPOINTS: {
    LOGIN: "/api/v1/Auth/login",
    SLIDER: "/api/v1/PartnerImageSite",
    FOOTER: "/api/v1/PartnerStore",
    CATEGORY: "/api/v1/CoreCategory",
    PRODUCT_LIST: "/api/v1/CoreProduct/list",
    PRODUCT_DETAIL: "/api/v1/CoreProduct/detail",
    NEWS_LIST: "/api/v1/CmsArticle/list",
    NEWS_DETAIL: "/api/v1/CmsArticle",
    JOBS_LIST: "/api/v1/PartnerRecruitment/paged",
    JOBS_DETAIL: "/api/v1/PartnerRecruitment",
    ORDER: "/api/v1/CoreOrder",
  },

  // Tiền tố cho ảnh (nếu ảnh trả về dạng đường dẫn tương đối /products/...)
  IMAGE_BASE_URL: "http://macaron.a.csoftlife.com/data/upload",

  // Hàm helper để lấy URL đầy đủ
  getUrl(key) {
    return `${this.BASE_URL}${this.ENDPOINTS[key] || ""}`;
  },

  // Hàm helper để lấy URL ảnh đầy đủ
  getImgUrl(path) {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    // Bổ sung dấu / nếu thiếu
    const fullPath = path.startsWith("/") ? path : `/${path}`;
    return `${this.IMAGE_BASE_URL}${fullPath}`;
  },
};

// Đưa vào window để tất cả các file .js khác đều có thể đọc được
window.API_CONFIG = API_CONFIG;
