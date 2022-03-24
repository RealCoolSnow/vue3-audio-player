export interface AudioPlayerOption {
  src: string //audio source
  coverImage?: string //cover image
  coverRotate?: boolean //cover rotate when playing
  progressBarColor?: string //progress bar color
  indicatorColor?: string //indicator color
}

export const AudioPlayerOptionDefault: AudioPlayerOption = {
  src: '',
  coverImage: '',
  coverRotate: true,
  progressBarColor: '#3C91F4',
  indicatorColor: '#3C91F4',
}
