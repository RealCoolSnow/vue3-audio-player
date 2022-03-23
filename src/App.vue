<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import AudioPlayer from './components/AudioPlayer.vue'
</script>

<template>
  <AudioPlayer
    :option="{
      src: 'https://www.joy666.cn/media/sky.mp3',
      coverImage: 'https://www.joy666.cn/media/sky.png',
    }"
  />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
