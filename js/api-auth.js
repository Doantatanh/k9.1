/**
 * File này xử lý việc tự động đăng nhập và quản lý Token cho các API
 */
(function () {
  // Lấy URL login từ cấu hình tập trung, nếu chưa có thì fallback
  const LOGIN_URL = window.API_CONFIG
    ? window.API_CONFIG.getUrl("LOGIN")
    : "http://macaron.a.csoftlife.com/api/v1/Auth/login";

  const CREDENTIALS = {
    userName: "admin",
    password: "123456",
  };

  /**
   * Hàm thực hiện đăng nhập để lấy token
   */
  async function performLogin() {
    try {
      console.log("Đang thực hiện đăng nhập tự động...");
      const res = await axios.post(LOGIN_URL, CREDENTIALS);

      console.log("Dữ liệu phản hồi từ API đăng nhập:", res.data);

      // Lấy token từ response (thử các trường phổ biến)
      const token =
        res.data.token ||
        res.data.data?.token ||
        res.data.accessToken ||
        res.data.data?.accessToken ||
        res.data.jwtToken ||
        res.data.data?.jwtToken;

      if (token) {
        localStorage.setItem("authToken", token);
        console.log("Đăng nhập thành công, đã lưu token.");
        return token;
      } else {
        console.error(
          "Không tìm thấy token trong phản hồi API đăng nhập. Vui lòng kiểm tra Console để xem cấu trúc dữ liệu trả về.",
        );
      }
    } catch (err) {
      console.error("Lỗi đăng nhập tự động:", err);
    }
    return null;
  }

  // Cấu hình Axios Interceptor cho Request
  axios.interceptors.request.use(
    async (config) => {
      // Không thêm token nếu là chính API login
      if (config.url === LOGIN_URL) return config;

      let token = localStorage.getItem("authToken");

      // Nếu chưa có token, thử đăng nhập luôn
      if (!token) {
        token = await performLogin();
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Cấu hình Axios Interceptor cho Response (xử lý khi token hết hạn - 401)
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Nếu lỗi 401 (Unauthorized) và chưa thử lại
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        console.log(
          "Token hết hạn hoặc không hợp lệ, đang thử đăng nhập lại...",
        );

        const newToken = await performLogin();

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest); // Thực hiện lại request ban đầu với token mới
        }
      }

      return Promise.reject(error);
    },
  );
})();
