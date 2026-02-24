document.addEventListener("DOMContentLoaded", () => {
  const btSend = document.getElementById("btSend");

  // Kiểm tra xem Notyf đã được tải chưa
  const notyf =
    typeof Notyf !== "undefined"
      ? new Notyf({
          duration: 4000,
          position: {
            x: "right",
            y: "top",
          },
        })
      : null;

  if (btSend) {
    btSend.addEventListener("click", async (e) => {
      e.preventDefault();

      // Lấy giá trị từ các trường input
      const userName = document.getElementById("txtUserName")?.value.trim();
      const phone = document.getElementById("txtPhone")?.value.trim();
      const email = document.getElementById("txtEmail")?.value.trim();
      const time = document.getElementById("txtTime")?.value.trim();
      const brief = document.getElementById("txtBrief")?.value.trim();

      // Kiểm tra các trường bắt buộc
      if (!userName || !phone || !email || !time) {
        if (notyf) {
          notyf.error("Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
        } else if (typeof Swal !== "undefined") {
          Swal.fire(
            "Lỗi",
            "Vui lòng điền đầy đủ các thông tin bắt buộc (*)",
            "error",
          );
        } else {
          alert("Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
        }
        return;
      }

      // Đối tượng dữ liệu gửi đi (Mapping chính xác theo API Swagger)
      const formData = {
        fullName: userName,
        phone: phone,
        email: email,
        timeYouNeed: time,
        briefYouNeed: brief,
        status: "NEW",
        extField1: "",
        extField2: "",
        extField3: "",
        extField4: "",
        extField5: "",
        generalNote: "",
        createdBy: 0,
        domainId: 0,
      };

      try {
        // Hiệu ứng đang gửi
        btSend.disabled = true;
        const originalValue = btSend.value;
        btSend.value = "Đang gửi...";

        // GỬI API DÙNG AXIOS
        const response = await axios.post(
          "http://macaron.a.csoftlife.com/api/v1/PartnerConsult",
          formData,
        );

        if (response.status === 200 || response.status === 201) {
          if (notyf) {
            notyf.success(
              "Gửi thông tin thành công! Chúng tôi sẽ liên hệ lại sau.",
            );
          } else if (typeof Swal !== "undefined") {
            Swal.fire(
              "Thành công",
              "Gửi thông tin thành công! Chúng tôi sẽ liên hệ lại sau.",
              "success",
            );
          } else {
            alert("Gửi thông tin thành công!");
          }

          // Reset form sau khi gửi thành công
          document.getElementById("txtUserName").value = "";
          document.getElementById("txtPhone").value = "";
          document.getElementById("txtEmail").value = "";
          document.getElementById("txtTime").value = "";
          if (document.getElementById("txtBrief")) {
            document.getElementById("txtBrief").value = "";
          }
        } else {
          throw new Error("Server responded with an error");
        }
      } catch (error) {
        console.error("Lỗi khi gửi form liên hệ:", error);
        if (notyf) {
          notyf.error(
            "Không thể gửi thông tin. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.",
          );
        } else if (typeof Swal !== "undefined") {
          Swal.fire(
            "Lỗi",
            "Không thể gửi thông tin. Vui lòng thử lại sau.",
            "error",
          );
        } else {
          alert("Có lỗi xảy ra, không thể gửi thông tin.");
        }
      } finally {
        // Khôi phục trạng thái nút
        btSend.disabled = false;
        btSend.value = "Gửi";
      }
    });
  }
});
