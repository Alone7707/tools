import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/global.css'

// 检查electronAPI是否可用
if (window.electronAPI) {
  console.log('✅ electronAPI is available:', window.electronAPI)
} else {
  console.error('❌ electronAPI is not available')
  // 提供mock API用于开发调试
  window.electronAPI = {
    windowMinimize: () => console.log('Mock: minimize'),
    windowMaximize: () => console.log('Mock: maximize'),
    windowClose: () => console.log('Mock: close'),
    getSystemInfo: async () => ({
      platform: 'win32',
      arch: 'x64',
      version: '1.0.0',
      electron: '27.0.0',
      node: '18.0.0'
    }),
    selectFile: async () => ({ 
      success: true, 
      filePath: 'C:\\mock\\test.txt' 
    }),
    readFile: async () => ({ 
      success: true, 
      content: 'Mock file content for testing' 
    })
  }
}

const app = createApp(App)
// 全局属性
app.config.globalProperties.$electron = window.electronAPI
console.log("🚀 ~ window.electronAPI:", window.electronAPI)

app.use(router).mount('#app')