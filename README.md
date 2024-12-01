# sparkler-cursor-effects

to change default web cursor

#### demo: https://naganohara.studio 


#### FireworkEffect.vue: to generate canvas and particle effects

#### cursorStyle.css: to change default cursor style

#### useCursorStyle.js: to use cursor style

How to import in a .vue file:


<template>
  <div class="home">
    <FireworkEffect class="firework-effect"/>
    <div class="custom-cursor" :style="cursorStyle"></div>
  </div>
</template>


<script setup>
import FireworkEffect from "@/components/FireworkEffect.vue";
import useCursorStyle from "@/hooks/useCursorStyle"; 
import "@/assets/cursorStyle.css"; 
const { cursorStyle } = useCursorStyle();
</script>
