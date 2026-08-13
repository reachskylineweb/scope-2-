/* ==========================================================================
   NATIONAL ENDOSCOPY CONFERENCE 2026 - ECG LOADER
   Animated EKG SVG Waveform & Percentage Progress Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initECGLoader();
});

function initECGLoader() {
    const loader = document.getElementById('ecg-loader');
    const percentageText = document.getElementById('loader-percentage');
    const path = document.querySelector('.ecg-path');

    if (!loader || !percentageText) return;

    let progress = 0;
    const duration = 1000; // milliseconds (Faster loader)
    const startTime = performance.now();

    // 1. Animate SVG Path Stroke Dash if path exists
    if (path) {
        const pathLength = path.getTotalLength ? path.getTotalLength() : 600;
        path.style.strokeDasharray = pathLength;
        path.style.strokeDashoffset = pathLength;
        
        // Continuous rhythm CSS animation fallback/overlay
        path.animate([
            { strokeDashoffset: pathLength },
            { strokeDashoffset: 0 }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards'
        });
    }

    // 2. Count Up Loading Percentage
    function updateProgress(currentTime) {
        const elapsedTime = currentTime - startTime;
        progress = Math.min(Math.floor((elapsedTime / duration) * 100), 100);
        percentageText.textContent = `${progress}%`;

        if (progress < 100) {
            requestAnimationFrame(updateProgress);
        } else {
            completeLoading();
        }
    }

    requestAnimationFrame(updateProgress);

    // 3. Complete & Smooth Exit
    function completeLoading() {
        setTimeout(() => {
            loader.classList.add('fade-out');
            document.body.style.overflow = '';

            // Trigger GSAP Hero Entrance if available
            if (typeof initHeroAnimations === 'function') {
                initHeroAnimations();
            }
        }, 150);
    }
}
