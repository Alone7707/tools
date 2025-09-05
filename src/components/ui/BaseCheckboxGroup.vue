<template>
  <div class="base-checkbox-group" :class="{ 'horizontal': direction === 'horizontal', 'vertical': direction === 'vertical' }">
    <div v-if="showSelectAll" class="checkbox-item select-all">
      <BaseCheckbox
        :model-value="isAllSelected"
        :disabled="disabled"
        @change="handleSelectAllChange"
      >
        全选
      </BaseCheckbox>
    </div>
    
    <div v-for="option in options" :key="option.value" class="checkbox-item">
      <BaseCheckbox
        :model-value="isSelected(option.value)"
        :value="option.value"
        :disabled="option.disabled || disabled"
        @change="handleItemChange(option.value, $event)"
      >
        {{ option.label }}
      </BaseCheckbox>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
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
  },
  direction: {
    type: String,
    default: 'vertical',
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  showSelectAll: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// 注入表单项实例
const formItemInstance = inject('formItemInstance', null)

// 检查是否全选
const isAllSelected = computed(() => {
  if (!props.options.length) return false
  
  const enabledOptions = props.options.filter(option => !option.disabled)
  if (!enabledOptions.length) return false
  
  return enabledOptions.every(option => props.modelValue.includes(option.value))
})

// 检查选项是否被选中
const isSelected = (value) => {
  return props.modelValue.includes(value)
}

// 处理全选变化
const handleSelectAllChange = (event) => {
  const checked = event.target.checked
  
  let newValue
  if (checked) {
    // 全选：只添加未禁用的选项
    newValue = [...props.modelValue]
    props.options.forEach(option => {
      if (!option.disabled && !newValue.includes(option.value)) {
        newValue.push(option.value)
      }
    })
  } else {
    // 取消全选：移除所有选项
    newValue = []
  }
  
  emit('update:modelValue', newValue)
  emit('change', newValue)
  
  // 触发表单项验证
  formItemInstance?.onValidationTrigger?.('change')
}

// 处理单个选项变化
const handleItemChange = (value, event) => {
  const checked = event.target.checked
  
  let newValue = [...props.modelValue]
  
  if (checked) {
    // 添加选项
    if (!newValue.includes(value)) {
      newValue.push(value)
    }
  } else {
    // 移除选项
    newValue = newValue.filter(item => item !== value)
  }
  
  emit('update:modelValue', newValue)
  emit('change', newValue)
  
  // 触发表单项验证
  formItemInstance?.onValidationTrigger?.('change')
}
</script>

<style scoped lang="scss">
.base-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &.horizontal {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
  }

  .checkbox-item {
    display: flex;
    align-items: center;

    &.select-all {
      margin-bottom: 8px;
      padding-bottom: 8px;
      border-bottom: 1px dashed var(--border-color);
      font-weight: 500;
    }
  }
}
</style>