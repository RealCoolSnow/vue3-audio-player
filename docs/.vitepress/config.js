const path = require('path')

module.exports = {
  title: 'Vue3 Audio Player',
  description: 'This is a beautiful Audio Player Component for Vue3.',
  themeConfig: {
    repo: 'https://github.com/RealCoolSnow/vue3-audio-player',
    sidebar: [
      {
        text: 'Introduction',
        children: [{ text: 'Getting Started', link: '/' }],
      },
    ],
  },
  vite: {
    resolve: {
      alias: {
        'vue3-audio-player': path.resolve(__dirname, '../../src'),
      },
      dedupe: ['vue', /prime\/.+/], // avoid error when using dependencies that also use Vue
    },
  },
}
