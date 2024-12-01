<template>
  <div class="home">
    <FireworkEffect class="firework-effect" />
    <div class="custom-cursor" :style="cursorStyle"></div>
  </div>
</template>

<script setup>
import FireworkEffect from "@/components/FireworkEffect.vue";
import useCursorStyle from "@/hooks/useCursorStyle";
import "@/assets/cursorStyle.css";

const { cursorStyle } = useCursorStyle();
</script>

<style>
</style>