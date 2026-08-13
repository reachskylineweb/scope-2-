/* ==========================================================================
   NATIONAL ENDOSCOPY CONFERENCE 2026 - MAIN JAVASCRIPT
   Config, Header, Mobile Nav, Lightbox & Global Helpers
   ========================================================================== */

// 1. GLOBAL EVENT CONFIGURATION (Easy to Edit)
const EVENT_CONFIG = {
    hospitalName: "Premier Institute of Gastroenterology",
    eventName: "National Endoscopy Conference 2026",
    eventDate: "October 14 - 16, 2026",
    venue: "Grand Convention Center & Advanced Endoscopy Suite, Premier Hospital Campus",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    email: "secretariat@endoscopy2026.org",
    address: "Premier Medical Center, Healthcare Boulevard, City Center"
};

document.addEventListener('DOMContentLoaded', () => {
    // 2. Populate Config Placeholders in DOM
    populateConfigData();

    // 3. Header Scroll Glassmorphism Effect
    initHeaderScroll();

    // 4. Mobile Navigation Toggle
    initMobileNav();

    // 5. Set Active Nav Item
    setActiveNavLink();

    // 6. Gallery Lightbox Handler (If gallery page)
    initGalleryLightbox();

    // 7. 3D Spinning Wheel Carousel for Our Doctors Section
    initDoctors3DWheel();

    // 8. 3D Mouse Parallax for Stethoscope Background Image
    initStetho3DMouseParallax();
});

/**
 * Dynamically binds EVENT_CONFIG values to DOM elements matching data-config attributes
 */
function populateConfigData() {
    const configElements = document.querySelectorAll('[data-config]');
    configElements.forEach(el => {
        const key = el.getAttribute('data-config');
        if (EVENT_CONFIG[key]) {
            if (el.tagName === 'A' && key === 'phone') {
                el.href = `tel:${EVENT_CONFIG[key].replace(/\s+/g, '')}`;
            } else if (el.tagName === 'A' && key === 'whatsapp') {
                const cleanNum = EVENT_CONFIG[key].replace(/[^0-9]/g, '');
                el.href = `https://wa.me/${cleanNum}?text=Hello,%20I%20want%20to%20register%20for%20Endoscopy%20Conference%202026`;
            } else if (el.tagName === 'A' && key === 'email') {
                el.href = `mailto:${EVENT_CONFIG[key]}`;
            } else {
                el.textContent = EVENT_CONFIG[key];
            }
        }
    });
}

/**
 * Adds .scrolled class to site header on scroll
 */
function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}

/**
 * Mobile Navigation Drawer Toggle
 */
function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        navMenu.classList.toggle('mobile-active');
        toggleBtn.classList.toggle('active');
        const isExpanded = navMenu.classList.contains('active');
        toggleBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking outside or clicking a nav link
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && (navMenu.classList.contains('active') || navMenu.classList.contains('mobile-active'))) {
            navMenu.classList.remove('active');
            navMenu.classList.remove('mobile-active');
            toggleBtn.classList.remove('active');
        }
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navMenu.classList.remove('mobile-active');
            toggleBtn.classList.remove('active');
        });
    });
}

/**
 * Sets current page link active styling
 */
function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Gallery Filter and Lightbox System
 */
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-card');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImgWrapper = document.getElementById('lightbox-img-wrapper');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const filterBtns = document.querySelectorAll('.filter-btn');

    if (!galleryItems.length || !lightboxModal) return;

    let currentIndex = 0;
    let visibleItems = Array.from(galleryItems);

    // Category Filter Handler
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            visibleItems = [];

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    visibleItems.push(item);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Open Lightbox
    visibleItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = visibleItems.indexOf(item);
            updateLightboxContent();
            lightboxModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function updateLightboxContent() {
        if (!visibleItems[currentIndex]) return;
        const currentItem = visibleItems[currentIndex];
        const title = currentItem.querySelector('.gallery-title')?.textContent || 'Event Photo';
        const category = currentItem.querySelector('.gallery-category')?.textContent || 'Gallery';
        const img = currentItem.querySelector('.gallery-img');
        const svgContent = currentItem.querySelector('.svg-thumb')?.outerHTML;

        lightboxTitle.textContent = title;
        lightboxCategory.textContent = category;

        if (img) {
            lightboxImgWrapper.innerHTML = `<img src="${img.src}" alt="${title}" class="lightbox-img" style="max-width: 90vw; max-height: 80vh; border-radius: 12px; border: 1px solid rgba(255,179,0,0.4); box-shadow: 0 20px 50px rgba(0,0,0,0.8); object-fit: contain;">`;
        } else if (svgContent) {
            lightboxImgWrapper.innerHTML = svgContent;
        }
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        updateLightboxContent();
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % visibleItems.length;
        updateLightboxContent();
    }

    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });
}

/**
 * 3D Stage Carousel with Active Center Card, Semi-transparent Previous (Left) and Next (Right) Cards
 */
function initDoctors3DWheel() {
    const ring = document.getElementById('wheel-3d-ring');
    const cards = document.querySelectorAll('.doctor-wheel-card');
    const dots = document.querySelectorAll('.wheel-dot');

    if (!ring || !cards.length) return;

    let currentIndex = 0;
    const totalCards = cards.length;
    let autoSpinInterval = null;

    function updateWheel(index) {
        currentIndex = (index + totalCards) % totalCards;
        const isMobile = window.innerWidth < 768;
        const xOffset = isMobile ? 210 : 340;

        cards.forEach((card, i) => {
            let offset = i - currentIndex;
            
            // Normalize cyclic offset to range [-1, 0, 1]
            if (offset > totalCards / 2) offset -= totalCards;
            if (offset < -totalCards / 2) offset += totalCards;

            card.classList.remove('active', 'is-left', 'is-right', 'is-hidden');

            if (offset === 0) {
                // Center Active Doctor Card
                card.classList.add('active');
                card.style.transform = 'translateX(0) translateZ(160px) rotateY(0deg) scale(1)';
                card.style.opacity = '1';
                card.style.filter = 'none';
                card.style.zIndex = '10';
            } else if (offset === -1) {
                // Previous Doctor Card (LEFT Side, semi-transparent)
                card.classList.add('is-left');
                card.style.transform = `translateX(-${xOffset}px) translateZ(0px) rotateY(25deg) scale(0.85)`;
                card.style.opacity = '0.45';
                card.style.filter = 'blur(1px)';
                card.style.zIndex = '5';
            } else if (offset === 1) {
                // Next Doctor Card (RIGHT Side, semi-transparent)
                card.classList.add('is-right');
                card.style.transform = `translateX(${xOffset}px) translateZ(0px) rotateY(-25deg) scale(0.85)`;
                card.style.opacity = '0.45';
                card.style.filter = 'blur(1px)';
                card.style.zIndex = '5';
            } else {
                // Far / Behind Cards
                card.classList.add('is-hidden');
                card.style.transform = 'translateX(0) translateZ(-300px) rotateY(180deg) scale(0.5)';
                card.style.opacity = '0';
                card.style.filter = 'blur(6px)';
                card.style.zIndex = '1';
            }
        });

        // Update Dots Active State
        dots.forEach((dot, i) => {
            if (i === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function spinNext() {
        updateWheel(currentIndex + 1);
    }

    // Clicking on Left or Right card rotates it to Center!
    cards.forEach((card, idx) => {
        card.addEventListener('click', () => {
            updateWheel(idx);
            resetAutoSpin();
        });
    });

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            updateWheel(idx);
            resetAutoSpin();
        });
    });

    // Auto-spin every 1.5 seconds (1500ms)
    function startAutoSpin() {
        autoSpinInterval = setInterval(spinNext, 1500);
    }

    function stopAutoSpin() {
        if (autoSpinInterval) clearInterval(autoSpinInterval);
    }

    function resetAutoSpin() {
        stopAutoSpin();
        startAutoSpin();
    }

    const wrapper = document.querySelector('.doctors-wheel-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', stopAutoSpin);
        wrapper.addEventListener('mouseleave', startAutoSpin);
    }

    window.addEventListener('resize', () => updateWheel(currentIndex));

    // Initialize
    updateWheel(0);
    startAutoSpin();
}

/**
 * 3D Interactive Mouse Parallax Movement for Stethoscope Background Image in Highlights Section
 */
function initStetho3DMouseParallax() {
    const section = document.querySelector('#highlights-section');
    const stethoImg = document.querySelector('.highlights-stetho-img');
    if (!section || !stethoImg) return;

    section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        const mouseX = e.clientX - rect.left - rect.width / 2;
        const mouseY = e.clientY - rect.top - rect.height / 2;

        const tiltX = (mouseY / rect.height) * 16;
        const tiltY = -(mouseX / rect.width) * 16;
        const moveX = (mouseX / rect.width) * 20;
        const moveY = (mouseY / rect.height) * 20;

        stethoImg.style.transform = `scale(1.14) translate(${moveX}px, ${moveY}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    section.addEventListener('mouseleave', () => {
        stethoImg.style.transform = '';
    });
}
