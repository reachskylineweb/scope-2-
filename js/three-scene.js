/* ==========================================================================
   NATIONAL ENDOSCOPY CONFERENCE 2026 - THREE.JS 3D SCENES
   Interactive Particle Universe & Abstract Endoscopic Optics Representation
   Color Theme: #003f11 (Deep Green), #bf1616 (Crimson Red), #ffce00 (Vibrant Yellow)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.warn('Three.js library not detected. Skipping 3D scenes initialization.');
        return;
    }

    // Initialize Hero 3D Scene
    initHero3DScene();

    // Initialize Tech 3D Scene (if container exists)
    initTech3DScene();

    // Initialize 3D DNA Double Helix Scene for Future of Endoscopy Section
    initDNA3DScene();
});

/**
 * 1. HERO 3D SCENE - Floating Nanotech Medical Particle Field & Light Rays
 */
function initHero3DScene() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    const container = canvas.parentElement;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle Cloud Geometry
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 350 : 850;
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorPrimary = new THREE.Color(0x7e22ce); // Royal Imperial Purple
    const colorSecondary = new THREE.Color(0xd97706); // Warm Amber Gold
    const colorAccent = new THREE.Color(0x1e1b4b); // Imperial Navy Accent

    for (let i = 0; i < particleCount; i++) {
        // Distributed in cylindrical/spherical field
        positions[i * 3] = (Math.random() - 0.5) * 60;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

        // Color blending
        const rand = Math.random();
        const mixedColor = rand > 0.6 ? colorSecondary : (rand > 0.3 ? colorAccent : colorPrimary);
        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;

        sizes[i] = Math.random() * 2.5 + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Create glowing particle texture via Canvas
    const createParticleTexture = () => {
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 64;
        pCanvas.height = 64;
        const ctx = pCanvas.getContext('2d');
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.3, 'rgba(217,119,6,0.8)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(pCanvas);
    };

    const material = new THREE.PointsMaterial({
        size: 1.2,
        vertexColors: true,
        map: createParticleTexture(),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // Add Abstract Fiber-Optic Ring Structures
    const ringGroup = new THREE.Group();
    for (let r = 0; r < 4; r++) {
        const ringGeo = new THREE.TorusGeometry(8 + r * 3, 0.08, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({
            color: r % 2 === 0 ? 0xd97706 : 0x7e22ce,
            wireframe: true,
            transparent: true,
            opacity: 0.3 - r * 0.05
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 3;
        ringMesh.rotation.y = (r * Math.PI) / 6;
        ringGroup.add(ringMesh);
    }
    scene.add(ringGroup);

    // Mouse Tracking & Lerp Interpolation
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    window.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // Window Resize Handler
    window.addEventListener('resize', () => {
        width = container.clientWidth || window.innerWidth;
        height = container.clientHeight || window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Animation Loop
    let clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Smooth Mouse Lerp
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        // Particle System Motion
        particleSystem.rotation.y = elapsedTime * 0.03 + mouseX * 0.2;
        particleSystem.rotation.x = elapsedTime * 0.02 + mouseY * 0.2;

        // Ring Rotation
        ringGroup.rotation.z = elapsedTime * 0.1;
        ringGroup.rotation.y = mouseX * 0.3;

        // Scroll response
        const scrollY = window.scrollY;
        camera.position.y = -scrollY * 0.01;

        renderer.render(scene, camera);
    }

    animate();
}

/**
 * 2. TECH 3D SCENE - Abstract Endoscopic Lens & Tube Technology Visualizer
 */
function initTech3DScene() {
    const canvas = document.getElementById('tech-webgl-canvas');
    if (!canvas) return;

    const container = canvas.parentElement;
    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xd97706, 3, 50);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x7e22ce, 2, 50);
    pointLight2.position.set(-10, -10, 5);
    scene.add(pointLight2);

    // Abstract Endoscope Tube & Lens Assembly Group
    const endoscopeGroup = new THREE.Group();

    // 1. Cylindrical Fiber-Optic Tube Body
    const tubeGeo = new THREE.CylinderGeometry(2, 2, 10, 32, 1, true);
    const tubeMat = new THREE.MeshPhongMaterial({
        color: 0x1e1b4b,
        emissive: 0x0f172a,
        specular: 0xd97706,
        shininess: 80,
        wireframe: true,
        transparent: true,
        opacity: 0.75
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    tubeMesh.rotation.z = Math.PI / 2;
    endoscopeGroup.add(tubeMesh);

    // 2. Optical Lens Rings
    for (let i = 0; i < 5; i++) {
        const lensRingGeo = new THREE.TorusGeometry(2.1 + i * 0.15, 0.06, 16, 64);
        const lensRingMat = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0xd97706 : 0x7e22ce,
            transparent: true,
            opacity: 0.95
        });
        const lensRing = new THREE.Mesh(lensRingGeo, lensRingMat);
        lensRing.position.x = -4 + i * 2;
        lensRing.rotation.y = Math.PI / 2;
        endoscopeGroup.add(lensRing);
    }

    // 3. Central Glowing Light Core (Camera Sensor Core)
    const coreGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
        color: 0xd97706,
        wireframe: true,
        transparent: true,
        opacity: 0.95
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    endoscopeGroup.add(coreMesh);

    scene.add(endoscopeGroup);

    // Mouse tilt interaction
    let mouseX = 0;
    let mouseY = 0;

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / container.clientWidth - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / container.clientHeight - 0.5) * 2;
    });

    window.addEventListener('resize', () => {
        width = container.clientWidth;
        height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    let clock = new THREE.Clock();

    function animateTech() {
        requestAnimationFrame(animateTech);
        const elapsedTime = clock.getElapsedTime();

        endoscopeGroup.rotation.y = elapsedTime * 0.4 + mouseX * 0.5;
        endoscopeGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.2 + mouseY * 0.5;
        coreMesh.rotation.z = elapsedTime * 0.8;

        renderer.render(scene, camera);
    }

    animateTech();
}

/**
 * 3. 3D DNA DOUBLE HELIX SCENE FOR "THE FUTURE OF ENDOSCOPY" SECTION
 */
function initDNA3DScene() {
    const canvas = document.getElementById('dna-webgl-canvas');
    if (!canvas) return;

    const section = canvas.parentElement;
    let width = section.clientWidth || window.innerWidth;
    let height = section.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 36);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // DNA Group
    const dnaGroup = new THREE.Group();

    // Create 3D DNA Double Helix Parameters
    const numPairs = 42;
    const radius = 6.5;
    const heightStep = 0.9;
    const twistStep = 0.3;

    const sphereGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const cylinderGeo = new THREE.CylinderGeometry(0.1, 0.1, 1, 12);

    const matStrand1 = new THREE.MeshBasicMaterial({ color: 0x7e22ce }); // Imperial Purple
    const matStrand2 = new THREE.MeshBasicMaterial({ color: 0x00d2ff }); // Neon Cyan
    const matRung = new THREE.MeshBasicMaterial({ color: 0xd97706, transparent: true, opacity: 0.85 }); // Amber Gold

    for (let i = 0; i < numPairs; i++) {
        const y = (i - numPairs / 2) * heightStep;
        const angle = i * twistStep;

        // Position of Strand 1
        const x1 = Math.cos(angle) * radius;
        const z1 = Math.sin(angle) * radius;

        // Position of Strand 2 (180 degrees opposite)
        const x2 = Math.cos(angle + Math.PI) * radius;
        const z2 = Math.sin(angle + Math.PI) * radius;

        // Node Sphere 1
        const node1 = new THREE.Mesh(sphereGeo, matStrand1);
        node1.position.set(x1, y, z1);
        dnaGroup.add(node1);

        // Node Sphere 2
        const node2 = new THREE.Mesh(sphereGeo, matStrand2);
        node2.position.set(x2, y, z2);
        dnaGroup.add(node2);

        // Connecting Rung Cylinder
        const rungMesh = new THREE.Mesh(cylinderGeo, matRung);
        const rungLength = radius * 2;
        rungMesh.scale.set(1, rungLength, 1);
        rungMesh.position.set(0, y, 0);
        rungMesh.rotation.z = Math.PI / 2;
        rungMesh.rotation.y = -angle;
        dnaGroup.add(rungMesh);
    }

    // Tilt DNA Helix diagonally
    dnaGroup.rotation.z = Math.PI / 6;
    scene.add(dnaGroup);

    // Particle Cloud Background Ambient Glow
    const pGeometry = new THREE.BufferGeometry();
    const pCount = 250;
    const pPositions = new Float32Array(pCount * 3);
    for (let p = 0; p < pCount * 3; p++) {
        pPositions[p] = (Math.random() - 0.5) * 65;
    }
    pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMaterial = new THREE.PointsMaterial({
        size: 0.9,
        color: 0x7e22ce,
        transparent: true,
        opacity: 0.45
    });
    const pSystem = new THREE.Points(pGeometry, pMaterial);
    scene.add(pSystem);

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    window.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    window.addEventListener('resize', () => {
        width = section.clientWidth || window.innerWidth;
        height = section.clientHeight || 500;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    let clock = new THREE.Clock();

    function animateDNA() {
        requestAnimationFrame(animateDNA);
        const elapsedTime = clock.getElapsedTime();

        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        // Continuous 3D rotation of DNA Double Helix
        dnaGroup.rotation.y = elapsedTime * 0.35 + mouseX * 0.3;
        dnaGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.15 + mouseY * 0.2;

        pSystem.rotation.y = elapsedTime * 0.04;

        renderer.render(scene, camera);
    }

    animateDNA();
}
