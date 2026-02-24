document.addEventListener("DOMContentLoaded", () => {
  const btSend = document.getElementById("btSend");

  // Khởi tạo Notyf nếu có
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

      // Lấy giá trị từ các trường input (lien-he.html)
      const userName = document.getElementById("txtUserName")?.value.trim();
      const email = document.getElementById("txtEmail")?.value.trim();
      const message = document.getElementById("txtMessage")?.value.trim();

      // Kiểm tra các trường bắt buộc
      if (!userName || !email) {
        const errorMsg = "Vui lòng điền đầy đủ các thông tin bắt buộc (*)";
        if (notyf) notyf.error(errorMsg);
        else alert(errorMsg);
        return;
      }

      // Mapping dữ liệu theo API PartnerContact
      const formData = {
        fullName: userName,
        email: email,
        message: message,
        extField1: "",
        extField2: "",
        extField3: "",
        extField4: "",
        extField5: "",
        generalNote: "Gửi từ trang Liên hệ",
        createdBy: 0,
        domainId: 0,
      };

      console.log("----- DỮ LIỆU GỬI ĐI (lien-he.html) -----");
      console.log(formData);

      try {
        btSend.disabled = true;
        btSend.value = "Đang gửi...";

        // GỬI API DÙNG AXIOS
        const response = await axios.post(
          "http://macaron.a.csoftlife.com/api/v1/PartnerContact",
          formData,
        );

        if (response.status === 200 || response.status === 201) {
          if (notyf) {
            notyf.success(
              "Gửi lời nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất.",
            );
          } else {
            alert("Gửi lời nhắn thành công!");
          }

          // Reset form
          document.getElementById("txtUserName").value = "";
          document.getElementById("txtEmail").value = "";
          document.getElementById("txtMessage").value = "";
        } else {
          throw new Error("Server error: " + response.status);
        }
      } catch (error) {
        console.error("Lỗi khi gửi form liên hệ:", error);
        const errorMsg = "Không thể gửi tin nhắn. Vui lòng thử lại sau.";
        if (notyf) notyf.error(errorMsg);
        else alert(errorMsg);
      } finally {
        btSend.disabled = false;
        btSend.value = "Gửi";
      }
    });
  }
});
