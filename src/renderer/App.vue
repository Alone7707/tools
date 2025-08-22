<template>
  <div id="app">
    <TitleBar 
      @minimize="handleMinimize"
      @maximize="handleMaximize"
      @close="handleClose"
    />

    <div class="main-container">
      <SideBar />
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useThemeStore } from '@/stores/theme'
import { watch } from 'vue'
import TitleBar from './components/TitleBar.vue'
import SideBar from './components/SideBar.vue'

const handleMinimize = () => window.electronAPI?.windowMinimize()
const handleMaximize = () => window.electronAPI?.windowMaximize()
const handleClose = () => window.electronAPI?.windowClose()

const themeStore = useThemeStore()
// 监听主题变化，更新全局样式
watch(() => themeStore.isDark, (isDark) => {
  console.log("🚀 ~ isDark:", isDark)
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}, { immediate: true })
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
      height: calc(100vh - 50px);
      
      .content {
        flex: 1;
        overflow-y: auto;
        background: var(--background-color);
      }
    }
  }
}
</style>