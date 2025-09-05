import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import I18n from "./public/I18n/i18n.json";
import nlsPlugin, {
  Languages,
  esbuildPluginMonacoEditorNls,
} from "./public/I18n/vite-plugin-i18n-nls";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    // 生产环境汉化
    nlsPlugin({
      locale: Languages.zh_hans,
      localeData: I18n,
    }),
  ],
  // 开发环境汉化 使用 esbuild 配置实现
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        esbuildPluginMonacoEditorNls({
          locale: Languages.zh_hans,
          localeData: I18n,
        }),
      ],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      'vue': 'vue/dist/vue.esm-bundler.js'
    },
  },
  server: {
    port: 3004
  },
  base: './',  // 使用相对路径，解决 Electron 打包后的资源加载问题
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // 确保资源文件使用相对路径
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
})
