<script setup lang="ts">
import { onMounted, useTemplateRef, ref, onUnmounted } from "vue";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";

import * as THREE from "three";

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let composer: EffectComposer;

const initBloom = () => {
    const renderScene = new RenderPass(scene, camera);

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        2, // strength
        0.4, // radius
        0.85 // threshold
    );

    composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
};

const starColours = {
    light: 0x111111,
    dark: 0xffffff,
};

const sceneColours = {
    light: 0xffffff,
    dark: 0x010101,
};

const starCount = 200;

const starMaterial = ref<THREE.PointsMaterial>();
const canvas = useTemplateRef("canvas");
const isDark = ref(false);

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
        size: 1.5,
        sizeAttenuation: true,
        color: isDark.value ? starColours.dark : starColours.light,
        transparent: true,
        blending: isDark.value ? THREE.AdditiveBlending : THREE.NormalBlending,
    });

    const stars = new THREE.Points(starsGeometry, starMaterial.value);
    scene.add(stars);

    function animateScene(time: number) {
        if (!scene || !camera || !renderer) return;
        requestAnimationFrame(animateScene);

        stars.rotation.y += 0.0002;

        if (isDark.value) {
            composer.render();
            return;
        }

        renderer.render(scene, camera);
    }

    animateScene(0);
    window.addEventListener("resize", resizeCanvas);
};

const toggleStarColour = () => {
    if (!starMaterial.value || !renderer) return;
    starMaterial.value.color.set(isDark.value ? starColours.dark : starColours.light);
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
