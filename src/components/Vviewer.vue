<script setup lang="ts">
import { ref } from "@vue/reactivity";
import Card from "./Card.vue";

const imageSrc = ref("@/assets/pexels-irina-iriser-1379636.jpg");
const options = ref({
  inline: false,
  button: true,
  navbar: false,
  title: false,
  toolbar: true,
  tooltip: false,
  movable: true,
  zoomable: true,
  rotatable: true,
  scalable: true,
  transition: true,
  fullscreen: true,
  keyboard: true,
});
</script>
<template>
  <section class="container my-4 v-viewer d-flex justify-content-center">
    <!-- <viewer :image="imageSrc">
      <img src="./assets/pexels-irina-iriser-1379636.jpg" />
    </viewer> -->
    <Card class="w-50 text-center" header="Hello">
      <div
        class="images"
        v-viewer.static="{
          inline: false,
          zoomable: options.zoomable,
          navbar: false,
          title: false,
          toolbar: true,
          tooltip: false,
          transition: true,
          keyboard: true,
        }"
      >
        <img src="@/assets/pexels-irina-iriser-1379636.jpg" />\
      </div>
    </Card>
  </section>
</template>
<style lang="scss" scoped>
img {
  cursor: pointer;
  max-width: 500px;
  max-height: 500px;
}
</style>
