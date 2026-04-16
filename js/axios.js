const api = axios.create({
    baseURL: 'http://aregister.csoftlife.com',
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
});


async function createRegister(data) {
    return api.post('/SoftwareRegisterApi/insert', data);
}

document.getElementById("contactForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = ["fullName", "phone", "email", "serviceSelect", "message"]
        .reduce((data, field) => {
            const element = document.getElementById(field);
            if (!element) {
                console.error(`Không tìm thấy phần tử có ID: ${field}`);
            } else {
                data[field] = element.value;
            }
            return data;
        }, {});

    formData.serviceSelect = document.getElementById("serviceSelect").value;

    const data = {
        ...formData,
        createdTime: new Date().toISOString(),
        flag: ""
    };

    // Hiển thị SweetAlert trước khi gửi request
    Swal.fire({
        title: "Đang gửi dữ liệu...",
        text: "Vui lòng chờ trong giây lát.",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: async () => {
            Swal.showLoading(); // Hiển thị hiệu ứng loading

            try {
                await createRegister(data);
                Swal.fire({
                    title: "Gửi thành công!",
                    text: "Cảm ơn bạn đã gửi liên hệ, chúng tôi sẽ liên hệ sớm.",
                    icon: "success",
                    confirmButtonText: "OK"
                }).then(() => {
                    document.getElementById("contactForm").reset(); // Reset form
                });
            } catch (error) {
                console.error("Lỗi:", error);
                Swal.fire({
                    title: "Gửi thất bại!",
                    text: "Có lỗi xảy ra khi gửi dữ liệu, vui lòng thử lại.",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            }
        }
    });
});

