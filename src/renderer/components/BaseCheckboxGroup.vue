<template>
  <div class="base-checkbox-group" :class="{ 'disabled': disabled, 'vertical': direction === 'vertical' }">
    <label v-if="label" class="group-label">{{ label }}</label>
    <div class="checkbox-options" :class="`direction-${direction}`">
      <div v-if="showSelectAll" class="select-all-wrapper">
        <BaseCheckbox
          :model-value="selectAllChecked"
          :indeterminate="selectAllIndeterminate"
          :disabled="disabled"
          :label="selectAllText"
          @update:model-value="handleSelectAll"
        />
        <div class="divider"></div>
      </div>
      <BaseCheckbox
        v-for="option in options"
        :key="option.value"
        :model-value="modelValue"
        :value="option.value"
        :label="option.label"
        :disabled="disabled || option.disabled"
        @update:model-value="handleChange"
      />
    </div>
    <span v-if="error" class="error-message">{{ error }}</span>
    <span v-else-if="hint" class="hint-message">{{ hint }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseCheckbox from './BaseCheckbox.vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
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
  showSelectAll: {
    type: Boolean,
    default: false
  },
  selectAllText: {
    type: String,
    default: '全选'
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: null
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

// 可选择的选项（排除禁用的）
const availableOptions = computed(() => {
  return props.options.filter(option => !option.disabled)
})

// 全选状态
const selectAllChecked = computed(() => {
  if (!availableOptions.value.length) return false
  return availableOptions.value.every(option => props.modelValue.includes(option.value))
})

// 全选半选状态
const selectAllIndeterminate = computed(() => {
  if (selectAllChecked.value) return false
  return availableOptions.value.some(option => props.modelValue.includes(option.value))
})

const handleChange = (newValue) => {
  if (props.disabled) return
  
  // 检查最小/最大选择数量限制
  if (props.min && newValue.length < props.min) {
    return
  }
  
  if (props.max && newValue.length > props.max) {
    return
  }
  
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

const handleSelectAll = (checked) => {
  if (props.disabled) return
  
  let newValue
  if (checked) {
    // 全选：添加所有可选择的选项
    const allValues = availableOptions.value.map(option => option.value)
    newValue = [...new Set([...props.modelValue, ...allValues])]
  } else {
    // 取消全选：移除所有可选择的选项
    const availableValues = availableOptions.value.map(option => option.value)
    newValue = props.modelValue.filter(value => !availableValues.includes(value))
  }
  
  // 检查最大选择数量限制
  if (props.max && newValue.length > props.max) {
    return
  }
  
  emit('update:modelValue', newValue)
  emit('change', newValue)
}
</script>

<style scoped lang="scss">
.base-checkbox-group {
  width: 100%;
  margin-bottom: 16px;
  
  .group-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-color);
  }
  
  .checkbox-options {
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
      
      :deep(.base-checkbox) {
        margin-right: 0;
        margin-bottom: 12px;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    
    .select-all-wrapper {
      width: 100%;
      
      .divider {
        height: 1px;
        background: var(--border-color);
        margin: 8px 0;
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
    .checkbox-options {
      flex-direction: column;
      align-items: flex-start;
    }
  }
}
</style>