async function loadWorkshopDetail() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  const container = document.getElementById("workshop-detail");

  try {
    const res = await fetch("../JSON/workshop-detail.json");
    const data = await res.json();

    const workshop = data.workshops.find((w) => w.slug === slug);

    container.innerHTML = `
            <div class="inner-box">         
                                                                              
                                            <h3 class="quote_text"><a href="workshop-lop-hoc.html">Workshop - Lớp Học</a> | <a href="workshop-detail.html?slug=${workshop.slug}">${workshop.title}</a></h3>                                            
                                     

                                    <div class="image-column">
                                        <div class="inner-column">
                                            <figure class="image"><img src="${workshop.coverImage}"></figure>                                            
                                        </div>
                                    </div>
                                    <div class="content-column">
                                        <div class="inner-column">   
                                            ${workshop.contentHTML}
                                        </div>
                                    </div>
                                  
                                    <div class="devider"><img src="../images/icons/icon-devider-gray.png" alt=""></div>
                                </div>
        `;
  } catch (err) {
    container.innerHTML = "<p>Không tìm thấy nội dung.</p>";
  }
}

loadWorkshopDetail();
