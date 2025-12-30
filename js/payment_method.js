const info = JSON.parse(localStorage.getItem("checkoutInfo") || "{}");

let paymentText = "";
document.getElementById("txtFullName").innerText = info.fullName;
document.getElementById("txtAddress").innerText = info.address;
document.getElementById("txtPhone").innerText = info.phone;
document.getElementById("txtTimeGet").innerText = info.timeGet;
document.getElementById("txtComment").innerText = info.comment;

if (info.paymentMethod === "1") {
  paymentText = "COD";
} else if (info.paymentMethod === "2") {
  paymentText = "TT";
}
document.getElementById("txtPaymentType").innerText = paymentText;
