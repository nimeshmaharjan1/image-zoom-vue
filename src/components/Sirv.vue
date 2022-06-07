<template>
  <section class="sirv-section" style="margin: auto; width: 50%">
    <div class="card mt-4">
      <div class="card-header">
        <h1>Sirv</h1>
      </div>
      <div class="card-body">
        <div
          class="Sirv"
          data-options="fullscreen: false;zoom-on-wheel: false;map: false;mapSize: 20;"
          data-effect="zoom"
          style="border: 1px solid black"
        >
          <img
            data-src="https://olklysau.sirv.com/Images/pexels-irina-iriser-1379636.jpg"
          />
        </div>
      </div>
    </div>
  </section>
</template>
<style lang="scss">
.Sirv {
  position: relative;
  .sirv-zoom-nav-controls {
    position: absolute;
    top: 22.5rem;
    display: flex !important;
    align-items: center;
    width: 100%;
    justify-content: end;
    gap: 0.5rem;
  }
}
</style>
<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";

onMounted(() => {
  const sirvButton = document.querySelector(".Sirv");
  console.log(sirvButton);
  sirvButton?.classList.remove("sirv-zoom-button-zoom-in");
});
</script>
