async function loadJobDetail() {
  // 1. Lấy slug từ URL
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  const container = document.getElementById("job-detail");

  if (!slug) {
    container.innerHTML = "<p>Không tìm thấy công việc.</p>";
    return;
  }

  try {
    // 2. Load file JSON chi tiết tuyển dụng
    const res = await fetch("../JSON/jobs-detail.json");
    const data = await res.json();

    // 3. Tìm job theo slug
    const job = data.jobs.find((j) => j.slug === slug);

    if (!job) {
      container.innerHTML = "<p>Công việc không tồn tại.</p>";
      return;
    }

    // 4. Render HTML ra trang
    container.innerHTML = `
            <div class="inner-box">         
                                                                              
                                            <h3 class="quote_text"><a href="tuyen-dung.html">Tuyển Dụng</a> | <a href="job-detail.html?slug=${job.slug}">${job.title}</a></h3>                                            
                                     

                                    <div class="image-column">
                                        <div class="inner-column">
                                            <figure class="image"><img src="${job.image}"></figure>                                            
                                        </div>
                                    </div>
                                    <div class="content-column">
                                        <div class="inner-column">  
                                            <div class="job-meta">
                                        <p><strong>📍 Địa điểm:</strong> ${job.location}</p>
                                        <p><strong>💰 Mức lương:</strong> ${job.salary}</p>
                                        <p><strong>⏱ Loại hình:</strong> ${job.type}</p>
                                        <p><strong>📅 Hạn nộp:</strong> ${job.deadline}</p>
                                    </div> 
                                            ${job.contentHTML}
                                        </div>
                                    </div>
                                  
                                    <div class="devider"><img src="../images/icons/icon-devider-gray.png" alt=""></div>
                                </div>
        `;
  } catch (err) {
    console.error("Lỗi load job detail:", err);
    container.innerHTML = "<p>Không thể tải chi tiết công việc.</p>";
  }
}

loadJobDetail();
