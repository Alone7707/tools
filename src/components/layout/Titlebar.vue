<template>
  <header class="title-bar">
    <div class="app-info">
      <div class="app-icon">⚡</div>
    </div>
    <div class="app-title">
      <span class="app-name">ATools</span>
      <span class="app-subtitle"></span>
    </div>
    <div class="window-controls">
      <button class="control-btn pin" :class="{ active: isPinned }" :title="isPinned ? '取消保留窗口' : '保留窗口'"
        @click="togglePin">
        <svg viewBox="0 0 24 24" width="14" height="14">
          <!-- 图钉图标 - 未固定状态 -->
          <path v-if="!isPinned"
            d="M14,4V8L16,10V16H15L12.5,18.5L10,16H9V10L11,8V4H14M12,2A1,1 0 0,0 11,3V8.5L9.5,10V15H11L12.5,16.5L14,15H14.5V10L13,8.5V3A1,1 0 0,0 12,2Z"
            fill="currentColor" opacity="0.7" />
          <!-- 图钉图标 - 已固定状态 -->
          <path v-if="isPinned" d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z" fill="currentColor" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['minimize', 'maximize', 'minimizeToTray', 'pinChanged'])

// 保留窗口状态
const isPinned = ref(false)

const minimize = () => emit('minimize')
const maximize = () => emit('maximize')
const minimizeToTray = () => emit('minimizeToTray')

// 切换保留窗口状态
const togglePin = () => {
  isPinned.value = !isPinned.value

  // 通知主进程更新窗口行为
  if (window.electronAPI) {
    window.electronAPI.setPinWindow(isPinned.value)
  }

  // 发出事件通知App.vue状态变化
  emit('pinChanged', isPinned.value)
}

// 组件挂载时获取当前状态
onMounted(() => {
  if (window.electronAPI) {
    window.electronAPI.getPinWindow().then(pinned => {
      isPinned.value = pinned
    })
  }
})
</script>

<style scoped lang="scss">
.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 38px;
  background: var(--card-background);
  border-bottom: 1px solid var(--border-color);
  -webkit-app-region: drag;

  .app-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .app-icon {
      font-size: 18px;
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      border-radius: 6px;
      color: white;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }

  }

  .app-title {
    display: flex;
    flex-direction: column;
    line-height: 1.3;

    .app-name {
      font-family: 'STXinwei', sans-serif;
      // font-size: 13px;
      font-weight: 600;
      color: var(--text-color);
      letter-spacing: 0.3px;
    }

    .app-subtitle {
      font-size: 10px;
      color: var(--text-secondary-color);
      font-weight: 400;
      margin-top: 1px;
    }
  }

  .window-controls {
    display: flex;
    -webkit-app-region: no-drag;

    .control-btn {
      width: 28px;
      height: 28px;
      background: none;
      border: none;
      color: var(--text-secondary-color);
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.25s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      svg {
        width: 14px;
        height: 14px;
        transition: all 0.25s ease;
      }

      &.pin {
        background-color: rgba(255, 255, 255, 0.1);

        &.active {
          background: var(--primary-color);
          color: white;
          box-shadow: 0 2px 8px rgba(var(--primary-color-rgb), 0.3);

          svg {
            transform: scale(1.1);
          }
        }

        &:not(.active) {
          &:hover {
            background: var(--border-color);
            color: var(--text-color);

            svg {
              opacity: 1;
              transform: scale(1.05);
            }
          }
        }

        &:active {
          transform: scale(0.95);
        }
      }

      &.close:hover {
        background: #ff5f56;
        color: white;
      }

    }
  }
}
</style>
