export interface AudioPlayerOption {
  src: string //audio source
  title?: string //audio title
  autoPlay?: boolean
  coverImage?: string //cover image
  coverRotate?: boolean //cover rotate when playing
  progressBarColor?: string //progress bar color
  indicatorColor?: string //indicator color
}

export const AudioPlayerOptionDefault: AudioPlayerOption = {
  src: '',
  title: '',
  autoPlay: false,
  coverImage: '',
  coverRotate: true,
  progressBarColor: '#3C91F4',
  indicatorColor: '#3C91F4',
}
