<template>
  <transition name="toast-fade">
    <div v-if="visible" :class="toastClasses">
      <div class="toast-content">
        <span class="toast-icon">
          <!-- <component :is="iconComponent" /> -->
          <svg v-if="type === 'success'" viewBox="0 0 1024 1024" width="16" height="16">
            <path
              d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"
              fill="currentColor" />
          </svg>
          <svg v-else-if="type === 'warning'" viewBox="0 0 1024 1024" width="16" height="16">
            <path
              d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"
              fill="currentColor" />
          </svg>
          <svg v-else-if="type === 'error'" viewBox="0 0 1024 1024" width="16" height="16">
            <path
              d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 357a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 462.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9-5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"
              fill="currentColor" />
          </svg>
          <svg v-else viewBox="0 0 1024 1024" width="16" height="16">
            <path
              d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"
              fill="currentColor" />
          </svg>

        </span>
        <span class="toast-message">{{ message }}</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

defineOptions({
  name: 'Toast'
})

const props = defineProps({
  // 消息内容
  message: {
    type: String,
    required: true
  },
  // 类型
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'warning', 'error', 'info'].includes(value)
  },
  // 显示时长(ms)，0表示不自动关闭
  duration: {
    type: Number,
    default: 3000
  }
})

const emit = defineEmits(['close'])

const visible = ref(false)
let timer = null

// 计算Toast样式类
const toastClasses = computed(() => {
  return [
    'toast',
    `toast--${props.type}`
  ]
})

// 显示Toast
const show = () => {
  visible.value = true

  // 清除之前的计时器
  if (timer) {
    clearTimeout(timer)
    timer = null
  }

  // 设置自动关闭
  if (props.duration > 0) {
    timer = setTimeout(() => {
      close()
    }, props.duration)
  }
}

// 关闭Toast
const close = () => {
  visible.value = false
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  emit('close')
}

// 暴露方法给外部
defineExpose({
  close,
  show
})

// 组件挂载时显示
onMounted(() => {
  show()
})

// 组件卸载前清除定时器
onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer)
  }
})
</script>

<style lang="scss" scoped>
.toast {
  position: relative;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 4px;
  background-color: var(--card-background);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  min-width: 250px;
  max-width: 80%;
  transition: all 0.3s ease;
  margin: 0 auto;

  // 类型样式
  &--success {
    background-color: #f0f9ff;
    border-left: 4px solid #67c23a;
    color: #67c23a;
  }

  &--warning {
    background-color: #fdf6ec;
    border-left: 4px solid #e6a23c;
    color: #e6a23c;
  }

  &--error {
    background-color: #fef0f0;
    border-left: 4px solid #f56c6c;
    color: #f56c6c;
  }

  &--info {
    background-color: #f4f4f5;
    border-left: 4px solid #909399;
    color: #909399;
  }

  .toast-content {
    display: flex;
    align-items: center;
    flex: 1;
  }

  .toast-icon {
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .toast-message {
    font-size: 14px;
    line-height: 1.5;
    word-break: break-word;
  }

  .toast-close {
    margin-left: 16px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: inherit;
    opacity: 0.7;
    transition: opacity 0.2s;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      opacity: 1;
    }
  }
}

// 过渡动画
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
