/* ==========================================================================
   NATIONAL ENDOSCOPY CONFERENCE 2026 - GSAP ANIMATIONS
   ScrollTrigger Reveals, Card Staggers, and Parallax Motion
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // If GSAP & ScrollTrigger are available, register plugin
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        initScrollAnimations();
    }
});

/**
 * 1. HERO ENTRANCE ANIMATION (Triggered post ECG loader fade-out)
 */
function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;

    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

    heroTimeline
        .from('.hero-content .badge', { opacity: 0, y: -20 })
        .from('.hero-title', { opacity: 0, y: 30 }, '-=0.6')
        .from('.hero-subtitle', { opacity: 0, y: 20 }, '-=0.6')
        .from('.event-meta-card', { opacity: 0, y: 20, scale: 0.98 }, '-=0.5')
        .from('.hero-buttons .btn', { opacity: 0, y: 20, stagger: 0.15 }, '-=0.5')
        .from('.scroll-indicator', { opacity: 0, y: 10 }, '-=0.3');
}

/**
 * 2. SCROLL TRIGGER REVEALS FOR SECTIONS & CARDS
 */
function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Fade-up elements with data-gsap="fade-up"
    gsap.utils.toArray('[data-gsap="fade-up"]').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 40,
            duration: 0.9,
            ease: 'power3.out'
        });
    });

    // Fade-right elements with data-gsap="fade-right"
    gsap.utils.toArray('[data-gsap="fade-right"]').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: -50,
            duration: 0.9,
            ease: 'power3.out'
        });
    });

    // Fade-left elements with data-gsap="fade-left"
    gsap.utils.toArray('[data-gsap="fade-left"]').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: 50,
            duration: 0.9,
            ease: 'power3.out'
        });
    });

    // Single Rectangle Card Fade/Slide Entrance Animation
    const singleCard = document.getElementById('single-rectangle-card');
    if (singleCard && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.from(singleCard, {
            scrollTrigger: {
                trigger: '#highlights-section',
                start: 'top 78%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 45,
            duration: 0.9,
            ease: 'power3.out'
        });
    }

    // Stagger Faculty Cards
    const facultyCards = document.querySelectorAll('.faculty-card');
    if (facultyCards.length) {
        gsap.from(facultyCards, {
            scrollTrigger: {
                trigger: '.faculty-grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 40,
            stagger: 0.12,
            duration: 0.8,
            ease: 'power3.out'
        });
    }

    // Timeline Items Reveal
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length) {
        gsap.from(timelineItems, {
            scrollTrigger: {
                trigger: '.timeline',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: -30,
            stagger: 0.18,
            duration: 0.7,
            ease: 'power2.out'
        });
    }

    // 3D Sequential Card Flip-Open (Scroll In) & Flip-Close (Scroll Out) - One By One
    const guestCardsGrid = document.querySelector('.guest-3d-cards-grid');
    const flipCards = document.querySelectorAll('[data-gsap="flip-card"]');

    if (guestCardsGrid && flipCards.length && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Initial 3D folded shut state
        gsap.set(flipCards, {
            rotateY: -90,
            opacity: 0,
            scale: 0.85,
            transformPerspective: 1200,
            transformOrigin: 'left center'
        });

        ScrollTrigger.create({
            trigger: guestCardsGrid,
            start: 'top 75%',
            end: 'bottom 20%',
            onEnter: () => {
                // Flip open ONE BY ONE sequentially
                gsap.to(flipCards, {
                    rotateY: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.75,
                    stagger: 0.18, // 1-by-1 sequential open delay
                    ease: 'back.out(1.4)',
                    overwrite: 'auto'
                });
            },
            onLeave: () => {
                // Flip close ONE BY ONE sequentially
                gsap.to(flipCards, {
                    rotateY: 90,
                    opacity: 0,
                    scale: 0.85,
                    duration: 0.5,
                    stagger: 0.12, // 1-by-1 sequential close
                    ease: 'power2.in',
                    overwrite: 'auto'
                });
            },
            onEnterBack: () => {
                // Flip open ONE BY ONE sequentially when scrolling back up
                gsap.to(flipCards, {
                    rotateY: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.75,
                    stagger: 0.18,
                    ease: 'back.out(1.4)',
                    overwrite: 'auto'
                });
            },
        });
    }

    // Slow Fade-In Reveal for "Pioneering Modern Gastrointestinal Endoscopy" in About Section
    const pioneeringCard = document.getElementById('pioneering-content-card');
    if (pioneeringCard && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        const pioneeringTitle = pioneeringCard.querySelector('.quantum-hero-title');
        const pioneeringDesc = pioneeringCard.querySelector('.quantum-hero-desc');
        const pioneeringBadge = pioneeringCard.querySelector('.quantum-card-badge');
        const pioneeringGrid = pioneeringCard.querySelector('.quantum-impact-grid');

        // Set initial hidden state
        gsap.set([pioneeringCard, pioneeringBadge, pioneeringTitle, pioneeringDesc, pioneeringGrid], {
            opacity: 0
        });

        const slowTl = gsap.timeline({
            scrollTrigger: {
                trigger: pioneeringCard,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        slowTl
            .to(pioneeringCard, { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' })
            .to(pioneeringBadge, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, '-=0.6')
            .fromTo(pioneeringTitle, 
                { opacity: 0, y: 50, filter: 'blur(12px)' }, 
                { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.8, ease: 'power2.out' }, 
                '-=0.8'
            )
            .fromTo(pioneeringDesc, 
                { opacity: 0, y: 35, filter: 'blur(8px)' }, 
                { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.6, ease: 'power2.out' }, 
                '-=1.2'
            )
            .fromTo(pioneeringGrid, 
                { opacity: 0, y: 30 }, 
                { opacity: 1, y: 0, duration: 1.4, ease: 'power2.out' }, 
                '-=1.0'
            );
    }

    // Section 1 & Section 2: IntersectionObserver for 100% Foolproof Pop-Up & 3D Flip Triggering
    if (typeof IntersectionObserver !== 'undefined') {
        const popoutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.remove('is-visible');
                }
            });
        }, { threshold: 0.15 });

        // Observe Our Endoscopists Pop-Out Cards
        document.querySelectorAll('.doc-popout-card-wrapper').forEach(card => {
            popoutObserver.observe(card);
        });

        // Observe Guest Doctors 3D Flip Cards
        document.querySelectorAll('.guest-flip-scene').forEach(card => {
            popoutObserver.observe(card);
            card.addEventListener('click', (e) => {
                // Toggle is-flipped class for mobile tap interaction
                card.classList.toggle('is-flipped');
            });
        });
    }

    // Initialize 3D Upside Down Gravity Perspective Section System
    initUpsideDownGravitySection();

    // Initialize Doctor Section Pinned Horizontal Scroll & Profile Popup
    initDoctorScrollSystem();

    // Initialize 3D Gyroscopic Tilt & Spotlight Glow for Guest Doctors
    initGuestTiltCards();

    // Initialize Section 04 Faculty Category Filter System
    initFacultyCategoryFilter();
}

/**
 * 3. 3D UPSIDE DOWN GRAVITY PERSPECTIVE & CARD FLIP SYSTEM
 */
function initUpsideDownGravitySection() {
    // 3.1 GSAP ScrollTrigger Upside Down 180° Roll Entrance
    const upsideDownCards = document.querySelectorAll('[data-gsap="upside-down-card"]');
    if (upsideDownCards.length && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        upsideDownCards.forEach((cardScene, index) => {
            const innerCard = cardScene.querySelector('.intro-card-3d-inner');
            if (!innerCard) return;

            gsap.fromTo(innerCard, 
                {
                    rotateX: 180,
                    scale: 0.82,
                    y: -70,
                    opacity: 0
                },
                {
                    scrollTrigger: {
                        trigger: cardScene,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    rotateX: 0,
                    scale: 1,
                    y: 0,
                    opacity: 1,
                    duration: 1.25,
                    delay: index * 0.2,
                    ease: 'back.out(1.5)'
                }
            );
        });
    }

    // 3.2 Click-to-Flip Handler for Individual Cards
    const cardScenes = document.querySelectorAll('.intro-card-3d-scene');
    cardScenes.forEach(scene => {
        const inner = scene.querySelector('.intro-card-3d-inner');
        if (!inner) return;

        scene.addEventListener('click', () => {
            inner.classList.toggle('flipped-upside-down');
        });
    });
}

/**
 * 4. DOCTOR SECTION HORIZONTAL SCROLL & POPUP MODAL SYSTEM (GSAP + ScrollTrigger)
 */
function initDoctorScrollSystem() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const doctorSection = document.querySelector('.doctor-scroll-section');
    const doctorTrack = document.getElementById('doctor-scroll-track');
    const doctorCards = document.querySelectorAll('.doctor-scroll-card');

    if (doctorSection && doctorTrack && doctorCards.length) {
        // Calculate total horizontal scroll length
        const getScrollDistance = () => doctorTrack.scrollWidth - window.innerWidth + 100;

        // Create GSAP ScrollTrigger Pinned Timeline
        const doctorScrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: doctorSection,
                pin: true,
                start: 'top top',
                end: () => `+=${getScrollDistance() + 400}`,
                scrub: 0.8,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    // Update active center card scaling
                    const viewportCenter = window.innerWidth / 2;
                    doctorCards.forEach(card => {
                        const rect = card.getBoundingClientRect();
                        const cardCenter = rect.left + rect.width / 2;
                        const distFromCenter = Math.abs(viewportCenter - cardCenter);
                        
                        if (distFromCenter < 220) {
                            card.classList.add('is-active');
                            card.classList.remove('is-side');
                        } else {
                            card.classList.remove('is-active');
                            card.classList.add('is-side');
                        }
                    });
                }
            }
        });

        doctorScrollTl.to(doctorTrack, {
            x: () => -(doctorTrack.scrollWidth - window.innerWidth + (window.innerWidth < 768 ? 40 : 120)),
            ease: 'none'
        });
    }

    // DOCTOR POPUP MODAL LOGIC
    const modal = document.getElementById('doctor-profile-modal');
    if (!modal) return;

    const modalImg = document.getElementById('modal-doctor-img');
    const modalName = document.getElementById('modal-doctor-name');
    const modalDegrees = document.getElementById('modal-doctor-degrees');
    const modalDesignation = document.getElementById('modal-doctor-designation');
    const modalSpecialty = document.getElementById('modal-doctor-specialty');
    const modalBadge = document.getElementById('modal-doctor-badge');
    const closeBtns = document.querySelectorAll('.doctor-modal-close, .close-doctor-modal, .doctor-modal-backdrop');

    // Open Doctor Modal
    document.querySelectorAll('.doctor-scroll-card, .fac-card-item').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();

            const name = card.getAttribute('data-doctor-name') || '';
            const degrees = card.getAttribute('data-doctor-degrees') || '';
            const designation = card.getAttribute('data-doctor-designation') || '';
            const specialty = card.getAttribute('data-doctor-specialty') || '';
            const image = card.getAttribute('data-doctor-image') || '';
            const badge = card.getAttribute('data-doctor-badge') || 'ORGANIZING CHAIR';

            if (modalName) modalName.textContent = name;
            if (modalDegrees) modalDegrees.textContent = degrees;
            if (modalDesignation) modalDesignation.textContent = designation;
            if (modalSpecialty) modalSpecialty.textContent = specialty;
            if (modalImg) {
                modalImg.src = image;
                modalImg.alt = name;
            }
            if (modalBadge) modalBadge.textContent = badge;

            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close Doctor Modal
    function closeDoctorModal() {
        if (!modal.classList.contains('is-open')) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            closeDoctorModal();
        });
    });

    // Close on ESC Keypress
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeDoctorModal();
        }
    });
}

/**
 * 5. 3D GYROSCOPIC TILT & DYNAMIC LIGHT SPOTLIGHT ANIMATION FOR GUEST DOCTORS CARDS
 */
function initGuestTiltCards() {
    const tiltCards = document.querySelectorAll('.patron-showcase-card, .guest-tilt-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set light glow position css variables
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Calculate tilt angles (-8deg to +8deg)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = -((y - centerY) / centerY) * 8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
        });
    });
}

/**
 * 6. FACULTY CATEGORY FILTER BAR SYSTEM
 */
function initFacultyCategoryFilter() {
    const filterBtns = document.querySelectorAll('.faculty-filter-btn');
    const facultyCards = document.querySelectorAll('.faculty-matrix-card');

    if (!filterBtns.length || !facultyCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            // Toggle active state on buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter faculty cards
            facultyCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('is-hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.classList.add('is-hidden');
                }
            });
        });
    });
}

// Refresh ScrollTrigger after full window load
if (typeof window !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
}
