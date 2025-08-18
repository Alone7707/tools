<template>
  <div class="files">
    <h1>文件管理</h1>
    <FileManager @file-selected="handleFileSelected" />
    <FileViewer :content="fileContent" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FileManager from '../components/FileManager.vue'
import FileViewer from '../components/FileViewer.vue'

const fileContent = ref('')

const handleFileSelected = (content) => {
  fileContent.value = content
}
</script>

<style scoped>
.files {
  padding: 20px;
}

.files h1 {
  color: #333;
  margin-bottom: 20px;
}
</style>