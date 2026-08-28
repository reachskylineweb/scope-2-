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
        document.querySelectorAll('.guest-3d-card-scene').forEach(card => {
            popoutObserver.observe(card);
        });
    }

    // Initialize 3D Upside Down Gravity Perspective Section System
    initUpsideDownGravitySection();
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

// Refresh ScrollTrigger after full window load
if (typeof window !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
}
