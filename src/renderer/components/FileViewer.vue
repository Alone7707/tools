<template>
  <div class="file-viewer" v-if="content">
    <h3>文件内容</h3>
    <pre>{{ content }}</pre>
  </div>
</template>

<script setup>
defineProps({
  content: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.file-viewer {
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 20px;
}

.file-viewer h3 {
  margin-top: 0;
  color: #333;
}

pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  font-family: 'Consolas', 'Monaco', monospace;
}
</style>