import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// Setup
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.05); // Add fog for depth

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Better performance
document.body.appendChild(renderer.domElement);

// Geometry - Large floor grid
const geometry = new THREE.PlaneGeometry(100, 100, 60, 60);

// Material - Neon aesthetic
const material = new THREE.MeshStandardMaterial({
    color: 0x00ff88,
    wireframe: true,
    emissive: 0x001100,
    side: THREE.DoubleSide
});

const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = -Math.PI / 2; // Lay flat
mesh.position.y = -2; // Lower slightly
scene.add(mesh);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00ff88, 5, 50);
pointLight.position.set(0, 10, 0);
scene.add(pointLight);

// Mouse interaction
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    // Normalize mouse coordinates (-1 to 1)
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Animation
camera.position.z = 5;
camera.position.y = 1;

function animate() {
    requestAnimationFrame(animate);

    // Parallax effect based on mouse
    const targetX = mouseX * 2;
    const targetY = mouseY * 1 + 1; // Keep it slightly above ground

    // Smooth camera movement
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;

    // Look at center (or slightly ahead)
    camera.lookAt(0, 0, 0);

    // Subtle breathing animation for the grid
    mesh.rotation.z += 0.0005;

    // Animate light position slightly opposite to mouse
    pointLight.position.x = -mouseX * 5;
    pointLight.position.z = -mouseY * 5;

    renderer.render(scene, camera);
}

// Window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
