<script setup lang="ts">
import { onMounted, useTemplateRef, ref, onUnmounted } from "vue";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";

import * as THREE from "three";

type CelestialBody = {
    group: THREE.Group;
    update: () => void;
};

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let composer: EffectComposer;

const starColours = {
    light: 0x111111,
    dark: 0xffffff,
    darkMoon: new THREE.Color(0xaaaaaa).multiplyScalar(3),
};

const sceneColours = {
    light: 0xffffff,
    dark: 0x010101,
};

const baseMaterial = {
    size: 1.5,
    sizeAttenuation: true,
    color: starColours.dark,
    transparent: true,
    blending: THREE.NormalBlending,
};

const starCount = 200;

const canvas = useTemplateRef("canvas");
const isDark = ref(false);

const starMaterial = ref<THREE.PointsMaterial>();
const moonMaterial = ref<THREE.PointsMaterial>();
const initBloom = () => {
    const renderScene = new RenderPass(scene, camera);

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        2, // strength
        0.4, // radius
        0.75 // threshold
    );

    composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
};

const initStarfield = () => {
    if (!scene || !camera || !renderer) return;

    // STAR PARTICLES
    const starsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 2000;
    }

    starsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starMaterial.value = new THREE.PointsMaterial({
        ...baseMaterial,
        color: isDark.value ? starColours.dark : starColours.light,
        blending: isDark.value ? THREE.AdditiveBlending : THREE.NormalBlending,
    });

    const { group: marsGroup, update: updateMarsMoons } = generateBodyWithMoons(new THREE.Color(0xcc5500).multiplyScalar(4), 2, 2);
    const { group: jupiterGroup, update: updateJupiterMoons } = generateBodyWithMoons(new THREE.Color(0xd8b384).multiplyScalar(3.5), 4, 3);
    // const uranus = generateBodyWithRings(new THREE.Color(0x66ffff).multiplyScalar(2.5), 2, 2, 0.4, 0x88aaff);
    // const saturn = generateBodyWithRings(new THREE.Color(0xf1c27d).multiplyScalar(3.8), 2, 1, 0.3, 0xffffff);
    const stars = new THREE.Points(starsGeometry, starMaterial.value);

    stars.add(marsGroup);
    stars.add(jupiterGroup);
    // stars.add(uranus);
    // stars.add(saturn);
    scene.add(stars);

    function animateScene() {
        if (!scene || !camera || !renderer) return;
        requestAnimationFrame(animateScene);

        updateMarsMoons();
        updateJupiterMoons();
        stars.rotation.y += 0.0002;

        if (isDark.value) {
            composer.render();
            return;
        }

        renderer.render(scene, camera);
    }

    animateScene();
    window.addEventListener("resize", resizeCanvas);
};

const generateParticle = (
    material: THREE.PointsMaterial,
    position: [number, number, number] = [(Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000]
): THREE.Points<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.PointsMaterial, THREE.Object3DEventMap> => {
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(position), 3));
    return new THREE.Points(geometry, material);
};

const generateBodyWithMoons = (bodyColour: THREE.Color, size: number = 2, moonCount: number = 1): CelestialBody => {
    const center: [number, number, number] = [(Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000];

    const group = new THREE.Group();

    const body = generateParticle(
        new THREE.PointsMaterial({
            ...baseMaterial,
            size,
            color: bodyColour,
        }),
        [0, 0, 0]
    );
    group.position.set(...center);
    group.add(body);

    const orbitGroups: THREE.Group[] = [];

    if (!moonMaterial.value) {
        moonMaterial.value = new THREE.PointsMaterial({
            ...baseMaterial,
            size: 1,
            color: isDark.value ? starColours.darkMoon : starColours.light,
            transparent: true,
        });
    }

    for (let i = 0; i < moonCount; i++) {
        const radius = size + 5 + Math.random() * 2 * size;
        const speed = 0.005 + Math.random() * 0.01;

        const axis = new THREE.Vector3(0, 1, 0).normalize();
        const xRotation = Math.random() * 360;
        const zRotation = Math.random() * 360;

        // orbiting moon
        const moon = generateParticle(moonMaterial.value, [radius, 0, 0]);

        // orbit ring
        const trailGeometry = new THREE.RingGeometry(radius - 0.05, radius + 0.05, 64);
        const trailMaterial = new THREE.MeshBasicMaterial({
            color: 0x343434,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide,
        });
        const trail = new THREE.Mesh(trailGeometry, trailMaterial);
        trail.rotation.x = Math.PI / 2; // default flat ring

        const orbitGroup = new THREE.Group();
        orbitGroup.userData = { speed, axis };
        orbitGroup.rotateOnAxis(new THREE.Vector3(1, 0, 0), xRotation);
        orbitGroup.rotateOnAxis(new THREE.Vector3(0, 0, 1), zRotation);
        orbitGroup.add(moon);
        orbitGroup.add(trail);

        group.add(orbitGroup);
        orbitGroups.push(orbitGroup);
    }

    const update = () => {
        orbitGroups.forEach((group) => {
            const { speed, axis } = group.userData;
            group.rotateOnAxis(axis, speed);
        });
    };

    return {
        group,
        update,
    };
};

const generateBodyWithRings = (
    bodyColour: THREE.Color,
    size: number = 2,
    ringCount: number = 1,
    ringOpacity: number = 0.5,
    ringColor: THREE.ColorRepresentation = 0x343434
): THREE.Group<THREE.Object3DEventMap> => {
    const center: [number, number, number] = [(Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000];

    const group = new THREE.Group();

    const body = generateParticle(
        new THREE.PointsMaterial({
            ...baseMaterial,
            size,
            color: bodyColour,
        }),
        [0, 0, 0]
    );
    group.position.set(...center);
    group.add(body);

    for (let i = 0; i < ringCount; i++) {
        const radius = size + 5 + Math.random() * 2 * size;

        const xRotation = Math.random() * 360;
        const zRotation = Math.random() * 360;

        const trailGeometry = new THREE.RingGeometry(radius - 0.3, radius + 0.3, 128);
        const trailMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(ringColor).multiplyScalar(0.1),
            transparent: true,
            opacity: ringOpacity,
            side: THREE.DoubleSide,
        });
        const trail = new THREE.Mesh(trailGeometry, trailMaterial);
        trail.rotation.x = Math.PI / 2;

        const orbitGroup = new THREE.Group();
        orbitGroup.rotateOnAxis(new THREE.Vector3(1, 0, 0), xRotation);
        orbitGroup.rotateOnAxis(new THREE.Vector3(0, 0, 1), zRotation);
        orbitGroup.add(trail);

        group.add(orbitGroup);
    }

    return group;
};

const toggleStarColour = () => {
    if (!starMaterial.value || !renderer) return;

    starMaterial.value.color.set(isDark.value ? starColours.dark : starColours.light);
    starMaterial.value.blending = isDark.value ? THREE.AdditiveBlending : THREE.NormalBlending;

    if (moonMaterial.value) {
        moonMaterial.value.color.set(isDark.value ? starColours.darkMoon : starColours.light);
        moonMaterial.value.blending = isDark.value ? THREE.AdditiveBlending : THREE.NormalBlending;
    }
    renderer.setClearColor(isDark.value ? sceneColours.dark : sceneColours.light, 1);
};

function initThemeObserver() {
    isDark.value = document.documentElement.classList.contains("dark");

    const observer = new MutationObserver(() => {
        isDark.value = document.documentElement.classList.contains("dark");
        toggleStarColour();
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
    });
}

function initScene() {
    if (!canvas.value) return;
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
    renderer = new THREE.WebGLRenderer({
        canvas: canvas.value,
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
    });
    scene = new THREE.Scene();

    camera.position.z = 500;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(isDark.value ? sceneColours.dark : sceneColours.light, 1);
}

function resizeCanvas() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
}

onMounted(() => {
    initThemeObserver();
    initScene();
    initBloom();
    initStarfield();
});

onUnmounted(() => {
    window.removeEventListener("resize", resizeCanvas);
});
</script>

<template>
    <canvas ref="canvas" class="fixed w-full h-full -z-20 top-0 left-0"></canvas>
</template>
