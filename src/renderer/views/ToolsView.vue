<template>
  <div class="tools">
    <h1>工具箱</h1>
    <div class="tools-grid">
      <ToolCard 
        v-for="tool in tools" 
        :key="tool.name"
        :tool="tool"
        @use-tool="handleUseTool"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ToolCard from '../components/ToolCard.vue'

const tools = ref([
  {
    name: '文件转换器',
    description: '转换各种文件格式',
    icon: '🔄'
  },
  {
    name: '文本编辑器',
    description: '强大的文本编辑功能',
    icon: '📝'
  }
])

const handleUseTool = (tool) => {
  console.log('使用工具:', tool.name)
}
</script>

<style scoped>
.tools {
  padding: 20px;
}

.tools h1 {
  color: #333;
  margin-bottom: 20px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
</style>