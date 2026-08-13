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

    // Stagger Highlight Cards
    const highlightCards = document.querySelectorAll('.highlight-card');
    if (highlightCards.length) {
        gsap.from(highlightCards, {
            scrollTrigger: {
                trigger: '.highlights-grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            stagger: 0.15,
            duration: 0.8,
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
            onLeaveBack: () => {
                // Flip close ONE BY ONE sequentially when scrolling up past
                gsap.to(flipCards, {
                    rotateY: -90,
                    opacity: 0,
                    scale: 0.85,
                    duration: 0.5,
                    stagger: 0.12,
                    ease: 'power2.in',
                    overwrite: 'auto'
                });
            }
        });
    }
}
