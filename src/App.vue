<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { useCounterStore } from "./stores/counter";
import ImageViewer from "./components/ImageViewer.vue";
const counterStore = useCounterStore();
</script>

<template>
  <main class="container">
    <ImageViewer />
  </main>
</template>

<style lang="scss">
.viewer-prev,
.viewer-next,
.viewer-one-to-one,
.viewer-play,
.viewer-large,
.viewer-rotate-left,
.viewer-rotate-right,
.viewer-flip-horizontal,
.viewer-flip-vertical {
  display: none !important;
}
</style>
