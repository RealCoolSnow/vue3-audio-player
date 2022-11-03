# What is vue3-audio-player?

This is a beautiful Audio Player Component for Vue3.

<p align="center">
    <img src="/screenshot/screen1.png" />
</p>

# Installation

```bash
npm i vue3-audio-player
```

# Usage

In your `*.vue`, you shall import the libraries and CSS:

```ts
import AudioPlayer from 'vue3-audio-player'
import 'vue3-audio-player/dist/style.css'
```

In your `template`:

```html
<template>
  <AudioPlayer
    :option="{
        src: 'https://your-audio-file.mp3',
        title: 'your-audio-title',
        coverImage: 'https://your-cover-image.png',
   }"
  />
</template>
```

Here are some `option`s about `AudioPlayer`:

```ts
 AudioPlayerOption {
  src: string //audio source
  title?: string //audio title (optional, default: '')
  coverImage?: string //cover image (optional, default: '')
  coverRotate?: boolean //cover rotate when playing (optional, default: true)
  progressBarColor?: string //progress bar color (optional, default: '#3C91F4')
  indicatorColor?: string //indicator color (optional, default: '#3C91F4')
}
```

Here are some `event`s about `AudioPlayer`:

```ts
'loadedmetadata'
'playing'
'play'
'play-error'
'timeupdate'
'pause'
'ended'
'progress-start'
'progress-end'
'progress-move'
'progress-click'
```

Here are some `method`s about `AudioPlayer`:

```ts
play() // play the audio
pause() // pause the audio
```

Here are some `property`s about `AudioPlayer`:

```ts
totalTime // total time of the audio (seconds)
currentTime // current time of the audio (seconds)
isPlaying // boolean
```

Here are some `slot`s about `AudioPlayer`:

```ts
title
```
