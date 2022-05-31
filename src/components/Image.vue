<template>
  <section class="d-flex justify-content-center">
    <div class="card mt-4 w-50">
      <div class="card-header">Image Zoom</div>
      <div class="card-body">
        <div class="d-flex justify-content-center">
          <figure
            class="zoom"
            style="
              background-image: url(//res.cloudinary.com/active-bridge/image/upload/slide1.jpg);
            "
            @mousemove="zoom($event)"
          >
            <img
              src="//res.cloudinary.com/active-bridge/image/upload/slide1.jpg"
            />
          </figure>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity";
const zoom = (e: any) => {
  let zoomer = e.currentTarget;
  let offsetX;
  let offsetY;
  let x;
  let y;
  e.offsetX ? (offsetX = e.offsetX) : (offsetX = e.touches[0].pageX);
  e.offsetY ? (offsetY = e.offsetY) : (offsetX = e.touches[0].pageX);
  x = (offsetX / zoomer.offsetWidth) * 100;
  y = (offsetY / zoomer.offsetHeight) * 100;
  zoomer.style.backgroundPosition = x + "% " + y + "%";
};
</script>
<style lang="scss">
figure.zoom {
  & img:hover {
    opacity: 0;
  }
  img {
    transition: opacity 0.5s;
    display: block;
    width: 100%;
  }
  background-position: 50% 50%;
  position: relative;
  width: 500px;
  overflow: hidden;
  cursor: zoom-in;
}
</style>
