<template>
  <AudioPlayer :option="option" />
</template>
<script setup lang="ts">
import AudioPlayer from '../../../src'

const option = {
  src: 'https://www.joy666.cn/media/sky.mp3',
  title: '天空之城 - 久石让',
  coverImage: 'https://www.joy666.cn/media/sky.png',
}
</script>