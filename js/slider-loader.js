async function updateSlider() {
  const res = await fetch("JSON/slider.json");
  const data = await res.json();

  data.slides.forEach((s) => {
    // đổi ảnh
    const img = document.getElementById(`bg-rs-${s.id}`);
    if (img) img.src = s.image;

    // đổi title
    const title = document.getElementById(`title-rs-${s.id}`);
    if (title) {
      title.textContent = s.title;

      // thêm link vào title
      if (s.link) {
        title.style.cursor = "pointer";
        title.onclick = () => {
          window.location.href = s.link;
        };
      }
    }
  });
}

updateSlider();
