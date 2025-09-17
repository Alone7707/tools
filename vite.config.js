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
export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    // 只在开发环境启用开发工具
    ...(mode === 'development' ? [vueDevTools()] : []),
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
    sourcemap: mode === 'development',
    minify: mode === 'production' ? 'terser' : false,
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // 确保资源文件使用相对路径
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        // 只在生产环境进行代码分包优化
        ...(mode === 'production' && {
          manualChunks: {
            'monaco-editor': ['monaco-editor'],
            'highlight': ['highlight.js'],
            'marked': ['marked'],
            'vue-vendor': ['vue', 'vue-router', 'pinia']
          }
        })
      }
    },
    // 只在生产环境应用 terser 配置
    ...(mode === 'production' && {
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.warn', 'console.info'],
          collapse_vars: true,
          reduce_vars: true,
        },
        mangle: {
          toplevel: true,
          keep_classnames: false,
          keep_fnames: false,
        },
        output: {
          comments: false,
          beautify: false,
          ascii_only: true,
        },
      },
      chunkSizeWarningLimit: 1000,
      assetsInlineLimit: 4096
    })
  },
  // 只在生产环境禁用 Vue 开发工具
  define: {
    __VUE_PROD_DEVTOOLS__: mode === 'development',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: mode === 'development'
  }
}))
