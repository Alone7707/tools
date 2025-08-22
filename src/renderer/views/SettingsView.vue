<template>
  <div class="settings">
    <h1>设置</h1>
    <div class="settings-grid">
      <div class="setting-item">
        <label>主题:</label>
        <select :value="currentTheme" @change="changeTheme">
          <option value="light">浅色</option>
          <option value="dark">深色</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

const currentTheme = computed(() => themeStore.isDark ? 'dark' : 'light')
const changeTheme = () => themeStore.toggleTheme()

</script>

<style lang="scss" scoped>
.settings {
  padding: 20px;

  h1 {
    color: #333;
    margin-bottom: 20px;
  }

  .settings-grid {
    max-width: 400px;

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      label {
        font-weight: bold;
        color: #333;
      }

      select {
        padding: 5px 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
    }
  }
}
</style>