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
import TitleBar from './components/TitleBar.vue'
import SideBar from './components/SideBar.vue'

const handleMinimize = () => window.electronAPI?.windowMinimize()
const handleMaximize = () => window.electronAPI?.windowMaximize()
const handleClose = () => window.electronAPI?.windowClose()
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: #f8f9fa;
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-container {
  display: flex;
  flex: 1;
  height: calc(100vh - 50px);
}

.content {
  flex: 1;
  overflow-y: auto;
}
</style>