<template>
  <div class="base-radio-group" :class="{ 'disabled': disabled, 'vertical': direction === 'vertical' }">
    <label v-if="label" class="group-label">{{ label }}</label>
    <div class="radio-options" :class="`direction-${direction}`">
      <BaseRadio
        v-for="option in options"
        :key="option.value"
        :model-value="modelValue"
        :value="option.value"
        :label="option.label"
        :disabled="disabled || option.disabled"
        :name="groupName"
        @update:model-value="handleChange"
      />
    </div>
    <span v-if="error" class="error-message">{{ error }}</span>
    <span v-else-if="hint" class="hint-message">{{ hint }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseRadio from './BaseRadio.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: ''
  },
  options: {
    type: Array,
    required: true,
    default: () => []
    // 期望格式: [{ label: '选项1', value: 'option1', disabled: false }, ...]
  },
  label: {
    type: String,
    default: ''
  },
  direction: {
    type: String,
    default: 'horizontal', // horizontal | vertical
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  name: {
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
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// 生成唯一的group name
const groupName = computed(() => {
  return props.name || `radio-group-${Math.random().toString(36).substr(2, 9)}`
})

const handleChange = (value) => {
  if (props.disabled) return
  
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped lang="scss">
.base-radio-group {
  width: 100%;
  margin-bottom: 16px;
  
  .group-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-color);
  }
  
  .radio-options {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    
    &.direction-horizontal {
      flex-direction: row;
      align-items: center;
    }
    
    &.direction-vertical {
      flex-direction: column;
      align-items: flex-start;
      
      :deep(.base-radio) {
        margin-right: 0;
        margin-bottom: 12px;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  
  .error-message {
    display: block;
    margin-top: 8px;
    font-size: 12px;
    color: #ff4757;
  }
  
  .hint-message {
    display: block;
    margin-top: 8px;
    font-size: 12px;
    color: var(--text-secondary-color);
  }
  
  &.disabled {
    .group-label {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
  
  &.vertical {
    .radio-options {
      flex-direction: column;
      align-items: flex-start;
    }
  }
}
</style>