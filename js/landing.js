document.addEventListener('DOMContentLoaded', () => {
    // 0. Đăng ký Plugin GSAP
    gsap.registerPlugin(ScrollTrigger, Draggable);

    // 1. Header Logic
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 2. Intro Tabs Logic with GSAP
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');
    const indicator = document.querySelector('.tab-line');

    if (tabs.length > 0 && contents.length > 0) {
        let currentTab = 0;
        let autoplayTimer;

        function updateIndicator(index) {
            const activeTab = tabs[index];
            if (!activeTab || !indicator) return;
            gsap.to(indicator, {
                left: activeTab.offsetLeft,
                width: activeTab.offsetWidth,
                duration: 0.5,
                ease: "power2.out"
            });
        }

        function showTab(index) {
            if (!tabs[index] || !contents[index]) return;

            // Reset classes
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => {
                c.classList.remove('active');
                gsap.set(c, { opacity: 0, x: 20 });
            });

            // Activate new tab
            tabs[index].classList.add('active');
            contents[index].classList.add('active');
            updateIndicator(index);

            // Animate content appearance
            gsap.to(contents[index], {
                opacity: 1,
                x: 0,
                duration: 0.6,
                ease: "power2.out"
            });
        }

        function nextTab() {
            currentTab = (currentTab + 1) % tabs.length;
            showTab(currentTab);
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayTimer = setInterval(nextTab, 5000); // 5 seconds
        }

        function stopAutoplay() {
            if (autoplayTimer) clearInterval(autoplayTimer);
        }

        // Initialize
        setTimeout(() => {
            showTab(0);
            startAutoplay();
        }, 100);

        // Event Listeners for Tabs
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                currentTab = index;
                showTab(index);
                stopAutoplay(); // Stop autoplay on user interaction
                startAutoplay(); // Restart timer
            });
        });

        // Tạm dừng autoplay khi di chuột vào vùng nội dung
        const introSection = document.querySelector('.tab-contents');
        if (introSection) {
            introSection.addEventListener('mouseenter', stopAutoplay);
            introSection.addEventListener('mouseleave', startAutoplay);
        }

        // Resize handling for indicator
        window.addEventListener('resize', () => {
            if (typeof currentTab !== 'undefined') updateIndicator(currentTab);
        });
    }

    // 3. Scroll Reveal for Intro Section
    if (document.querySelector('.intro')) {
        gsap.from('.intro .tabs', {
            scrollTrigger: {
                trigger: '.intro',
                start: 'top 80%',
            },
            opacity: 0,
            y: 30,
            duration: 1,
            ease: 'power3.out'
        });
    }

    // 4. Mobile Menu & Cart Coordination
    const cartSidebar = document.getElementById('cartSidebar');
    const mobileMenu = document.getElementById('mobileMenu');

    if (cartSidebar && mobileMenu) {
        // Close menu if cart is opened
        cartSidebar.addEventListener('show.bs.offcanvas', () => {
            const bsOffcanvas = bootstrap.Offcanvas.getInstance(mobileMenu);
            if (bsOffcanvas) bsOffcanvas.hide();
        });

        // Close cart if menu is opened
        mobileMenu.addEventListener('show.bs.offcanvas', () => {
            const bsCart = bootstrap.Offcanvas.getInstance(cartSidebar);
            if (bsCart) bsCart.hide();

            // GSAP Stagger animation for menu items (Slide from right)
            const menuItems = mobileMenu.querySelectorAll('.nav-item');
            if (menuItems.length > 0) {
                gsap.to(menuItems, {
                    x: 0,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: "back.out(1.2)",
                    delay: 0.3
                });
            }
        });

        // Reset items when menu is hidden
        mobileMenu.addEventListener('hidden.bs.offcanvas', () => {
            const menuItems = mobileMenu.querySelectorAll('.nav-item');
            if (menuItems.length > 0) {
                gsap.set(menuItems, { x: 40, opacity: 0 });
            }
        });

        // Auto-close menu on link click (for anchor scrolls)
        const navLinks = mobileMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const bsOffcanvas = bootstrap.Offcanvas.getInstance(mobileMenu);
                if (bsOffcanvas) bsOffcanvas.hide();
            });
        });
    }

    // 5. Scroll Reveal for Benefits Section
    if (document.querySelector('.benefits-section')) {
        gsap.from('.benefits-section .section-header', {
            scrollTrigger: {
                trigger: '.benefits-section',
                start: 'top 80%',
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from('.benefits-section .benefit-item', {
            scrollTrigger: {
                trigger: '.benefits-section',
                start: 'top 70%',
            },
            opacity: 0,
            y: 40,
            stagger: 0.15,
            duration: 0.8,
            ease: 'back.out(1.2)'
        });
    }

    // 6. Professional GSAP Animations for Unique Section
    if (document.querySelector('.unique-section')) {
        // Subtle floating animation for Glow Blobs
        gsap.to('.glow-blob', {
            x: '+=30',
            y: '+=20',
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: {
                each: 1,
                from: "random"
            }
        });

        // Entrance animation for header
        const uniqueHeader = gsap.timeline({
            scrollTrigger: {
                trigger: '.unique-section',
                start: 'top 80%',
            }
        });

        uniqueHeader.from('.unique-section .main-title', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power2.out"
        }).from('.unique-section .title-line', {
            width: 0,
            duration: 1,
            ease: "expo.out"
        }, "-=0.5");

        // Staggered entrance for Feature Cards
        gsap.from('.unique-section .feature-item', {
            scrollTrigger: {
                trigger: '.unique-section .row',
                start: 'top 75%',
            },
            opacity: 0,
            y: 60,
            stagger: 0.15,
            duration: 1.2,
            ease: "power4.out",
            clearProps: "all"
        });
    }

    // --- SECTION KHÓA HỌC (COURSES SECTION) ---
    // Section này đã được chuyển sang phần load dữ liệu động bên dưới

    // 3. Hiệu ứng Hover nâng cao bằng GSAP (Tùy chọn)
    // Thay vì dùng CSS hover, GSAP giúp chuyển động mượt hơn
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        const cardBtn = card.querySelector(".card-btn");

        card.addEventListener("mouseenter", () => {
            gsap.to(card, {
                y: -15,
                duration: 0.4,
                ease: "power2.out",
                boxShadow: "0 30px 60px rgba(0,95,184,0.15)"
            });

            if (cardBtn) {
                gsap.to(cardBtn, {
                    scale: 1.2,
                    backgroundColor: "#005FB8",
                    color: "#fff",
                    duration: 0.3
                });
            }
        });

        card.addEventListener("mouseleave", () => {
            gsap.to(card, {
                y: 0,
                duration: 0.4,
                ease: "power2.out",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
            });

            if (cardBtn) {
                gsap.to(cardBtn, {
                    scale: 1,
                    backgroundColor: "#f8fafc",
                    color: "#005FB8",
                    duration: 0.3
                });
            }
        });
    });

    // --- 1. LOGIC LOAD KHÓA HỌC TỪ JSON & SWIPER ---
    const pSlider = document.querySelector('#pricing-content');
    const pContainer = document.querySelector('.pricing-swiper-container');
    const pNextBtn = document.querySelector('.pricing-swiper-container .next-btn');
    const pPrevBtn = document.querySelector('.pricing-swiper-container .prev-btn');
    const selection = document.querySelector('.switch-selection');
    const radioButtons = document.querySelectorAll('input[name="billing"]');

    // Hàm định dạng số hiển thị cho bảng giá (VD: 499000 -> 499.000)
    const formatPriceShort = (num) => {
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    const loadCourses = async () => {
        try {
            const response = await fetch('json/courses.json');
            const courses = await response.json();

            if (!pSlider) return;

            // Render cards từ dữ liệu JSON (Bọc trong swiper-slide)
            pSlider.innerHTML = courses.map(course => `
                <div class="swiper-slide">
                    <div class="pricing-card ${course.featured ? 'featured' : ''}" 
                        data-id="${course.id}" 
                        data-name="${course.name}" 
                        data-img="${course.img}"
                        data-price-monthly="${course.prices.monthly}"
                        data-price-halfyear="${course.prices.halfyear}"
                        data-price-yearly="${course.prices.yearly}">
                        <div class="card-inner">
                            ${course.badge ? `<div class="card-badge badge-${course.badge}">${course.badge_text}</div>` : ''}
                            <h3 class="course-name">${course.name}</h3>
                            <div class="price-box">
                                <span class="amount" 
                                    data-monthly="${formatPriceShort(course.prices.monthly)}" 
                                    data-halfyear="${formatPriceShort(course.prices.halfyear)}"
                                    data-yearly="${formatPriceShort(course.prices.yearly)}">
                                    ${formatPriceShort(course.prices.monthly)}
                                </span>
                                <span class="currency">VND</span>
                                <span class="period">/tháng</span>
                            </div>
                            <ul class="benefits">
                                ${course.benefits.map(b => `<li><i class="fas fa-check"></i> ${b}</li>`).join('')}
                            </ul>
                            <a href="javascript:void(0)" class="btn-pricing js-add-to-cart">Đăng ký ngay</a>
                        </div>
                    </div>
                </div>
            `).join('');

            // Khởi tạo các logic điều khiển sau khi render xong
            initPricingSwitcher();
            initPricingSwiper();

            // 6. HIỆU ỨNG XUẤT HIỆN CHO PRICING SECTION
            const pricingHeader = document.querySelector('#courses .pricing-header');
            if (pricingHeader) {
                gsap.from(pricingHeader, {
                    scrollTrigger: {
                        trigger: "#courses",
                        start: "top 80%",
                    },
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out"
                });
            }

            const pCards = pSlider.querySelectorAll('.pricing-card');
            if (pCards.length > 0) {
                gsap.from(pCards, {
                    scrollTrigger: {
                        trigger: ".pricing-swiper-container",
                        start: "top 85%",
                    },
                    y: 50,
                    opacity: 0,
                    scale: 0.9,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: "back.out(1.2)",
                    clearProps: "all"
                });
            }

        } catch (error) {
            console.error('Lỗi khi tải danh sách khóa học:', error);
        }
    };

    function initPricingSwitcher() {
        const amounts = document.querySelectorAll('.price-box .amount');
        const periods = document.querySelectorAll('.price-box .period');

        function updateSwitchUI(selectedInput) {
            const label = document.querySelector(`label[for="${selectedInput.id}"]`);
            if (selection && label) {
                gsap.to(selection, {
                    left: label.offsetLeft,
                    width: label.offsetWidth,
                    duration: 0.4,
                    ease: "expo.out"
                });
            }

            const type = selectedInput.value;
            amounts.forEach((amount, index) => {
                let newPrice = amount.getAttribute(`data-${type}`);
                let newPeriod = (type === 'monthly') ? '/tháng' : (type === 'halfyear' ? '/6 tháng' : '/năm');

                gsap.to(amount, {
                    opacity: 0, y: -10, duration: 0.2,
                    onComplete: () => {
                        amount.innerText = newPrice;
                        periods[index].innerText = newPeriod;
                        gsap.to(amount, { opacity: 1, y: 0, duration: 0.2 });
                    }
                });
            });
        }

        const checkedRadio = document.querySelector('input[name="billing"]:checked');
        if (checkedRadio) updateSwitchUI(checkedRadio);

        radioButtons.forEach(radio => {
            radio.addEventListener('change', () => updateSwitchUI(radio));
        });
    }

    function initPricingSwiper() {
        if (!pSlider || !pContainer) return;

        const pricingSwiper = new Swiper(".pricingSwiper", {
            slidesPerView: 1,
            spaceBetween: 20,
            grabCursor: true,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".next-btn",
                prevEl: ".prev-btn",
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                },
                1200: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
            },
        });
    }

    // Kích hoạt nạp dữ liệu
    loadCourses();

    // 1. Hiệu ứng Robot bay lơ lửng (Giữ nguyên của bạn)
    gsap.to(".floating-img", {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // 2. Hiệu ứng các thẻ bên trái (Dùng fromTo để ép nó phải hiện)
    gsap.fromTo(".eco-left .eco-card",
        { x: -100, opacity: 0 }, // Trạng thái bắt đầu
        {
            x: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".section_tech_ecosystem",
                start: "top 80%", // Kích hoạt sớm hơn một chút (80% màn hình)
                toggleActions: "play none none none" // Chỉ chạy 1 lần duy nhất
            },
            onComplete: function () {
                // Xóa các thuộc tính GSAP sau khi chạy xong để Hover CSS hoạt động mượt
                gsap.set(".eco-left .eco-card", { clearProps: "all" });
            }
        }
    );

    // 3. Hiệu ứng các thẻ bên phải (Dùng fromTo)
    gsap.fromTo(".eco-right .eco-card",
        { x: 100, opacity: 0 }, // Trạng thái bắt đầu
        {
            x: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".section_tech_ecosystem",
                start: "top 80%",
            },
            onComplete: function () {
                gsap.set(".eco-right .eco-card", { clearProps: "all" });
            }
        }
    );

    // 4. Vòng tròn tỏa sáng (Giữ nguyên)
    gsap.to(".circle-decor", {
        scale: 1.2,
        opacity: 0.8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // --- HIỆU ỨNG LOGO ĐỐI TÁC CHẠY VÔ TẬN ---
    const track = document.querySelector('.partners-track');
    if (track) {
        // Hàm khởi tạo animation
        const initPartnersScroll = () => {
            const items = track.querySelectorAll('.partner-logo');
            if (items.length === 0) return;

            // Tính toán khoảng cách cần di chuyển (một nửa track vì đã nhân đôi logo)
            let scrollDistance = 0;
            const halfCount = Math.ceil(items.length / 2);

            for (let i = 0; i < halfCount; i++) {
                // offsetWidth + gap (100px trong SCSS)
                scrollDistance += items[i].offsetWidth + 100;
            }

            // Tạo tween trượt vô tận
            const scrollTween = gsap.to(track, {
                x: -scrollDistance,
                duration: 30,
                ease: "none",
                repeat: -1,
                overwrite: true
            });

            // Tạm dừng khi hover
            track.addEventListener('mouseenter', () => {
                gsap.to(scrollTween, { timeScale: 0, duration: 0.5 });
            });
            track.addEventListener('mouseleave', () => {
                gsap.to(scrollTween, { timeScale: 1, duration: 0.5 });
            });
        };

        // Đảm bảo ảnh đã load để lấy width chính xác
        if (document.readyState === 'complete') {
            initPartnersScroll();
        } else {
            window.addEventListener('load', initPartnersScroll);
        }
    }

    // --- HIỆU ỨNG HIỆN ĐÁNH GIÁ (FIX LỖI KHÔNG HIỆN) ---
    const sectionTesti = document.querySelector('.section_testimonials');
    const testiCards = document.querySelectorAll('.testi-card');

    if (sectionTesti && testiCards.length > 0) {
        gsap.fromTo(testiCards,
            {
                y: 60,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".section_testimonials",
                    start: "top 90%", // Kích hoạt sớm hơn ngay khi vừa thấy mép section
                    toggleActions: "play none none none"
                }
            }
        );
    }

    // --- HIỆU ỨNG HIỆN SECTION LIÊN HỆ ---
    const contactSection = document.querySelector('.section_contact');
    if (contactSection) {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".section_contact",
                start: "top 75%",
            }
        });

        tl.from(".contact-info > *", {
            x: -50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
        })
            .from(".contact-form-container", {
                x: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            }, "-=0.6");
    }

    // --- HIỆU ỨNG HIỆN FOOTER ---
    const footer = document.querySelector('.main-footer');
    if (footer) {
        gsap.fromTo(footer,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: footer,
                    start: "top 95%",
                    toggleActions: "play none none none"
                }
            }
        );
    }

    // 1. Hiệu ứng chữ bên trái trồi lên
    if (document.querySelector('.ai-interview-section')) {
        gsap.from(".reveal-text", {
            scrollTrigger: {
                trigger: ".ai-interview-section",
                start: "top 70%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });

        // 2. Hiệu ứng hình ảnh bên phải lướt vào
        gsap.from(".reveal-image", {
            scrollTrigger: {
                trigger: ".ai-interview-section",
                start: "top 70%",
            },
            x: 100,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out"
        });

        // 3. Hiệu ứng thanh năng lượng và con số nhảy (Counter)
        const tlAi = gsap.timeline({
            scrollTrigger: {
                trigger: ".ai-interview-section",
                start: "top 60%",
            }
        });

        tlAi.to("#energyFill", {
            width: "85%", // Con số năng lượng demo
            duration: 2,
            ease: "expo.out"
        })
            .to(".counter-num", {
                innerText: 85,
                duration: 2,
                snap: { innerText: 1 },
                ease: "expo.out"
            }, "<"); // Chạy đồng thời với thanh bar
    }

    const videoModal = document.getElementById('videoModal');
    const videoIframe = document.getElementById('introVideo');

    if (videoModal && videoIframe) {
        // Lấy URL gốc của video
        const videoSrc = videoIframe.getAttribute('src');

        // Khi Modal đóng: Xóa src để dừng video hoàn toàn
        videoModal.addEventListener('hide.bs.modal', () => {
            videoIframe.setAttribute('src', '');
        });

        // Khi Modal mở lại: Nạp lại src để video sẵn sàng
        videoModal.addEventListener('show.bs.modal', () => {
            videoIframe.setAttribute('src', videoSrc);
        });
    }

    let roadmapSwiperInstance = null;
    const roadmapModal = document.getElementById('roadmapModal');

    if (roadmapModal) {
        // Sự kiện khi Modal đã hiện ra hoàn toàn
        roadmapModal.addEventListener('shown.bs.modal', function () {

            // 1. Kiểm tra và Khởi tạo Swiper
            const swiperSelector = "#roadmapModal .roadmapSwiper";

            if (!roadmapSwiperInstance) {
                // Chỉ khởi tạo lần đầu tiên
                roadmapSwiperInstance = new Swiper(swiperSelector, {
                    slidesPerView: 1,
                    spaceBetween: 30,
                    observer: true,
                    observeParents: true,
                    watchSlidesProgress: true,
                    pagination: {
                        el: "#roadmapModal .swiper-pagination",
                        clickable: true,
                    },
                    navigation: {
                        nextEl: "#roadmapModal .swiper-button-next",
                        prevEl: "#roadmapModal .swiper-button-prev",
                    },
                    breakpoints: {
                        768: { slidesPerView: 2 },
                        1200: { slidesPerView: 3 },
                    },
                });
            } else {
                // Những lần sau chỉ cần cập nhật lại kích thước
                roadmapSwiperInstance.update();
            }

            // 2. Chạy hiệu ứng GSAP (Chạy mỗi khi mở Modal)
            const cards = document.querySelectorAll("#roadmapModal .path-card");
            if (typeof gsap !== 'undefined' && cards.length > 0) {
                // Đưa về trạng thái chuẩn bị diễn
                gsap.set(cards, { y: 40, opacity: 0, scale: 0.95 });

                // Diễn hoạt trồi lên
                gsap.to(cards, {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out",
                    // Xóa transform sau khi xong để không ảnh hưởng đến Swiper
                    clearProps: "transform"
                });
            }
        });
    }

    // 1. Khởi tạo Swiper
    const roadmapSwiper = new Swiper(".section_project .roadmapSwiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        grabCursor: true,
        loop: false,           // Tắt vòng lặp
        centeredSlides: false, // TẮT chế độ căn giữa
        watchSlidesProgress: true, // Bật để theo dõi slide

        // Cấu hình để slide đầu tiên nằm sát lề trái
        freeMode: false,

        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".roadmap-nav-next",
            prevEl: ".roadmap-nav-prev",
        },
        breakpoints: {
            // Tablet: Hiện đúng 2 cái
            768: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            // Desktop: ÉP BUỘC HIỆN ĐÚNG 3 CÁI
            1200: {
                slidesPerView: 3,
                spaceBetween: 30
            }
        }
    });

    // 2. GSAP Animation
    gsap.registerPlugin(ScrollTrigger);

    // Tiêu đề hiện ra
    gsap.from(".reveal-header", {
        scrollTrigger: {
            trigger: ".section_project",
            start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8
    });

    // Các thẻ slide trồi lên lần lượt (Stagger)
    gsap.from(".section_project .roadmapSwiper .swiper-slide", {
        scrollTrigger: {
            trigger: ".section_project .roadmapSwiper",
            start: "top 80%",
        },
        y: 60,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out"
    });

    // ==========================================
    // FEATURE DETAIL MODAL - GSAP ANIMATION (FIXED 3D TILT)
    // ==========================================
    let featuresData = null;
    let modalSwiperInstance = null;

    fetch('json/features.json').then(res => res.json()).then(data => featuresData = data);

    const featureModal = document.getElementById('featureDetailModal');
    if (featureModal) {
        featureModal.addEventListener('show.bs.modal', function (event) {
            const featureId = event.relatedTarget.getAttribute('data-feature');
            const data = featuresData[featureId];
            if (!data) return;

            document.getElementById('modal-title').innerText = data.title;
            document.getElementById('modal-subtitle').innerText = data.subtitle;
            document.getElementById('modal-desc').innerText = data.desc;

            const specsBox = document.getElementById('modal-specs');
            specsBox.innerHTML = data.specs.map(s => `<div class="col-4"><div class="spec-card-mini"><span class="s-val">${s}</span></div></div>`).join('');

            const swiperWrapper = document.getElementById('modal-swiper-wrapper');
            swiperWrapper.innerHTML = data.images.map(img => `<div class="swiper-slide"><img src="${img}" class="modal-main-img-file" alt="UI"></div>`).join('');

            setTimeout(() => {
                if (modalSwiperInstance) modalSwiperInstance.destroy(true, true);
                modalSwiperInstance = new Swiper(".modalFeatureSwiper", {
                    effect: "fade",
                    fadeEffect: { crossFade: true },
                    loop: true,
                    observer: true,
                    observeParents: true,
                    pagination: { el: ".mini-pagination", clickable: true },
                    navigation: { nextEl: ".mini-nav.swiper-button-next", prevEl: ".mini-nav.swiper-button-prev" },
                });

                const isMobile = window.innerWidth < 991;
                const tl = gsap.timeline();

                // 1. DIỄN HOẠT ẢNH CHÍNH (GIỮ ĐỘ NGHIÊNG 3D)
                // Chúng ta ép GSAP phải animate đến góc nghiêng rotationY: -15 và rotationX: 5
                tl.from(".reveal-wow-1", {
                    x: isMobile ? 0 : -100,
                    y: isMobile ? 30 : 0,
                    rotationY: 0, // Bắt đầu từ phẳng
                    rotationX: 0, // Bắt đầu từ phẳng
                    autoAlpha: 0,
                    duration: 1.2,
                    ease: "power4.out"
                });

                // Ép trạng thái kết thúc phải nghiêng (dành cho Desktop)
                if (!isMobile) {
                    gsap.to(".reveal-wow-1", {
                        rotationY: -15, // Độ nghiêng giống tấm ảnh 1 của bạn
                        rotationX: 5,
                        duration: 0.1 // Chạy cực nhanh để khóa góc nghiêng
                    });
                }

                // 2. Diễn hoạt các icon/robot phụ
                if (!isMobile) {
                    tl.from(".reveal-wow-2, .reveal-wow-3", {
                        scale: 0,
                        autoAlpha: 0,
                        stagger: 0.2,
                        duration: 0.8,
                        ease: "back.out(1.7)"
                    }, "-=0.8");
                }

                // 3. Diễn hoạt nội dung bên phải (BAO GỒM NÚT BẤM)
                tl.from(".reveal-content > *", {
                    y: 20,
                    autoAlpha: 0,
                    stagger: 0.1,
                    duration: 0.5,
                    ease: "power2.out",
                    // Chỉ xóa props của nội dung, không xóa của ảnh chính để giữ độ nghiêng
                    clearProps: "all"
                }, "-=0.6");

            }, 450);
        });

        featureModal.addEventListener('hidden.bs.modal', () => {
            if (modalSwiperInstance) modalSwiperInstance.destroy(true, true);
            modalSwiperInstance = null;
            // Reset sạch sẽ
            gsap.set(".reveal-content > *, .reveal-wow-1, .reveal-wow-2, .reveal-wow-3", { clearProps: "all" });
        });
    }

});