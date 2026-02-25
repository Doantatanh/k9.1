async function updateSlider() {
  try {
    const config = window.API_CONFIG;
    const apiUrl = config
      ? `${config.getUrl("SLIDER")}?pageIndex=1&pageSize=20`
      : "http://macaron.a.csoftlife.com/api/v1/PartnerImageSite?pageIndex=1&pageSize=20";

    const response = await axios.get(apiUrl);
    const result = response.data;

    if (!result.success) {
      console.error("API trả về lỗi hoặc không thành công");
      return;
    }

    const slidesData = (result.data || []).filter(
      (item) => item.type === "slider",
    );
    const sliderUl = document.querySelector("#rev_slider_one ul");

    if (!sliderUl) {
      console.error("Không tìm thấy element #rev_slider_one ul");
      return;
    }

    let html = "";
    slidesData.forEach((s, index) => {
      const imgPath = config
        ? config.getImgUrl(s.path)
        : `http://macaron.a.csoftlife.com${s.path}`;
      const title = s.imageSiteTitle || "";
      const link = s.link && s.link !== "#" ? s.link : "javascript:void(0)";

      html += `
            <li data-index="rs-${index + 1}" data-transition="zoomout" data-slotamount="default" data-hideafterloop="0"
              data-hideslideonmobile="off" data-easein="default" data-easeout="default" data-masterspeed="850"
              data-thumb="${imgPath}" data-delay="5999" data-rotate="0"
              data-saveperformance="off" data-title="Slide">
              
              <!-- MAIN IMAGE -->
              <img src="${imgPath}" alt="" title="${title}" data-bgposition="center center" data-bgfit="cover"
                data-bgrepeat="no-repeat" class="rev-slidebg" data-no-retina>

              <!-- LAYER OVERLAY -->
              <div class="tp-caption tp-shape tp-shapewrapper tp-resizeme" data-x="center"
                data-hoffset="" data-y="center" data-voffset="" data-width="['full','full','full','full']"
                data-height="['full','full','full','full']" data-type="shape" data-basealign="slide"
                data-responsive_offset="on"
                data-frames='[{"delay":10,"speed":300,"frame":"0","from":"opacity:0;","to":"o:1;","ease":"Power3.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;","ease":"Power3.easeInOut"}]'
                style="z-index: 5;background-color:rgba(80,81,92,0.55);">
              </div>

              <!-- LAYER TITLE -->
              <div class="tp-caption tp-resizeme" data-x="center" data-hoffset=""
                data-y="center" data-voffset="" data-width="['100%','100%','100%','100%']" data-height="['auto']" data-type="text"
                data-responsive_offset="on"
                data-frames='[{"delay":500,"speed":1000,"frame":"0","from":"opacity:0;","to":"o:1;","ease":"Power2.easeInOut"},{"delay":"wait","speed":300,"frame":"999","to":"opacity:0;","ease":"nothing"}]'
                data-textAlign="['center','center','center','center']"
                style="z-index: 8; white-space: normal; font-size: 70px; line-height: 70px; font-weight: 400; color: #ffffff;font-family:Leckerli One; text-align: center;">
                <a href="${link}" style="color: #fffffe;">${title}</a>
              </div>
            </li>
        `;
    });

    sliderUl.innerHTML = html;

    // Khởi tạo Revolution Slider sau khi đã tạo xong HTML các slide
    if (typeof initMainSlider === "function") {
      initMainSlider();
    } else {
      console.error("Hàm initMainSlider không tồn tại!");
    }
  } catch (err) {
    console.error("Lỗi load slider từ API:", err);
  }
}

// Gọi hàm ngay khi file được load
updateSlider();
