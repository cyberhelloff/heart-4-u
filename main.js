import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class LoveScene {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('love-scene'),
            antialias: true,
            alpha: true
        });
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.init();
        this.createParticles();
        this.addLighting();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(this.isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
        this.camera.position.z = 5;

        // Adjust particle count for mobile
        this.particlesCount = this.isMobile ? 1000 : 2000;
    }

    createParticles() {
        const particlesCount = this.particlesCount;
        const positions = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);

        for(let i = 0; i < particlesCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 10;
            positions[i + 1] = (Math.random() - 0.5) * 10;
            positions[i + 2] = (Math.random() - 0.5) * 10;

            colors[i] = Math.random();
            colors[i + 1] = Math.random() * 0.5;
            colors[i + 2] = Math.random() * 0.5 + 0.5;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    addLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const pointLight = new THREE.PointLight(0xff69b4, 2);
        pointLight.position.set(5, 5, 5);
        
        this.scene.add(ambientLight, pointLight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.particles.rotation.x += 0.001;
        this.particles.rotation.y += 0.002;

        const positions = this.particles.geometry.attributes.position.array;
        const time = Date.now() * 0.001;

        for(let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(time + positions[i]) * 0.002;
            positions[i] += Math.cos(time + positions[i + 2]) * 0.002;
        }

        this.particles.geometry.attributes.position.needsUpdate = true;
        this.renderer.render(this.scene, this.camera);
    }

    setupEventListeners() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            // Debounce resize events
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            }, 250);
        });

        // Add touch event support
        const loveButton = document.getElementById('loveButton');
        loveButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.createHeartBurst();
            this.pulseParticles();
        });
    }

    createHeartBurst() {
        for(let i = 0; i < 20; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.className = 'floating-heart';
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.transform = `translate(-50%, -50%) scale(${Math.random() * 0.5 + 0.5})`;
            document.body.appendChild(heart);

            setTimeout(() => heart.remove(), 4000);
        }
    }

    pulseParticles() {
        const duration = 0.5;
        const scale = { value: 1 };
        
        gsap.to(scale, {
            value: 1.5,
            duration: duration / 2,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
            onUpdate: () => {
                this.particles.scale.set(scale.value, scale.value, scale.value);
            }
        });

        document.querySelector('.glow-effect').style.opacity = '1';
        setTimeout(() => {
            document.querySelector('.glow-effect').style.opacity = '0';
        }, duration * 1000);
    }
}

new LoveScene();
