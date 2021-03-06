import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()], // to process SFC
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'audio-player',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      // external modules won't be bundled into your library
      external: ['vue', /prime\/.+/],
      output: {
        exports: 'named',
        // Provide global variables to use in the UMD build
        // for externalized deps (not useful if 'umd' is not in lib.formats)
        globals: {
          vue: 'Vue',
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    emptyOutDir: false, // to retain the types folder generated by tsc
  },
})
