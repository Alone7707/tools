<template>
  <div class="dashboard">
    <h1>欢迎使用 Electron Tools</h1>
    <div class="stats-grid">
      <div class="stat-card">
        <h3>系统信息</h3>
        <p>平台: {{ systemInfo.platform }}</p>
        <p>架构: {{ systemInfo.arch }}</p>
        <p>版本: {{ systemInfo.version }}</p>
      </div>
      <div class="stat-card">
        <h3>应用统计</h3>
        <p>运行时间: {{ runtime }}</p>
        <p>内存使用: {{ memoryUsage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const systemInfo = ref({})
const runtime = ref('0s')
const memoryUsage = ref('0 MB')

onMounted(async () => {
  if (window.electronAPI) {
    systemInfo.value = await window.electronAPI.getSystemInfo()
  }
})
</script>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>