<template>
  <div class="settings">
    <h1>设置</h1>
    <div class="settings-grid">
      <div class="setting-item">
        <label>主题:</label>
        <select v-model="currentTheme" @change="changeTheme">
          <option value="light">浅色</option>
          <option value="dark">深色</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentTheme = ref('light')

const changeTheme = () => {
  document.documentElement.setAttribute('data-theme', currentTheme.value)
  localStorage.setItem('theme', currentTheme.value)
}
</script>

<style scoped>
.settings {
  padding: 20px;
}

.settings h1 {
  color: #333;
  margin-bottom: 20px;
}

.settings-grid {
  max-width: 400px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.setting-item label {
  font-weight: bold;
  color: #333;
}

.setting-item select {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>