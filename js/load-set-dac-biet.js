async function loadSetDacBiet() {
  try {
    const res = await fetch("../JSON/sets.json");
    const data = await res.json();

    const menu = document.getElementById("set-dac-biet-element");
    menu.innerHTML = "";

    data.menuItems.forEach((item) => {
      menu.innerHTML += `
                                <div class="shop-item col-lg-4 col-md-6 col-sm-12">
                                    <div class="inner-box">
                                        <div class="image-box">
                                            <figure class="image">
                                                <a href="${item.link}">
                                                    <img src="${item.image}"
                                                        alt="">
                                                </a>
                                                &nbsp;
                                            </figure>

                                        </div>
                                        <div class="lower-content">
                                            <h4 class="name">
                                                <a href="${item.link}">${item.title}</a>
                                            </h4>
                                        </div>
                                    </div>
                                </div>
      `;
    });
  } catch (err) {
    console.error("Lỗi load menu JSON:", err);
  }
}

loadSetDacBiet();
