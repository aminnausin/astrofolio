<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps<{ previewId: string }>();

const isPreviewing = ref(false);

let closeListenerAttached = false;

const autoSizePreview = () => {
    const el = document.getElementById(props.previewId);
    if (!el) return;
    el.style.height = el.scrollHeight + "px";
};

const attachCloseListener = () => {
    if (closeListenerAttached) return;
    const button = document.getElementById(`${props.previewId}-close`);
    if (button) {
        button.addEventListener("click", togglePreview);
        closeListenerAttached = true;
    }
};

const togglePreview = () => {
    const el = document.getElementById(props.previewId);
    if (!el) return;
    attachCloseListener();

    isPreviewing.value = !isPreviewing.value;
    if (isPreviewing.value) {
        el.style.height = el.scrollHeight + "px";
        window.addEventListener("resize", autoSizePreview);
    } else {
        el.style.height = "0px";
        window.removeEventListener("resize", autoSizePreview);
    }
};

onMounted(() => {
    attachCloseListener();
});

onUnmounted(() => {
    const button = document.getElementById(`${props.previewId}-close`);
    if (button) button.removeEventListener("click", togglePreview);
    window.removeEventListener("resize", autoSizePreview);
});
</script>

<template>
    <button
        :class="['group hover:text-purple-700 dark:hover:text-purple-600 transition-all flex flex-col cursor-pointer', { 'text-purple-600': isPreviewing }]"
        title="Open Preview"
        @click="togglePreview"
    >
        <slot></slot>
    </button>
</template>
