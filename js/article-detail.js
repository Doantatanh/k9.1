async function loadArticleDetail() {
  // 1. Lấy slug từ URL
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  const container = document.getElementById("article-container");

  if (!slug) {
    container.innerHTML = "<p>Không tìm thấy bài viết.</p>";
    return;
  }

  try {
    // 2. Load file article-detail.json
    const res = await fetch("../JSON/article-detail.json");
    const data = await res.json();

    // 3. Tìm bài viết theo slug
    const article = data.articles.find((a) => a.slug === slug);

    if (!article) {
      container.innerHTML = "<p>Bài viết không tồn tại.</p>";
      return;
    }

    // 4. Render bài viết ra HTML
    container.innerHTML = `
            <div class="inner-box">         
                                                                              
                                            <h3 class="quote_text"><a href="/tin-tuc/">Tin tức</a> | <a href="article.html?slug=${article.slug}">${article.title}</a></h3>                                            
                                     

                                    <div class="image-column">
                                        <div class="inner-column">
                                            <figure class="image"><img src="${article.coverImage}"></figure>                                            
                                        </div>
                                    </div>
                                    <div class="content-column">
                                        <div class="inner-column">   
                                            ${article.contentHTML}
                                        </div>
                                    </div>
                                  
                                    <div class="devider"><img src="../images/icons/icon-devider-gray.png" alt=""></div>
                                </div>
        `;
  } catch (error) {
    console.error("Lỗi load bài viết:", error);
    container.innerHTML = "<p>Không thể tải bài viết.</p>";
  }
}

loadArticleDetail();
