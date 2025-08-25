<template>
  <div class="base-checkbox" :class="{ 'disabled': disabled, 'checked': isChecked, 'indeterminate': indeterminate }">
    <label class="checkbox-label" :for="checkboxId">
      <input
        :id="checkboxId"
        v-bind="$attrs"
        type="checkbox"
        :checked="isChecked"
        :disabled="disabled"
        :value="value"
        class="checkbox-input"
        @change="handleChange"
      >
      <span class="checkbox-custom">
        <span class="checkbox-icon">
          <svg v-if="indeterminate" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12H18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <svg v-else-if="isChecked" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </span>
      <span v-if="label || $slots.default" class="checkbox-text">
        <slot>{{ label }}</slot>
      </span>
    </label>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Boolean, Array],
    default: false
  },
  value: {
    type: [String, Number, Boolean],
    default: true
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  indeterminate: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// 生成唯一的checkbox id
const checkboxId = computed(() => {
  return `checkbox-${Math.random().toString(36).substr(2, 9)}`
})

const isChecked = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(props.value)
  }
  return Boolean(props.modelValue)
})

const handleChange = (event) => {
  if (props.disabled) return
  
  const checked = event.target.checked
  let newValue
  
  if (Array.isArray(props.modelValue)) {
    // 数组模式，用于checkbox group
    newValue = [...props.modelValue]
    if (checked) {
      if (!newValue.includes(props.value)) {
        newValue.push(props.value)
      }
    } else {
      const index = newValue.indexOf(props.value)
      if (index > -1) {
        newValue.splice(index, 1)
      }
    }
  } else {
    // 布尔模式，单个checkbox
    newValue = checked
  }
  
  emit('update:modelValue', newValue)
  emit('change', newValue, event)
}
</script>

<style scoped lang="scss">
.base-checkbox {
  display: inline-block;
  margin-right: 16px;
  margin-bottom: 8px;
  
  .checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    
    .checkbox-input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }
    
    .checkbox-custom {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      border: 2px solid var(--border-color);
      border-radius: 3px;
      background: var(--input-background);
      transition: all 0.2s ease;
      margin-right: 8px;
      
      .checkbox-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 12px;
        height: 12px;
        color: white;
        opacity: 0;
        transform: scale(0.5);
        transition: all 0.2s ease;
        
        svg {
          width: 100%;
          height: 100%;
        }
      }
    }
    
    .checkbox-text {
      font-size: 14px;
      color: var(--text-color);
      line-height: 1.5;
      user-select: none;
    }
    
    &:hover:not(.disabled) {
      .checkbox-custom {
        border-color: var(--primary-color);
      }
    }
  }
  
  &.checked, &.indeterminate {
    .checkbox-custom {
      border-color: var(--primary-color);
      background: var(--primary-color);
      
      .checkbox-icon {
        opacity: 1;
        transform: scale(1);
      }
    }
  }
  
  &.disabled {
    .checkbox-label {
      cursor: not-allowed;
      opacity: 0.6;
    }
    
    .checkbox-custom {
      background: var(--border-color);
      border-color: var(--border-color);
    }
    
    .checkbox-text {
      color: var(--text-secondary-color);
    }
    
    &.checked, &.indeterminate {
      .checkbox-custom {
        background: var(--text-secondary-color);
        border-color: var(--text-secondary-color);
      }
    }
  }
}
</style>