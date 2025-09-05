import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import { useGlobalStore } from '@/stores/global'
// import pkg from '../package.json'
import './assets/styles/global.css'
import Toast from './components/Toast.vue'
import toast from './utils/toast'
import LoadingPlugin from './plugins/loading'

if (window.electronAPI) {
  console.log('✅ electronAPI is available:', window.electronAPI)
} else {
  console.log('❌ electronAPI is not available')
}

const app = createApp(App)
// 全局属性
app.config.globalProperties.$electron = window.electronAPI
app.config.globalProperties.$toast = toast

// 注册全局组件
app.component('Toast', Toast)

// 注册插件
app.use(LoadingPlugin)

app.use(router).use(pinia).mount('#app')

// 初始化主题
const themeStore = useGlobalStore()
themeStore.initTheme()
