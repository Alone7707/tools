<template>
  <div id="app">
    <TitleBar @minimize="handleMinimize" @maximize="handleMaximize" @minimizeToTray="handleMinimizeToTray" />

    <div class="main-container">
      <Sidebar />
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useGlobalStore } from '@/stores/global'
import { watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TitleBar from './components/layout/Titlebar.vue'
import Sidebar from './components/layout/Sidebar.vue'

const router = useRouter()
const route = useRoute()

const handleMinimize = () => window.electronAPI?.windowMinimize()
const handleMaximize = () => window.electronAPI?.windowMaximize()
const handleClose = () => window.electronAPI?.windowClose()
const handleMinimizeToTray = () => window.electronAPI?.windowMinimizeToTray()

const globalStore = useGlobalStore()

// 后台超时管理
let backgroundTimeoutId = null
let isInBackground = false

// 窗口焦点事件处理
const handleWindowFocus = () => {
  console.log('应用重新获得焦点')
  isInBackground = false

  // 清除后台超时定时器
  if (backgroundTimeoutId) {
    clearTimeout(backgroundTimeoutId)
    backgroundTimeoutId = null
    console.log('已清除后台超时定时器')
  }
}

const handleWindowBlur = () => {
  console.log('应用失去焦点，进入后台')
  isInBackground = true

  // 设置后台超时定时器
  const timeoutMs = globalStore.backgroundTimeout * 60 * 1000
  backgroundTimeoutId = setTimeout(() => {
    console.log(`后台超时${globalStore.backgroundTimeout}分钟，自动返回首页`)

    // 只有在不是首页时才跳转
    if (route.path !== '/') {
      router.push('/')
      console.log('已自动跳转到首页')
    }

    backgroundTimeoutId = null
  }, timeoutMs)

  console.log(`已设置${globalStore.backgroundTimeout}分钟后台超时定时器`)
}

// 清理后台超时定时器
const cleanupBackgroundTimeout = () => {
  if (backgroundTimeoutId) {
    clearTimeout(backgroundTimeoutId)
    backgroundTimeoutId = null
    console.log('已清理后台超时定时器')
  }
}

// 初始化主题和菜单状态
onMounted(() => {
  globalStore.initTheme()
  globalStore.initGlobalShortcut()
  globalStore.initBackgroundTimeout()

  // 添加窗口焦点事件监听
  window.addEventListener('focus', handleWindowFocus)
  window.addEventListener('blur', handleWindowBlur)

  console.log('已添加窗口焦点事件监听器')

  // 监听主进程请求获取保存的快捷键
  if (window.electronAPI && window.electronAPI.onGetSavedShortcut) {
    window.electronAPI.onGetSavedShortcut(() => {
      // 从localStorage获取保存的快捷键
      const savedShortcut = localStorage.getItem('globalShortcut') || 'Shift+Space';

      // 发送保存的快捷键到主进程
      if (window.electronAPI && window.electronAPI.sendSavedShortcut) {
        window.electronAPI.sendSavedShortcut(savedShortcut);
      }
    });
  }
})

// 组件卸载时清理
onUnmounted(() => {
  // 移除事件监听器
  window.removeEventListener('focus', handleWindowFocus)
  window.removeEventListener('blur', handleWindowBlur)

  // 清理定时器
  cleanupBackgroundTimeout()

  console.log('已清理窗口焦点事件监听器和定时器')
})

// 监听路由变化，用户主动切换路由时重置后台定时器
watch(() => route.path, (newPath, oldPath) => {
  if (newPath !== oldPath) {
    console.log(`路由从 ${oldPath} 切换到 ${newPath}`)

    // 如果在后台状态，重置定时器
    if (isInBackground && backgroundTimeoutId) {
      console.log('用户主动切换路由，重置后台定时器')
      cleanupBackgroundTimeout()

      // 重新设置定时器
      const timeoutMs = globalStore.backgroundTimeout * 60 * 1000
      backgroundTimeoutId = setTimeout(() => {
        console.log(`后台超时${globalStore.backgroundTimeout}分钟，自动返回首页`)

        // 只有在不是首页时才跳转
        if (route.path !== '/') {
          router.push('/')
          console.log('已自动跳转到首页')
        }

        backgroundTimeoutId = null
      }, timeoutMs)
    }
  }
})

// 监听主题变化，更新全局样式
watch(() => globalStore.isDark, (isDark) => {
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}, { immediate: true })

// 监听自定义主题颜色变化，更新 CSS 变量
watch(() => globalStore.isCustomTheme, (isCustom) => {
  if (isCustom) {
    document.documentElement.classList.add('custom-theme')
  } else {
    document.documentElement.classList.remove('custom-theme')
  }
}, { immediate: true })

// 监听主题颜色变化，更新 CSS 变量
watch(() => [globalStore.themePrimaryColor, globalStore.themeSecondaryColor, globalStore.themeBackgroundColor, globalStore.themeCardBackgroundColor, globalStore.themeTextColor, globalStore.themeTextSecondaryColor, globalStore.themeBorderColor, globalStore.themeInputBackgroundColor, globalStore.isCustomTheme], ([primary, secondary, background, cardBackground, textColor, textSecondaryColor, borderColor, inputBackgroundColor, isCustom]) => {
  if (primary && secondary) {
    document.documentElement.style.setProperty('--primary-color', primary)
    document.documentElement.style.setProperty('--secondary-color', secondary)

    // 更新 RGB 值
    const primaryRgb = hexToRgb(primary)
    const secondaryRgb = hexToRgb(secondary)

    if (primaryRgb) {
      document.documentElement.style.setProperty('--primary-color-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`)
    }

    if (secondaryRgb) {
      document.documentElement.style.setProperty('--secondary-color-rgb', `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`)
    }
  }

  if (background) {
    document.documentElement.style.setProperty('--background-color', background)
  }

  if (cardBackground) {
    document.documentElement.style.setProperty('--card-background', cardBackground)
  }

  if (textColor) {
    document.documentElement.style.setProperty('--text-color', textColor)
  }

  if (textSecondaryColor) {
    document.documentElement.style.setProperty('--text-secondary', textSecondaryColor)
  }

  if (borderColor) {
    document.documentElement.style.setProperty('--border-color', borderColor)
  }

  if (inputBackgroundColor) {
    document.documentElement.style.setProperty('--input-background', inputBackgroundColor)
  }
}, { immediate: true })

// 将十六进制颜色转换为 RGB
const hexToRgb = (hex) => {
  // 移除 # 符号
  hex = hex.replace(/^#/, '')

  // 处理简写形式，如 #03f -> #0033ff
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }

  // 解析十六进制值
  const num = parseInt(hex, 16)

  // 提取 RGB 分量
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: var(--background-color);
  color: var(--text-color);

  #app {
    height: 100vh;
    display: flex;
    flex-direction: column;

    .main-container {
      display: flex;
      flex: 1;
      height: calc(100vh - 38px);
      /* 调整为新的标题栏高度 */

      .content {
        flex: 1;
        overflow-y: auto;
        background: var(--background-color);
        padding: 16px;
      }
    }
  }
}
</style>
