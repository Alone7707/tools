<template>
  <div class="settings">
    <h1>设置</h1>
    <div class="settings-grid">
      <div class="setting-item">
        <label>主题:</label>
        <Select
          v-model="currentTheme"
          :options="themeOptions"
          @change="changeTheme"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import Select from '@/components/Select.vue'

const themeOptions = [
  { value: 'light', label: '浅色' },
  { value: 'dark', label: '深色' }
]

const themeStore = useThemeStore()

const currentTheme = computed(() => themeStore.isDark ? 'dark' : 'light')
const changeTheme = () => themeStore.toggleTheme()

</script>

<style lang="scss" scoped>
.settings {
  padding: 20px;
  background: var(--background-color);

  h1 {
    color: var(--text-color);
    margin-bottom: 20px;
  }

  .settings-grid {
    max-width: 100%;

    .setting-item {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      background: var(--card-background, white);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border-color);

      label {
        width: 100px;
        font-weight: bold;
        color: var(--text-color);
      }

      select {
        padding: 5px 10px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--input-background, white);
        color: var(--text-color);
      }
    }
  }
}
</style>