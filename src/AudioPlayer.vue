<template>
  <div class="flex flex-col w-full items-center py-6">
    <div class="btn-play bg-gray-300 relative" @click="togglePlayer">
      <img
        :src="cover"
        :class="`btn-play ${state.playing ? 'animate-spin-slow' : ''}`"
      />
      <div
        class="
          flex
          item-center
          justify-content
          bg-white
          rounded-full
          absolute
          top-8
          left-8
          btn
          p-2
        "
      >
        <img
          :src="`/images/book_qr/ic_${
            state.playing ? 'pause' : 'play'
          }_black.png`"
          class="w-12 h-12"
        />
      </div>
    </div>
    <div class="flex flex-col w-4/5">
      <div
        ref="audioProgressWrap"
        class="audio__progress-wrap"
        @click.stop="handleClickProgressWrap"
      >
        <div
          ref="audioProgress"
          class="audio__progress"
          :style="{
            backgroundColor: themeColor,
          }"
        />
        <div
          ref="audioProgressPoint"
          class="audio__progress-point"
          :style="{
            backgroundColor: themeColor,
            boxShadow: `0 0 10px 0 ${themeColor}`,
          }"
          @panstart="handleProgressPanstart"
          @panend="handleProgressPanend"
          @panmove="handleProgressPanmove"
        />
      </div>
      <div class="flex text-gray_text text-sm mt-2">
        <span>{{ formatTime(state.currentTime) }}</span>
        <span class="ml-auto">{{ formatTime(state.totalTime) }}</span>
      </div>
    </div>
    <audio
      ref="player"
      :src="src"
      :onended="onAudioEnded"
      :onplay="onAudioPlay"
      :onpause="onAudioPause"
      @loadedmetadata="onLoadMetaData"
    ></audio>
    <div class="flex mt-2">
      <img
        src="/images/book_qr/ic_15s_b.png"
        class="btn btn-15s"
        @click="seekTo(-15)"
      />
      <img
        src="/images/book_qr/ic_15s_f.png"
        class="btn btn-15s ml-20"
        @click="seekTo(15)"
      />
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
} from 'vue'
import Core from '@any-touch/core'
import Pan from '@any-touch/pan'

export default defineComponent({
  props: {
    src: {
      type: String,
      default: '',
    },
    cover: {
      type: String,
      default: '',
    },
    themeColor: {
      type: String,
      default: '#3C91F4',
    },
  },
  emits: ['ended', 'play', 'pause'],
  setup(props, { emit }) {
    const player = ref()
    const audioProgressWrap = ref()
    const audioProgressPoint = ref()
    const audioProgress = ref()
    const progressInterval = 200
    let at: any = null
    let timer: any = null
    const state = reactive({
      playing: false,
      currentTime: 0,
      totalTime: 0,
      isDragging: false,
    })
    const playing = () => {
      if (state.isDragging) {
        return
      }
      const offsetLeft =
        (player.value.currentTime / player.value.duration) *
        audioProgressWrap.value.offsetWidth
      state.currentTime = player.value.currentTime
      audioProgress.value.style.width = `${offsetLeft}px`
      setPointPosition(offsetLeft)
    }

    const clearTimer = () => {
      if (timer) {
        window.clearInterval(timer)
        timer = null
      }
    }
    const startTimer = () => {
      clearTimer()
      timer = window.setInterval(playing, progressInterval)
    }
    const formatTime = (second: number) => {
      let hour_str = `${Math.floor(second / 60)}`
      let second_str = `${Math.ceil(second % 60)}`
      if (hour_str.length === 1) {
        hour_str = `0${hour_str}`
      }
      if (second_str.length === 1) {
        second_str = `0${second_str}`
      }
      return `${hour_str}:${second_str}`
    }
    const onAudioEnded = () => {
      console.log('onAudioEnded')
      state.playing = false
      clearTimer()
      emit('ended')
    }
    const onAudioPause = () => {
      console.log('onAudioPause')
      state.playing = false
      clearTimer()
      emit('pause')
    }
    const onAudioPlay = () => {
      console.log('onAudioPlay')
      state.playing = true
      emit('play')
    }
    const onLoadMetaData = (e: any) => {
      console.log('onLoadMetaData', e)
      state.totalTime = e.target.duration
    }
    const play = (src: any = null) => {
      if (src) player.value.src = src
      // props.source = src || 'https://z70resources.renaissance.cn/Scripts/audio/bell.mp3'
      player.value.play()
      startTimer()
    }
    const togglePlayer = () => {
      if (state.playing) {
        player.value.pause()
      } else {
        play()
      }
    }
    const seekTo = (second: number) => {
      const current = player.value.currentTime + second
      player.value.currentTime =
        // eslint-disable-next-line no-nested-ternary
        current < 0 ? -1 : current > state.totalTime ? state.totalTime : current
      state.currentTime = player.value.currentTime
    }
    const setPointPosition = (offsetLeft) => {
      audioProgressPoint.value.style.left = `${
        offsetLeft - audioProgressPoint.value.offsetWidth / 2
      }px`
    }
    const handleProgressPanstart = (event) => {
      state.isDragging = true
    }

    const handleProgressPanend = (event) => {
      player.value.currentTime = state.currentTime
      play()
      state.isDragging = false
    }

    const handleProgressPanmove = (event) => {
      // if (this.disabledProgressDrag) return
      const pageX = event.x
      const bcr = event.target.getBoundingClientRect()
      const targetLeft = parseInt(getComputedStyle(event.target).left)
      let offsetLeft = targetLeft + (pageX - bcr.left)
      offsetLeft = Math.min(offsetLeft, audioProgressWrap.value.offsetWidth)
      offsetLeft = Math.max(offsetLeft, 0)
      setPointPosition(offsetLeft)
      audioProgress.value.style.width = `${offsetLeft}px`
      state.currentTime =
        (offsetLeft / audioProgressWrap.value.offsetWidth) * state.totalTime
    }
    const handleClickProgressWrap = (event) => {
      const { offsetX } = event
      if (event.target === audioProgressPoint.value) {
        return
      }
      // 设置当前播放位置
      state.currentTime =
        (offsetX / audioProgressWrap.value.offsetWidth) * state.totalTime
      player.value.currentTime = state.currentTime
      setPointPosition(offsetX)
      // 设置进度条
      audioProgress.value.style.width = `${offsetX}px`
      play()
    }
    onMounted(() => {
      // play()
      at = new Core(document.getElementById('app'), { preventDefault: false })
      at.use(Pan)
    })
    const pause = () => {
      player.value.pause()
      nextTick(() => {
        clearTimer()
        state.playing = false
      })
    }
    onUnmounted(() => {
      if (at) at.destroy()
      pause()
    })
    return {
      player,
      state,
      onAudioEnded,
      onAudioPlay,
      onAudioPause,
      onLoadMetaData,
      play,
      togglePlayer,
      formatTime,
      seekTo,
      handleProgressPanstart,
      handleProgressPanend,
      handleProgressPanmove,
      handleClickProgressWrap,
      audioProgressWrap,
      audioProgressPoint,
      audioProgress,
    }
  },
})
</script>
<style scoped>
.btn-play {
  @apply w-32 h-32 rounded-full;
}
.btn-15s {
  @apply w-10 h-10;
}
.progress {
  @apply mt-6 mb-1 w-full relative;
}
.progress div {
  @apply h-1 bg-gray-200 w-full rounded;
}
.progress label {
  @apply bg-gray-400 rounded-full absolute left-0;
  height: 0.8rem;
  width: 0.8rem;
  margin-top: -0.5rem;
  left: 0%;
}
.audio__progress-wrap {
  position: relative;
  background: #ddd;
  height: 4px;
  border-radius: 3px;
  margin-top: 20px;
  cursor: pointer;
  touch-action: none;
  user-select: none;
  -webkit-user-drag: none;
}

.audio__progress {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0;
  border-radius: 3px;
}

.audio__progress-point {
  position: absolute;
  left: -8px;
  top: 50%;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-top: -8px;
}

.audio__progress-point:after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  margin: -4px 0 0 -4px;
  background: #fff;
  border-radius: 50%;
}
</style>
