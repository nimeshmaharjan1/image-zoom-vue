<script setup lang="ts">
import { ref } from "@vue/reactivity";
import Card from "./components/Card.vue";
import { useCounterStore } from "./stores/counter";
import Image from "./components/Image.vue";
import Vviewer from "./components/Vviewer.vue";
import Sirv from "./components/Sirv.vue";
const counterStore = useCounterStore();
</script>

<template>
  <main class="container">
    <Sirv />
    <Image />
    <Vviewer />
    <!-- <section class="img-zoom mt-4">
      <ImageZoom />
    </section> -->
  </main>
  <!-- <main class="container">
    <div class="row justify-content-center">
      <Card class="w-50">
        <h1>Counter</h1>
        <hr />
        <div class="text-center my-4">
          <h3>{{ counterStore.counter }}</h3>
        </div>
        <div class="d-flex gap-2 align-items-center justify-content-center">
          <button class="btn btn-primary" @click="counterStore.increaseCounter">
            +
          </button>
          <button class="btn btn-danger" @click="counterStore.decreaseCounter">
            -
          </button>
        </div>
      </Card>
    </div>
  </main> -->
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
