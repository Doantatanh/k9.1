/* Tách fetch header ra file riêng */
document.addEventListener("DOMContentLoaded", async function () {
  const headerPath = window.location.pathname.includes("/macaron/")
    ? "../header.html"
    : "header.html";

  try {
    const response = await fetch(headerPath);
    const html = await response.text();

    const headerContainer = document.getElementById("header");
    if (headerContainer) headerContainer.innerHTML = html;

    // Báo hiệu rằng header đã load xong
    window.headerLoaded = true;
    document.dispatchEvent(new Event("header:loaded"));
  } catch (err) {
    console.error("Lỗi fetch header:", err);
  }
});
