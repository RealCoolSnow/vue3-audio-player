<template>
  <div>
    <AudioPlayer :option="option" />
    <div class="my-2 h-1 bg-gray-400 w-full"></div>
    <div @click="switchAudio" class="mt-6 text-center">
      <span
        class="w-12 bg-blue-600 py-2 px-6 text-white active:opacity-70 text-sm"
        >Switch Music</span
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import AudioPlayer from '../../../src'

const option1 = {
  src: 'https://www.joy666.cn/media/sky.mp3',
  title: '天空之城 - 久石让',
  coverImage: 'https://www.joy666.cn/media/sky.png',
}

const option2 = {
  src: 'https://www.joy666.cn/media/wa.mp3',
  title: 'cartoon',
  coverImage:
    'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202005%2F08%2F20200508214551_5kkUF.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1650697083&t=349c11907ec233e63e63dbb670d36d46',
}

const option = ref(option1)
const switchAudio = () => {
  console.log('switchAudio')
  option.value = option.value.src === option1.src ? option2 : option1
}
</script>