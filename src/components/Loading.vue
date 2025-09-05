<template>
  <div class="loading-container">
    <div class="loading-content">
      <div class="loading-spinner" :class="loadingClasses">
        <div class="loading-inner"></div>
      </div>
      <span v-if="text" class="loading-text">{{ text }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'Loading'
})

const props = defineProps({
  // 加载文本
  text: {
    type: String,
    default: '加载中...'
  },
  // 加载器大小
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
})

// 计算加载器样式类
const loadingClasses = computed(() => {
  return [
    'loading',
    `loading--${props.size}`
  ]
})
</script>

<style lang="scss" scoped>
.loading-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.loading-spinner {
  position: relative;
  width: 50px;
  height: 50px;
  margin-bottom: 15px;

  &.loading--small {
    width: 30px;
    height: 30px;
    margin-bottom: 10px;
  }

  &.loading--medium {
    width: 40px;
    height: 40px;
    margin-bottom: 12px;
  }

  &.loading--large {
    width: 60px;
    height: 60px;
    margin-bottom: 18px;
  }
}

.loading-inner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid transparent;
  border-top-color: #409eff;
  border-right-color: #409eff;
  animation: spin 1s linear infinite;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

  &::before {
    content: '';
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #409eff;
    animation: spin 2s linear infinite reverse;
  }

  &::after {
    content: '';
    position: absolute;
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: #409eff;
    animation: spin 1.5s linear infinite;
  }

  .loading--small & {
    border-width: 3px;

    &::before {
      top: 3px;
      left: 3px;
      right: 3px;
      bottom: 3px;
      border-width: 2px;
    }

    &::after {
      top: 8px;
      left: 8px;
      right: 8px;
      bottom: 8px;
      border-width: 1px;
    }
  }

  .loading--large & {
    border-width: 5px;

    &::before {
      top: 7px;
      left: 7px;
      right: 7px;
      bottom: 7px;
      border-width: 4px;
    }

    &::after {
      top: 18px;
      left: 18px;
      right: 18px;
      bottom: 18px;
      border-width: 3px;
    }
  }
}

.loading-text {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-top: 8px;
  text-align: center;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.6;
  }
}
</style>
