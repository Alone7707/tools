<template>
  <div class="base-checkbox" :class="{ 'disabled': disabled }">
    <input
      :id="inputId"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="handleChange"
      class="checkbox-input"
    />
    <label :for="inputId" class="checkbox-label">
      <slot>{{ label }}</slot>
    </label>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Boolean, String, Number],
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  value: {
    type: [String, Number, Boolean],
    default: undefined
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// 注入表单项实例
const formItemInstance = inject('formItemInstance', null)

// 生成唯一的input id
const inputId = computed(() => {
  return `checkbox-${Math.random().toString(36).substr(2, 9)}`
})

const handleChange = (event) => {
  const checked = event.target.checked
  
  // 如果有value属性，则返回value，否则返回checked状态
  const value = props.value !== undefined ? props.value : checked
  
  emit('update:modelValue', value)
  emit('change', event)

  // 触发表单项验证
  formItemInstance?.onValidationTrigger?.('change')
}
</script>

<style scoped lang="scss">
.base-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  .checkbox-input {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    cursor: pointer;
    accent-color: var(--primary-color);

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  .checkbox-label {
    font-size: 14px;
    color: var(--text-color);
    cursor: pointer;
    user-select: none;
    line-height: 1.5;

    &:hover {
      color: var(--primary-color);
    }
  }

  &:hover .checkbox-label {
    color: var(--primary-color);
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.6;

    .checkbox-label {
      cursor: not-allowed;
    }
  }
}
</style>