<template>
  <div class="file-manager">
    <button class="btn-primary" @click="selectFile">选择文件</button>
  </div>
</template>

<script setup>
const emit = defineEmits(['file-selected'])

const selectFile = async () => {
  if (window.electronAPI) {
    try {
      const result = await window.electronAPI.selectFile()
      if (result.success) {
        const fileResult = await window.electronAPI.readFile(result.filePath)
        if (fileResult.success) {
          emit('file-selected', fileResult.content)
        }
      }
    } catch (error) {
      console.error('文件选择失败:', error)
    }
  } else {
    emit('file-selected', 'Mock file content for testing')
  }
}
</script>

<style scoped>
.file-manager {
  margin-bottom: 20px;
}

.btn-primary {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background: #5a6fd8;
}
</style>