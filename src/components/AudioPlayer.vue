<template>
  <div class="audio__player">
    <div class="audio__player-play" @click="togglePlayer">
      <img
        :src="option_.coverImage"
        :class="`${
          isPlaying && option_.coverRotate ? 'audio__player-spin-anim' : ''
        }`"
      />
      <div class="audio__player-play-icon">
        <img :src="isPlaying ? IconPause : IconPlay" />
      </div>
    </div>
    <div class="audio__player-progress-container">
      <div
        ref="audioProgressWrap"
        class="audio__player-progress-wrap"
        @click.stop="handleClickProgressWrap"
      >
        <div
          ref="audioProgress"
          class="audio__player-progress"
          :style="{
            backgroundColor: option_.progressBarColor,
          }"
        />
        <div
          ref="audioProgressPoint"
          class="audio__player-progress-point"
          :style="{
            backgroundColor: option_.indicatorColor,
            boxShadow: `0 0 10px 0 ${option_.indicatorColor}`,
          }"
          @panstart="handleProgressPanStart"
          @panend="handleProgressPanEnd"
          @panmove="handleProgressPanMove"
        />
      </div>
      <div class="flex text-gray_text text-sm mt-2">
        <span>{{ formatSecond(currentTime) }}</span>
        <span class="ml-auto">{{ formatSecond(totalTime) }}</span>
      </div>
    </div>
    <audio
      ref="audioPlayer"
      :src="option_.src"
      :onended="onAudioEnded"
      :onplay="onAudioPlay"
      :onpause="onAudioPause"
      @loadedmetadata="onLoadMetaData"
    ></audio>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  PropType,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue'
import Core from '@any-touch/core'
import Pan from '@any-touch/pan'
import { AudioPlayerOption, AudioPlayerOptionDefault } from './types'
import { formatSecond } from '../utils/util'
import IconPlay from '../assets/images/play.png'
import IconPause from '../assets/images/pause.png'

const mergeOption = (option: AudioPlayerOption): AudioPlayerOption => {
  return {
    src: option.src || AudioPlayerOptionDefault.src,
    coverImage: option.coverImage || AudioPlayerOptionDefault.coverImage,
    coverRotate: option.coverRotate || AudioPlayerOptionDefault.coverRotate,
    progressBarColor:
      option.progressBarColor || AudioPlayerOptionDefault.progressBarColor,
    indicatorColor:
      option.indicatorColor || AudioPlayerOptionDefault.indicatorColor,
  }
}

export default defineComponent({
  props: {
    option: {
      type: Object as PropType<AudioPlayerOption>,
      default: AudioPlayerOptionDefault,
    },
  },
  emits: ['ended', 'play', 'pause'],
  setup(props, { emit }) {
    const audioPlayer = ref()
    const audioProgressWrap = ref()
    const audioProgressPoint = ref()
    const audioProgress = ref()
    const progressInterval = 200
    const option_ = ref(mergeOption(props.option))
    let toucher: any = null
    let timer: any = null
    const state = reactive({
      isPlaying: false,
      isDragging: false,
      currentTime: 0,
      totalTime: 0,
    })

    const playUpdate = () => {
      if (state.isDragging) {
        return
      }
      const offsetLeft =
        (audioPlayer.value.currentTime / audioPlayer.value.duration) *
        audioProgressWrap.value.offsetWidth
      state.currentTime = audioPlayer.value.currentTime
      audioProgress.value.style.width = `${offsetLeft}px`
      setPointPosition(offsetLeft)
    }
    const startTimer = () => {
      clearTimer()
      timer = window.setInterval(playUpdate, progressInterval)
    }
    const clearTimer = () => {
      if (timer) {
        window.clearInterval(timer)
        timer = null
      }
    }
    const play = (src: any = null) => {
      if (src) audioPlayer.value.src = src
      audioPlayer.value.play()
      startTimer()
    }
    const pause = () => {
      audioPlayer.value.pause()
    }
    const togglePlayer = () => {
      if (state.isPlaying) {
        pause()
      } else {
        play()
      }
    }

    const onAudioEnded = () => {
      state.isPlaying = false
      clearTimer()
      emit('ended')
    }
    const onAudioPause = () => {
      state.isPlaying = false
      clearTimer()
      emit('pause')
    }
    const onAudioPlay = () => {
      state.isPlaying = true
      emit('play')
    }
    const onLoadMetaData = (e: any) => {
      state.totalTime = e.target.duration
      console.log('onLoadMetaData', e)
    }

    const setPointPosition = (offsetLeft: number) => {
      audioProgressPoint.value.style.left = `${
        offsetLeft - audioProgressPoint.value.offsetWidth / 2
      }px`
    }
    const handleProgressPanStart = (event: any) => {
      state.isDragging = true
    }

    const handleProgressPanEnd = (event: any) => {
      audioPlayer.value.currentTime = state.currentTime
      play()
      state.isDragging = false
    }

    const handleProgressPanMove = (event: any) => {
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
    const handleClickProgressWrap = (event: any) => {
      const { offsetX } = event
      if (event.target === audioProgressPoint.value) {
        return
      }
      state.currentTime =
        (offsetX / audioProgressWrap.value.offsetWidth) * state.totalTime
      audioPlayer.value.currentTime = state.currentTime
      setPointPosition(offsetX)
      audioProgress.value.style.width = `${offsetX}px`
      play()
    }
    watch(
      () => props.option,
      (newValue, oldValue) => {
        option_.value = mergeOption(newValue)
      },
      { deep: true },
    )
    onMounted(() => {
      toucher = new Core(document.getElementById('app') || undefined, {
        preventDefault: false,
      })
      toucher.use(Pan)
    })

    onUnmounted(() => {
      if (toucher) toucher.destroy()
      pause()
    })

    return {
      audioPlayer,
      option_,
      ...toRefs(state),
      onAudioEnded,
      onAudioPlay,
      onAudioPause,
      onLoadMetaData,
      play,
      togglePlayer,
      formatSecond,
      handleProgressPanStart,
      handleProgressPanEnd,
      handleProgressPanMove,
      handleClickProgressWrap,
      audioProgressWrap,
      audioProgressPoint,
      audioProgress,
      IconPlay,
      IconPause,
    }
  },
})
</script>
<style scoped>
.audio__player {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.audio__player-play {
  position: relative;
}
.audio__player-play:active,
.audio__player-play img:active {
  opacity: 0.75;
}
.audio__player-play img {
  width: 6.8rem;
  height: 6.8rem;
  border-radius: 9999px;
}
.audio__player-play-icon {
  position: absolute;
  top: 1.8rem;
  left: 1.8rem;
  background: #f0f0f0;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  padding: 0.5rem 0.5rem;
  opacity: 0.8;
}
.audio__player-play-icon img {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
}

.audio__player-progress-container {
  display: flex;
  flex-direction: column;
  width: 80%;
}

.audio__player-progress-wrap {
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

.audio__player-progress {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0;
  border-radius: 3px;
}

.audio__player-progress-point {
  position: absolute;
  left: -8px;
  top: 50%;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-top: -8px;
}

.audio__player-progress-point:after {
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
@keyframes audio__player-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.audio__player-spin-anim {
  animation: audio__player-spin 5s linear infinite;
}
</style>
