/* ==========================================================================
   NATIONAL ENDOSCOPY CONFERENCE 2026 - 3D ENDOSCOPE CAMERA TUNNEL LOADER
   0–30%   → Endoscope camera powers on
   30–60%  → Camera moves through dark medical tunnel
   60–90%  → Light gradually increases
   100%    → Camera reaches bright screen → page appears
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initEndoscopeTunnelLoader();
});

function initEndoscopeTunnelLoader() {
    const loader = document.getElementById('endoscope-loader') || document.getElementById('ecg-loader');
    const percentageText = document.getElementById('loader-percentage');
    const milestoneText = document.getElementById('loader-milestone-text');

    if (!loader || !percentageText) return;

    let progress = 0;
    const duration = 900; // Fast 0.9 second duration
    const startTime = performance.now();

    function updateProgress(currentTime) {
        const elapsedTime = currentTime - startTime;
        progress = Math.min((elapsedTime / duration) * 100, 100);
        const currentPercent = Math.floor(progress);

        percentageText.textContent = `${currentPercent}%`;

        // Update 4 Stage Milestones rapidly
        if (progress < 30) {
            loader.setAttribute('data-stage', 'power-on');
            if (milestoneText) milestoneText.textContent = "CAMERA POWER ON...";
        } else if (progress >= 30 && progress < 60) {
            loader.setAttribute('data-stage', 'tunnel-travel');
            if (milestoneText) milestoneText.textContent = "TUNNEL TRAVERSAL...";
        } else if (progress >= 60 && progress < 90) {
            loader.setAttribute('data-stage', 'light-increase');
            if (milestoneText) milestoneText.textContent = "LIGHT FIELD INTENSIFYING...";
        } else {
            loader.setAttribute('data-stage', 'bright-screen');
            if (milestoneText) milestoneText.textContent = "ENTERING SCOPE 2026...";
        }

        if (progress < 100) {
            requestAnimationFrame(updateProgress);
        } else {
            completeLoading();
        }
    }

    requestAnimationFrame(updateProgress);

    function completeLoading() {
        setTimeout(() => {
            loader.classList.add('flash-burst');
            setTimeout(() => {
                loader.classList.add('fade-out');
                document.body.style.overflow = '';

                if (typeof initHeroAnimations === 'function') {
                    initHeroAnimations();
                }
            }, 150);
        }, 50);
    }
}
