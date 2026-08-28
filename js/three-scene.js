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

    // Initialize 3D Endoscopy Machine Scene for Future of Endoscopy Section
    initEndoscopyMachine3DScene();

    // Initialize 3D Stethoscope Scene for Our Endoscopists Section
    initStethoscope3DScene();
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
 * 3. 3D ENDOSCOPY MACHINE & INSTRUMENT SYSTEM SCENE FOR "THE FUTURE OF ENDOSCOPY" SECTION
 */
function initEndoscopyMachine3DScene() {
    const canvas = document.getElementById('endoscope-machine-webgl-canvas') || document.getElementById('dna-webgl-canvas');
    if (!canvas) return;

    const section = canvas.parentElement;
    let width = section.clientWidth || window.innerWidth;
    let height = section.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 32);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xd97706, 2.0); // Gold accent light
    dirLight.position.set(20, 20, 20);
    scene.add(dirLight);

    const purpleLight = new THREE.PointLight(0x7e22ce, 3.0, 60); // Purple glow
    purpleLight.position.set(-15, -10, 10);
    scene.add(purpleLight);

    const cyanLight = new THREE.PointLight(0x00d2ff, 2.5, 50); // Cyan optic light
    cyanLight.position.set(10, 10, 15);
    scene.add(cyanLight);

    // Master Group for 3D Endoscopy Machine System
    const endoSystemGroup = new THREE.Group();

    // =========================================================================
    // A. ENDOSCOPY TOWER CART & PROCESSOR CONSOLE (Right/Background)
    // =========================================================================
    const towerGroup = new THREE.Group();
    towerGroup.position.set(12, -2, -6);
    towerGroup.rotation.y = -Math.PI / 6;

    // Cart Metallic Frame & Shelves
    const frameMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.8,
        roughness: 0.2
    });

    // 4 Vertical Pillars
    const pillarGeo = new THREE.CylinderGeometry(0.2, 0.2, 22, 16);
    const pPositions = [
        [-4, 0, -3], [4, 0, -3],
        [-4, 0, 3], [4, 0, 3]
    ];
    pPositions.forEach(pos => {
        const pillar = new THREE.Mesh(pillarGeo, frameMat);
        pillar.position.set(...pos);
        towerGroup.add(pillar);
    });

    // 3 Horizontal Shelves
    const shelfGeo = new THREE.BoxGeometry(9, 0.4, 6.8);
    [-8, 0, 7].forEach(y => {
        const shelf = new THREE.Mesh(shelfGeo, frameMat);
        shelf.position.set(0, y, 0);
        towerGroup.add(shelf);
    });

    // Medical HD Monitor Stand & Display
    const monitorGroup = new THREE.Group();
    monitorGroup.position.set(0, 11, 0);

    const screenBezel = new THREE.Mesh(
        new THREE.BoxGeometry(10, 6.5, 0.6),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.7 })
    );
    monitorGroup.add(screenBezel);

    // Procedural Live Telemetry Canvas Texture for Monitor
    const monitorCanvas = document.createElement('canvas');
    monitorCanvas.width = 512;
    monitorCanvas.height = 320;
    const mCtx = monitorCanvas.getContext('2d');

    const drawMonitorScreen = (time) => {
        mCtx.fillStyle = '#070b14';
        mCtx.fillRect(0, 0, 512, 320);

        // Grid lines
        mCtx.strokeStyle = 'rgba(0, 210, 255, 0.15)';
        mCtx.lineWidth = 1;
        for (let x = 0; x < 512; x += 32) {
            mCtx.beginPath(); mCtx.moveTo(x, 0); mCtx.lineTo(x, 320); mCtx.stroke();
        }
        for (let y = 0; y < 320; y += 32) {
            mCtx.beginPath(); mCtx.moveTo(0, y); mCtx.lineTo(512, y); mCtx.stroke();
        }

        // Circular Endoscopic Viewport Target
        mCtx.strokeStyle = '#00d2ff';
        mCtx.lineWidth = 2;
        mCtx.beginPath();
        mCtx.arc(256, 160, 110, 0, Math.PI * 2);
        mCtx.stroke();

        // Inner glowing organic mucosa simulated ring
        const grad = mCtx.createRadialGradient(256, 160, 40, 256, 160, 110);
        grad.addColorStop(0, 'rgba(126, 34, 206, 0.4)');
        grad.addColorStop(0.7, 'rgba(217, 119, 6, 0.3)');
        grad.addColorStop(1, 'rgba(0, 210, 255, 0.1)');
        mCtx.fillStyle = grad;
        mCtx.beginPath();
        mCtx.arc(256, 160, 110, 0, Math.PI * 2);
        mCtx.fill();

        // CADe AI Target Box
        const bx = 220 + Math.sin(time * 1.5) * 20;
        const by = 130 + Math.cos(time * 1.5) * 15;
        mCtx.strokeStyle = '#d97706';
        mCtx.lineWidth = 2;
        mCtx.strokeRect(bx, by, 70, 60);
        mCtx.fillStyle = '#d97706';
        mCtx.font = '10px sans-serif';
        mCtx.fillText('AI CADe: 99.4%', bx, by - 6);

        // HUD Scanline
        const scanY = (time * 120) % 320;
        mCtx.fillStyle = 'rgba(0, 210, 255, 0.25)';
        mCtx.fillRect(0, scanY, 512, 4);

        // Header text
        mCtx.fillStyle = '#ffffff';
        mCtx.font = 'bold 12px sans-serif';
        mCtx.fillText('ENDOSCOPE 4K CAM • LIVE FEED', 20, 26);
    };

    drawMonitorScreen(0);
    const monitorTexture = new THREE.CanvasTexture(monitorCanvas);

    const screenMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(9.4, 5.9),
        new THREE.MeshBasicMaterial({ map: monitorTexture })
    );
    screenMesh.position.z = 0.32;
    monitorGroup.add(screenMesh);
    towerGroup.add(monitorGroup);

    // Video Processor Console Chassis (Middle Shelf)
    const procChassis = new THREE.Mesh(
        new THREE.BoxGeometry(8.2, 4.5, 5.5),
        new THREE.MeshStandardMaterial({ color: 0x1e1b4b, metalness: 0.7, roughness: 0.3 })
    );
    procChassis.position.set(0, 2.4, 0);

    // Illuminated Scope Cable Port / Light Output Ring
    const portRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.7, 0.15, 16, 32),
        new THREE.MeshBasicMaterial({ color: 0x00d2ff })
    );
    portRing.position.set(-2.5, 2.4, 2.8);
    towerGroup.add(portRing);

    // Status LED Lights
    for (let l = 0; l < 4; l++) {
        const led = new THREE.Mesh(
            new THREE.SphereGeometry(0.18, 12, 12),
            new THREE.MeshBasicMaterial({ color: l === 0 ? 0x00ff66 : (l === 1 ? 0x00d2ff : 0xd97706) })
        );
        led.position.set(1 + l * 0.7, 3.8, 2.8);
        towerGroup.add(led);
    }
    towerGroup.add(procChassis);

    // Translucent Liquid Canister (Bottom Shelf)
    const canisterGeo = new THREE.CylinderGeometry(1.2, 1.2, 3.8, 24);
    const canisterMat = new THREE.MeshPhysicalMaterial({
        color: 0x00d2ff,
        transparent: true,
        opacity: 0.45,
        roughness: 0.1,
        transmission: 0.8
    });
    const canister = new THREE.Mesh(canisterGeo, canisterMat);
    canister.position.set(2.2, -5.8, 1);
    towerGroup.add(canister);

    endoSystemGroup.add(towerGroup);

    // =========================================================================
    // B. FLEXIBLE ENDOSCOPE SCOPE INSTRUMENT (Foreground / Center)
    // =========================================================================
    const scopeGroup = new THREE.Group();
    scopeGroup.position.set(-6, -1, 4);

    // 1. Control Handle Base (Handpiece)
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.8 });
    const handleMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.9, 7, 24), handleMat);
    handleMesh.rotation.z = Math.PI / 4;
    scopeGroup.add(handleMesh);

    // Angulation Control Wheels (Dual Stacked Dial Wheels)
    const wheelMat1 = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 });
    const wheelMat2 = new THREE.MeshStandardMaterial({ color: 0x7e22ce, metalness: 0.9, roughness: 0.2 });

    const bigWheel = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.4, 32), wheelMat1);
    bigWheel.position.set(-1.2, 1.2, 0.8);
    bigWheel.rotation.x = Math.PI / 2;
    scopeGroup.add(bigWheel);

    const smallWheel = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.35, 32), wheelMat2);
    smallWheel.position.set(-1.2, 1.2, 1.2);
    smallWheel.rotation.x = Math.PI / 2;
    scopeGroup.add(smallWheel);

    // Suction & Air/Water Valve Buttons
    const valveGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.8, 16);
    const valve1 = new THREE.Mesh(valveGeo, new THREE.MeshBasicMaterial({ color: 0x00d2ff }));
    valve1.position.set(0.6, 2.2, 0.6);
    valve1.rotation.z = -Math.PI / 4;
    scopeGroup.add(valve1);

    const valve2 = new THREE.Mesh(valveGeo, new THREE.MeshBasicMaterial({ color: 0xd97706 }));
    valve2.position.set(1.2, 1.6, 0.6);
    valve2.rotation.z = -Math.PI / 4;
    scopeGroup.add(valve2);

    // 2. Flexible Insertion Tube (Parametric Curve Tube)
    let curvePoints = [
        new THREE.Vector3(-3.5, -3.5, 2),
        new THREE.Vector3(-1.0, -5.5, 0),
        new THREE.Vector3(3.0, -4.0, -2),
        new THREE.Vector3(6.0, -1.0, -1),
        new THREE.Vector3(4.0, 3.5, 3),
        new THREE.Vector3(-2.0, 5.0, 4),
        new THREE.Vector3(-7.0, 2.5, 2),
        new THREE.Vector3(-9.0, -1.0, 1)
    ];

    let scopeCurve = new THREE.CatmullRomCurve3(curvePoints);
    let tubeGeo = new THREE.TubeGeometry(scopeCurve, 100, 0.42, 20, false);
    const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.25,
        metalness: 0.85
    });
    let tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    scopeGroup.add(tubeMesh);

    // 3. Distal Tip & Camera Head (At end of insertion tube)
    const tipGroup = new THREE.Group();
    const tipCap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.48, 0.48, 1.2, 24),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 })
    );
    tipCap.rotation.z = Math.PI / 2;
    tipGroup.add(tipCap);

    // Camera Lens Aperture
    const cameraLens = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x00d2ff })
    );
    cameraLens.position.set(-0.6, 0, 0);
    tipGroup.add(cameraLens);

    // Twin Fiber-Optic LED Illuminator Ports
    [-0.18, 0.18].forEach(zOffset => {
        const ledPort = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, 0.2, 12),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        ledPort.position.set(-0.55, 0.22, zOffset);
        ledPort.rotation.z = Math.PI / 2;
        tipGroup.add(ledPort);
    });

    // 4. Volumetric Illumination Beam Cone (Projected from tip)
    const beamGeo = new THREE.ConeGeometry(3.5, 14, 32, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
        color: 0x00d2ff,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });
    const lightBeam = new THREE.Mesh(beamGeo, beamMat);
    lightBeam.position.set(-7.5, 0, 0);
    lightBeam.rotation.z = Math.PI / 2;
    tipGroup.add(lightBeam);

    // Position Tip Group at curve end
    const lastPoint = scopeCurve.getPoint(1);
    tipGroup.position.copy(lastPoint);
    scopeGroup.add(tipGroup);

    endoSystemGroup.add(scopeGroup);
    scene.add(endoSystemGroup);

    // =========================================================================
    // C. FIBER-OPTIC PULSE PARTICLES & AMBIENT PARTICLES
    // =========================================================================
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0x00d2ff); // Cyan
    const c2 = new THREE.Color(0xd97706); // Amber
    const c3 = new THREE.Color(0x7e22ce); // Purple

    for (let p = 0; p < particleCount; p++) {
        particlePos[p * 3] = (Math.random() - 0.5) * 70;
        particlePos[p * 3 + 1] = (Math.random() - 0.5) * 50;
        particlePos[p * 3 + 2] = (Math.random() - 0.5) * 40;

        const rand = Math.random();
        const col = rand > 0.6 ? c1 : (rand > 0.3 ? c2 : c3);
        particleColors[p * 3] = col.r;
        particleColors[p * 3 + 1] = col.g;
        particleColors[p * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
        size: 1.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Mouse Tracking Parallax
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

    function animateEndoscopyMachine() {
        requestAnimationFrame(animateEndoscopyMachine);
        const elapsedTime = clock.getElapsedTime();

        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        // Smooth breathing & rotation of system
        endoSystemGroup.rotation.y = Math.sin(elapsedTime * 0.3) * 0.08 + mouseX * 0.25;
        endoSystemGroup.rotation.x = Math.cos(elapsedTime * 0.25) * 0.05 + mouseY * 0.15;

        // Control wheels continuous smooth rotation
        bigWheel.rotation.y = elapsedTime * 0.5;
        smallWheel.rotation.y = -elapsedTime * 0.7;

        // Dynamic Tube Flexing Animation
        for (let i = 1; i < curvePoints.length - 1; i++) {
            curvePoints[i].y += Math.sin(elapsedTime * 1.5 + i) * 0.015;
            curvePoints[i].z += Math.cos(elapsedTime * 1.2 + i) * 0.015;
        }
        scopeCurve.points = curvePoints;
        tubeMesh.geometry.dispose();
        tubeMesh.geometry = new THREE.TubeGeometry(scopeCurve, 100, 0.42, 20, false);

        // Update tip position to follow flexible tube end
        const tipPos = scopeCurve.getPoint(1);
        tipGroup.position.copy(tipPos);

        // Light beam pulsation
        lightBeam.material.opacity = 0.25 + Math.sin(elapsedTime * 4) * 0.08;

        // Redraw telemetry screen scanlines & target box
        drawMonitorScreen(elapsedTime);
        monitorTexture.needsUpdate = true;

        // Ambient particles motion
        particleSystem.rotation.y = elapsedTime * 0.03;

        renderer.render(scene, camera);
    }

    animateEndoscopyMachine();
}

/**
 * Backwards compatibility alias for initDNA3DScene
 */
function initDNA3DScene() {
    initEndoscopyMachine3DScene();
}

/**
 * 4. 3D STETHOSCOPE & NANOTECH CONSTELLATION SCENE FOR SECTIONS WITH STETHOSCOPE BACKGROUND
 */
function initStethoscope3DScene() {
    const canvases = document.querySelectorAll('.stethoscope-bg-canvas');
    if (!canvases || canvases.length === 0) return;

    canvases.forEach(canvas => {
        setupSingleStethoscopeCanvas(canvas);
    });
}

function setupSingleStethoscopeCanvas(canvas) {
    const section = canvas.parentElement;
    let width = section.clientWidth || window.innerWidth;
    let height = section.clientHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 35);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00d2ff, 3.5, 60);
    cyanLight.position.set(15, 10, 15);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0x7e22ce, 3.0, 60);
    purpleLight.position.set(-15, -10, 15);
    scene.add(purpleLight);

    const goldLight = new THREE.DirectionalLight(0xd97706, 1.8);
    goldLight.position.set(0, 20, 10);
    scene.add(goldLight);

    // Master Group for 3D Stethoscope Model
    const stethoGroup = new THREE.Group();

    // =========================================================================
    // A. 3D STETHOSCOPE CHESTPIECE & DIAPHRAGM HEAD
    // =========================================================================
    const chestpieceGroup = new THREE.Group();

    // Metallic Outer Disc Frame (Chrome / Dark Slate)
    const chestMat = new THREE.MeshStandardMaterial({
        color: 0x00d2ff,
        emissive: 0x003344,
        metalness: 0.95,
        roughness: 0.15
    });
    const outerRing = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 0.9, 32), chestMat);
    chestpieceGroup.add(outerRing);

    // Glowing Inner Diaphragm Disc (Cyan Glass Glow)
    const diaMat = new THREE.MeshBasicMaterial({
        color: 0x00d2ff,
        transparent: true,
        opacity: 0.85
    });
    const diaphragm = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 0.95, 32), diaMat);
    chestpieceGroup.add(diaphragm);

    // Diaphragm Center Light Pulse Ring
    const pulseRing = new THREE.Mesh(
        new THREE.TorusGeometry(2.2, 0.18, 16, 32),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    pulseRing.rotation.x = Math.PI / 2;
    pulseRing.position.y = 0.48;
    chestpieceGroup.add(pulseRing);

    // Rear Bell Cone
    const bellMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(2.4, 3.5, 1.4, 24),
        chestMat
    );
    bellMesh.position.y = -1.0;
    chestpieceGroup.add(bellMesh);

    // Stem Connector Pipe
    const stemMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 2.5, 16),
        chestMat
    );
    stemMesh.position.set(0, -2.5, 0);
    chestpieceGroup.add(stemMesh);

    chestpieceGroup.position.set(-14, 4, 2);
    chestpieceGroup.rotation.x = Math.PI / 3;
    chestpieceGroup.rotation.z = -Math.PI / 6;
    stethoGroup.add(chestpieceGroup);

    // =========================================================================
    // B. FLEXIBLE FIBER-OPTIC TUBING LOOPS
    // =========================================================================
    let curvePoints = [
        new THREE.Vector3(-14, 1.5, 2),
        new THREE.Vector3(-10, -5, 1),
        new THREE.Vector3(-2, -9, 3),
        new THREE.Vector3(8, -6, -2),
        new THREE.Vector3(14, 2, 4),
        new THREE.Vector3(6, 9, 1),
        new THREE.Vector3(-4, 7, -3),
        new THREE.Vector3(-8, 1, 0),
        new THREE.Vector3(2, -4, 2),
        new THREE.Vector3(12, -2, -1)
    ];

    let tubeCurve = new THREE.CatmullRomCurve3(curvePoints);
    let tubeGeo = new THREE.TubeGeometry(tubeCurve, 140, 0.5, 24, false);
    const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.2,
        metalness: 0.95
    });
    let tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    stethoGroup.add(tubeMesh);

    // Glowing Fiber-Optic Accent Ring Wraps along Tubing
    const accentRings = new THREE.Group();
    for (let r = 0; r < 12; r++) {
        const t = r / 12;
        const pt = tubeCurve.getPoint(t);
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.6, 0.12, 16, 24),
            new THREE.MeshBasicMaterial({ color: r % 2 === 0 ? 0x00d2ff : 0x7e22ce })
        );
        ring.position.copy(pt);
        accentRings.add(ring);
    }
    stethoGroup.add(accentRings);

    // =========================================================================
    // C. BINAURAL HEADSET TUBES & EARTIPS (Right Top End)
    // =========================================================================
    const headsetGroup = new THREE.Group();
    headsetGroup.position.set(12, -2, -1);

    const metalTubeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });
    
    // Left & Right Chrome Binaural Arm Tubes
    const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 8, 16), metalTubeMat);
    arm1.position.set(-1.5, 4, 0);
    arm1.rotation.z = Math.PI / 8;
    headsetGroup.add(arm1);

    const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 8, 16), metalTubeMat);
    arm2.position.set(1.5, 4, 0);
    arm2.rotation.z = -Math.PI / 8;
    headsetGroup.add(arm2);

    // Eartips
    const earTipMat = new THREE.MeshStandardMaterial({ color: 0x00d2ff, roughness: 0.3 });
    const earTip1 = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 16), earTipMat);
    earTip1.position.set(-3.0, 7.8, 0);
    headsetGroup.add(earTip1);

    const earTip2 = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 16), earTipMat);
    earTip2.position.set(3.0, 7.8, 0);
    headsetGroup.add(earTip2);

    stethoGroup.add(headsetGroup);
    scene.add(stethoGroup);

    // =========================================================================
    // D. BIO-TECH NANOTECH CONSTELLATION & FLOATING HEX GRID
    // =========================================================================
    const particleCount = 450;
    const pGeometry = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);

    const colorCyan = new THREE.Color(0x00d2ff);
    const colorPurple = new THREE.Color(0x7e22ce);
    const colorAmber = new THREE.Color(0xd97706);

    for (let i = 0; i < particleCount; i++) {
        pPositions[i * 3] = (Math.random() - 0.5) * 80;
        pPositions[i * 3 + 1] = (Math.random() - 0.5) * 55;
        pPositions[i * 3 + 2] = (Math.random() - 0.5) * 45;

        const rand = Math.random();
        const c = rand > 0.6 ? colorCyan : (rand > 0.3 ? colorPurple : colorAmber);
        pColors[i * 3] = c.r;
        pColors[i * 3 + 1] = c.g;
        pColors[i * 3 + 2] = c.b;
    }

    pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    pGeometry.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const pMaterial = new THREE.PointsMaterial({
        size: 1.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    const pSystem = new THREE.Points(pGeometry, pMaterial);
    scene.add(pSystem);

    // Floating 3D Wireframe Hexagons
    const hexGroup = new THREE.Group();
    for (let h = 0; h < 6; h++) {
        const hexGeo = new THREE.CircleGeometry(2.5 + h * 0.8, 6);
        const hexWireMat = new THREE.MeshBasicMaterial({
            color: h % 2 === 0 ? 0x00d2ff : 0x7e22ce,
            wireframe: true,
            transparent: true,
            opacity: 0.25
        });
        const hexMesh = new THREE.Mesh(hexGeo, hexWireMat);
        hexMesh.position.set((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 40, -10 + h * 2);
        hexGroup.add(hexMesh);
    }
    scene.add(hexGroup);

    // Mouse Tracking Parallax
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
        height = section.clientHeight || 600;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    let clock = new THREE.Clock();

    function animateStethoscope() {
        requestAnimationFrame(animateStethoscope);
        const elapsedTime = clock.getElapsedTime();

        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        // Smooth continuous 3D breathing rotation & mouse parallax tilt
        stethoGroup.rotation.y = Math.sin(elapsedTime * 0.35) * 0.08 + mouseX * 0.25;
        stethoGroup.rotation.x = Math.cos(elapsedTime * 0.3) * 0.06 + mouseY * 0.15;

        // Chestpiece light pulse glow oscillation
        pulseRing.scale.setScalar(1 + Math.sin(elapsedTime * 3) * 0.15);
        diaphragm.material.opacity = 0.75 + Math.sin(elapsedTime * 2.5) * 0.15;

        // Dynamic Tubing Flexing Animation
        for (let i = 1; i < curvePoints.length - 1; i++) {
            curvePoints[i].y += Math.sin(elapsedTime * 1.6 + i) * 0.015;
            curvePoints[i].z += Math.cos(elapsedTime * 1.4 + i) * 0.015;
        }
        tubeCurve.points = curvePoints;
        tubeMesh.geometry.dispose();
        tubeMesh.geometry = new THREE.TubeGeometry(tubeCurve, 140, 0.5, 24, false);

        // Update accent ring positions along flexing curve
        for (let r = 0; r < accentRings.children.length; r++) {
            const ring = accentRings.children[r];
            const t = r / accentRings.children.length;
            const pt = tubeCurve.getPoint(t);
            ring.position.copy(pt);
            ring.rotation.y = elapsedTime + r;
        }

        // Particle System Motion
        pSystem.rotation.y = elapsedTime * 0.03;
        hexGroup.rotation.z = elapsedTime * 0.05;

        renderer.render(scene, camera);
    }

    animateStethoscope();
}
