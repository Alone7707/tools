<template>
  <div class="base-textarea" :class="{ 'has-error': error, 'disabled': disabled }">
    <label v-if="label" class="textarea-label" :for="textareaId">{{ label }}</label>
    <div class="textarea-wrapper">
      <textarea :id="textareaId" v-bind="$attrs" :value="modelValue" :disabled="disabled" :rows="rows"
        class="textarea-field" @input="handleInput" @blur="handleBlur" @focus="handleFocus"
        @change="handleChange"></textarea>
      <span v-if="error" class="error-icon">⚠</span>
    </div>
    <div v-if="showCount" class="char-count">
      {{ currentLength }}/{{ maxLength || '∞' }}
    </div>
    <span v-if="error" class="error-message">{{ error }}</span>
    <span v-else-if="hint" class="hint-message">{{ hint }}</span>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
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
  },
  rows: {
    type: [String, Number],
    default: 4
  },
  maxLength: {
    type: Number,
    default: null
  },
  showCount: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'change', 'input'])

// 注入表单项实例
const formItemInstance = inject('formItemInstance', null)

// 生成唯一的textarea id
const textareaId = computed(() => {
  // 如果在FormItem中，使用FormItem的labelFor
  if (formItemInstance?.labelFor) {
    return formItemInstance.labelFor
  }
  return `textarea-${Math.random().toString(36).substr(2, 9)}`
})

const currentLength = computed(() => {
  return String(props.modelValue).length
})

const handleInput = (event) => {
  const value = event.target.value
  // 如果设置了最大长度，进行限制
  if (props.maxLength && value.length > props.maxLength) {
    return
  }
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
.base-textarea {
  width: 100%;
  margin-bottom: 16px;

  .textarea-label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-color);
    cursor: pointer;
  }

  .textarea-wrapper {
    position: relative;

    .textarea-field {
      width: 100%;
      padding: 12px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background: var(--input-background);
      color: var(--text-color);
      font-size: 14px;
      font-family: inherit;
      transition: all 0.2s ease;
      outline: none;
      resize: vertical;
      min-height: 80px;
      line-height: 1.5;

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
        resize: none;
      }

      &::placeholder {
        color: var(--text-secondary-color);
      }
    }

    .error-icon {
      position: absolute;
      right: 12px;
      top: 12px;
      color: #ff4757;
      font-size: 16px;
    }
  }

  .char-count {
    text-align: right;
    margin-top: 4px;
    font-size: 12px;
    color: var(--text-secondary-color);
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
    .textarea-field {
      border-color: #ff4757;

      &:focus {
        border-color: #ff4757;
        box-shadow: 0 0 0 2px rgba(255, 71, 87, 0.2);
      }
    }

    .char-count {
      color: #ff4757;
    }
  }

  &.disabled {
    .textarea-label {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}
</style>