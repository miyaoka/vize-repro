<script setup lang="ts">
// Imported refs. Vue unwraps top-level refs (local or imported) in the template,
// so `fontSize` is `number` and `theme` is the object here.
import { fontSize, theme } from "./store";
</script>

<template>
  <!-- vue-tsc: OK. vize: fontSize / theme stay `Ref<...>` (not unwrapped). -->
  <div v-if="fontSize > 5">{{ theme.background }}</div>
</template>
