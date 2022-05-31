<template>
  <div class="card mt-3">
    <div class="card-header" v-if="header">
      <h1>V-viewer</h1>
    </div>
    <div class="card-body">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "@vue/reactivity";

const props = defineProps({
  header: String,
});
</script>
