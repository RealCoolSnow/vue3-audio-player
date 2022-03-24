# What is vue3-audio-player?

This is a beautiful Audio Player Component for Vue3.

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
   <AudioPlayer :option="{
        src: 'https://your-audio-file.mp3',
        title: 'your-audio-title',
        coverImage: 'https://your-cover-image.png',
   }" />
</template>
```