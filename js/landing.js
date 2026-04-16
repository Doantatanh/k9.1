document.addEventListener('DOMContentLoaded', () => {
    // 0. Đăng ký Plugin GSAP
    gsap.registerPlugin(ScrollTrigger, Draggable);

    // 1. Header Logic
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

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

        // Resize handling for indicator
        window.addEventListener('resize', () => {
            if (typeof currentTab !== 'undefined') updateIndicator(currentTab);
        });
    }

    // 3. Scroll Reveal for Intro Section
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
            gsap.to('#mobileMenu .nav-item', {
                x: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 0.8,
                ease: "back.out(1.2)",
                delay: 0.3
            });
        });

        // Reset items when menu is hidden
        mobileMenu.addEventListener('hidden.bs.offcanvas', () => {
            gsap.set('#mobileMenu .nav-item', { x: 40, opacity: 0 });
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

    // --- CÁC HIỆU ỨNG CHO SECTION KHÓA HỌC (COURSES SECTION) ---
    // 6. Section Khoa Hoc (Project)
    const khoaHocSection = document.querySelector('#courses');
    if (khoaHocSection) {
        // Animation hiện tiêu đề
        gsap.fromTo("#courses .language-header",
            { y: 30, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: "#courses",
                    start: "top 85%", // Kích hoạt sớm hơn một chút
                    toggleActions: "play none none none"
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power2.out"
            }
        );

        // Animation hiện các Card
        const projectCards = khoaHocSection.querySelectorAll('.card');
        if (projectCards.length > 0) {
            gsap.fromTo(projectCards,
                { y: 50, opacity: 0, scale: 0.95 },
                {
                    scrollTrigger: {
                        trigger: ".language-cards",
                        start: "top 90%", // Hiện Card khi phần container vừa vào màn hình
                    },
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.15, // Thời gian trễ giữa các card
                    ease: "power2.out",
                    clearProps: "all" // SAU KHI CHẠY XONG THÌ XÓA HẾT STYLE GSAP ĐỂ HOVER CSS TỰ DO
                }
            );
        }
    }

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

    // --- 1. LOGIC LOAD KHÓA HỌC TỪ JSON & SLIDER ---
    const pSlider = document.querySelector('.pricing-slider');
    const pContainer = document.querySelector('.pricing-slider-container');
    const pNextBtn = document.querySelector('.pricing-nav .next-btn');
    const pPrevBtn = document.querySelector('.pricing-nav .prev-btn');
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

            // Render cards từ dữ liệu JSON
            pSlider.innerHTML = courses.map(course => `
                <div class="pricing-card ${course.featured ? 'featured' : ''}" 
                    data-id="${course.id}" 
                    data-name="${course.name}" 
                    data-img="${course.img}"
                    data-price-monthly="${course.prices.monthly}"
                    data-price-halfyear="${course.prices.halfyear}"
                    data-price-yearly="${course.prices.yearly}">
                    <div class="card-inner">
                        ${course.tag ? `<div class="tag">${course.tag}</div>` : ''}
                        <h3 class="course-name">${course.name}</h3>
                        <div class="price-box">
                            <span class="currency">VND</span>
                            <span class="amount" 
                                data-monthly="${formatPriceShort(course.prices.monthly)}" 
                                data-halfyear="${formatPriceShort(course.prices.halfyear)}"
                                data-yearly="${formatPriceShort(course.prices.yearly)}">
                                ${formatPriceShort(course.prices.monthly)}
                            </span>
                            <span class="period">/tháng</span>
                        </div>
                        <ul class="benefits">
                            ${course.benefits.map(b => `<li><i class="fas fa-check"></i> ${b}</li>`).join('')}
                        </ul>
                        <a href="javascript:void(0)" class="btn-pricing js-add-to-cart">Đăng ký ngay</a>
                    </div>
                </div>
            `).join('');

            // Khởi tạo các logic điều khiển sau khi render xong
            initPricingSwitcher();
            initPricingSlider();

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

    function initPricingSlider() {
        if (!pSlider || !pContainer) return;
        const pCards = pSlider.querySelectorAll('.pricing-card');
        if (pCards.length === 0) return;

        const getSliderVars = () => {
            const cardWidth = pCards[0].offsetWidth;
            const style = window.getComputedStyle(pSlider);
            const gap = parseInt(style.columnGap) || 20;
            const step = cardWidth + gap;
            const containerWidth = pContainer.offsetWidth;
            const paddingLeft = parseInt(style.paddingLeft) || 0;
            const offset = (containerWidth - cardWidth) / 2 - paddingLeft;
            return { step, offset, cardWidth };
        };

        const updateMaxScroll = () => -(pSlider.scrollWidth - pContainer.offsetWidth);
        let maxScroll = updateMaxScroll();

        window.addEventListener('resize', () => {
            maxScroll = updateMaxScroll();
            // Reset position on resize to avoid broken UI
            gsap.set(pSlider, { x: 0 });
        });

        // Khởi tạo Draggable
        const dragInstance = Draggable.create(pSlider, {
            type: "x",
            edgeResistance: 0.85,
            bounds: { minX: maxScroll, maxX: 0 },
            inertia: true,
            snap: {
                x: function (value) {
                    const vars = getSliderVars();
                    if (window.innerWidth < 992) {
                        return Math.round((value - vars.offset) / vars.step) * vars.step + vars.offset;
                    }
                    return Math.round(value / vars.step) * vars.step;
                }
            },
            onDragStart: () => pSlider.style.cursor = "grabbing",
            onDragEnd: () => pSlider.style.cursor = "grab"
        });

        const moveSlider = (direction) => {
            const vars = getSliderVars();
            let currentX = gsap.getProperty(pSlider, "x");
            let targetX = direction === 'next'
                ? Math.round((currentX - vars.step - (window.innerWidth < 992 ? vars.offset : 0)) / vars.step) * vars.step
                : Math.round((currentX + vars.step - (window.innerWidth < 992 ? vars.offset : 0)) / vars.step) * vars.step;

            if (window.innerWidth < 992) targetX += vars.offset;
            if (targetX < maxScroll) targetX = maxScroll;
            if (targetX > (window.innerWidth < 992 ? vars.offset : 0)) targetX = (window.innerWidth < 992 ? vars.offset : 0);

            gsap.to(pSlider, {
                x: targetX,
                duration: 0.5,
                ease: "power2.out",
                onUpdate: () => dragInstance[0].update()
            });
        };

        if (pNextBtn) pNextBtn.onclick = () => moveSlider('next');
        if (pPrevBtn) pPrevBtn.onclick = () => moveSlider('prev');
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
                    trigger: ".main-footer",
                    start: "top 90%",
                    toggleActions: "play none none none"
                }
            }
        );
    }

    // Resize handling for indicator
    window.addEventListener('resize', () => {
        if (typeof currentTab !== 'undefined') updateIndicator(currentTab);
    });
});