<template>
  <div class="base-radio-group" :class="{ 'horizontal': direction === 'horizontal', 'vertical': direction === 'vertical' }">
    <div v-for="option in options" :key="option.value" class="radio-item">
      <input
        :id="`${inputId}-${option.value}`"
        type="radio"
        :name="name"
        :value="option.value"
        :checked="modelValue === option.value"
        :disabled="option.disabled || disabled"
        @change="handleChange"
        class="radio-input"
      />
      <label :for="`${inputId}-${option.value}`" class="radio-label">
        {{ option.label }}
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: ''
  },
  options: {
    type: Array,
    required: true,
    default: () => []
  },
  name: {
    type: String,
    default: () => `radio-${Math.random().toString(36).substr(2, 9)}`
  },
  direction: {
    type: String,
    default: 'vertical',
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// 注入表单项实例
const formItemInstance = inject('formItemInstance', null)

// 生成唯一的组id
const inputId = computed(() => {
  return `radio-group-${Math.random().toString(36).substr(2, 9)}`
})

const handleChange = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
  emit('change', event)

  // 触发表单项验证
  formItemInstance?.onValidationTrigger?.('change')
}
</script>

<style scoped lang="scss">
.base-radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &.horizontal {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
  }

  .radio-item {
    display: flex;
    align-items: center;
    cursor: pointer;

    .radio-input {
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

    .radio-label {
      font-size: 14px;
      color: var(--text-color);
      cursor: pointer;
      user-select: none;

      &:hover {
        color: var(--primary-color);
      }
    }

    &:hover .radio-label {
      color: var(--primary-color);
    }
  }
}
</style>