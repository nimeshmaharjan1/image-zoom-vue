<template>
  <section class="image-viewer d-flex justify-content-center">
    <div class="card mt-4">
      <div class="card-header">
        <h2>Image Viewer</h2>
      </div>
      <div class="card-body">
        <canvas
          id="viewerCanvas"
          width="500"
          height="400"
          style="border: 0.5px solid black"
        ></canvas>
      </div>
      <div class="card-footer">
        <button class="btn btn-primary" @click="toDefault">Reset</button>
      </div>
    </div>
  </section>
</template>
<script setup>
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
// @filename: ImageViewer.js
import { ImageViewer } from "../utils/ImageViewer";
const imageSrc = "src/assets/hello.jpg";
const canvasId = "viewerCanvas";
let myImageViewer = ref(null);
onMounted(() => {
  myImageViewer = new ImageViewer(canvasId, imageSrc);
});
function toDefault() {
  if (myImageViewer !== null) {
    myImageViewer.dispose();
  }
  myImageViewer = new ImageViewer(canvasId, "src/assets/hello.jpg");
}
</script>
<style lang="scss">
.image-viewer {
  margin: auto;
  width: 50%;
}
</style>
