<template>
  <div class="dashboard">
    <h1>欢迎使用 Electron Tools</h1>
    <p>这是一个现代化的Electron桌面应用，提供丰富的工具集。</p>

    <div class="stats-grid">
      <StatCard v-for="stat in stats" :key="stat.title" :title="stat.title" :value="stat.value" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StatCard from '../components/StatCard.vue'

const systemInfo = ref({})
const startTime = ref(Date.now())

const stats = computed(() => [
  { title: '应用版本', value: systemInfo.value?.version || '1.0.0' },
  { title: '系统平台', value: systemInfo.value?.platform || '加载中...' },
  { title: '运行时间', value: calculateUptime() }
])

const calculateUptime = () => {
  const elapsed = Date.now() - startTime.value
  const seconds = Math.floor(elapsed / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}小时 ${minutes % 60}分钟`
  } else if (minutes > 0) {
    return `${minutes}分钟 ${seconds % 60}秒`
  } else {
    return `${seconds}秒`
  }
}

onMounted(async () => {
  if (window.electronAPI) {
    try {
      systemInfo.value = await window.electronAPI.getSystemInfo()
    } catch (error) {
      console.error('获取系统信息失败:', error)
    }
  }
})
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 20px;
  background: var(--background-color);

  h1 {
    color: var(--text-color);
    margin-bottom: 10px;
  }

  p {
    color: var(--text-secondary-color, #666);
    margin-bottom: 30px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
}
</style>