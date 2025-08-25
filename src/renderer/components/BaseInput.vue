<template>
  <div class="base-input" :class="{ 'has-error': error, 'disabled': disabled }">
    <label v-if="label" class="input-label" :for="inputId">{{ label }}</label>
    <div class="input-wrapper">
      <input :id="inputId" v-bind="$attrs" :value="modelValue" :disabled="disabled" class="input-field"
        @input="handleInput" @blur="handleBlur" @focus="handleFocus" @change="handleChange">
      <span v-if="error" class="error-icon">⚠</span>
    </div>
    <span v-if="error" class="error-message">{{ error }}</span>
    <span v-else-if="hint" class="hint-message">{{ hint }}</span>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'change', 'input'])

// 注入表单项实例
const formItemInstance = inject('formItemInstance', null)

// 生成唯一的input id
const inputId = computed(() => {
  // 如果在FormItem中，使用FormItem的labelFor
  if (formItemInstance?.labelFor) {
    return formItemInstance.labelFor
  }
  return `input-${Math.random().toString(36).substr(2, 9)}`
})

const handleInput = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
  emit('input', event)

  // 触发表单项验证
  formItemInstance?.onValidationTrigger?.('input')
}

const handleBlur = (event) => {
  emit('blur', event)

  // 触发表单项验证
  formItemInstance?.onValidationTrigger?.('blur')
}

const handleFocus = (event) => {
  emit('focus', event)

  // 触发表单项验证
  formItemInstance?.onValidationTrigger?.('focus')
}

const handleChange = (event) => {
  emit('change', event)

  // 触发表单项验证
  formItemInstance?.onValidationTrigger?.('change')
}
</script>

<style scoped lang="scss">
.base-input {
  width: 100%;
  margin-bottom: 16px;

  .input-label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-color);
    cursor: pointer;
  }

  .input-wrapper {
    position: relative;

    .input-field {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background: var(--input-background);
      color: var(--text-color);
      font-size: 14px;
      font-family: inherit;
      transition: all 0.2s ease;
      outline: none;

      &:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
      }

      &:hover:not(:disabled) {
        border-color: var(--primary-color);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background: var(--border-color);
      }

      &::placeholder {
        color: var(--text-secondary-color);
      }
    }

    .error-icon {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #ff4757;
      font-size: 16px;
    }
  }

  .error-message {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    color: #ff4757;
  }

  .hint-message {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    color: var(--text-secondary-color);
  }

  &.has-error {
    .input-field {
      border-color: #ff4757;

      &:focus {
        border-color: #ff4757;
        box-shadow: 0 0 0 2px rgba(255, 71, 87, 0.2);
      }
    }
  }

  &.disabled {
    .input-label {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}
</style>