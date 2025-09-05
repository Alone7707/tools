<template>
  <div class="base-radio" :class="{ 'disabled': disabled, 'checked': isChecked }">
    <label class="radio-label" :for="radioId">
      <input
        :id="radioId"
        v-bind="$attrs"
        type="radio"
        :value="value"
        :checked="isChecked"
        :disabled="disabled"
        :name="name"
        class="radio-input"
        @change="handleChange"
      >
      <span class="radio-custom">
        <span class="radio-dot"></span>
      </span>
      <span v-if="label || $slots.default" class="radio-text">
        <slot>{{ label }}</slot>
      </span>
    </label>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: ''
  },
  value: {
    type: [String, Number, Boolean],
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// 生成唯一的radio id
const radioId = computed(() => {
  return `radio-${Math.random().toString(36).substr(2, 9)}`
})

const isChecked = computed(() => {
  return props.modelValue === props.value
})

const handleChange = (event) => {
  if (props.disabled) return
  
  const value = props.value
  emit('update:modelValue', value)
  emit('change', value, event)
}
</script>

<style scoped lang="scss">
.base-radio {
  display: inline-block;
  margin-right: 16px;
  margin-bottom: 8px;
  
  .radio-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    
    .radio-input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }
    
    .radio-custom {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      border: 2px solid var(--border-color);
      border-radius: 50%;
      background: var(--input-background);
      transition: all 0.2s ease;
      margin-right: 8px;
      
      .radio-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--primary-color);
        transform: scale(0);
        transition: all 0.2s ease;
      }
    }
    
    .radio-text {
      font-size: 14px;
      color: var(--text-color);
      line-height: 1.5;
      user-select: none;
    }
    
    &:hover:not(.disabled) {
      .radio-custom {
        border-color: var(--primary-color);
      }
    }
  }
  
  &.checked {
    .radio-custom {
      border-color: var(--primary-color);
      background: var(--input-background);
      
      .radio-dot {
        transform: scale(1);
      }
    }
  }
  
  &.disabled {
    .radio-label {
      cursor: not-allowed;
      opacity: 0.6;
    }
    
    .radio-custom {
      background: var(--border-color);
      border-color: var(--border-color);
    }
    
    .radio-text {
      color: var(--text-secondary-color);
    }
    
    &.checked {
      .radio-custom {
        .radio-dot {
          background: var(--text-secondary-color);
        }
      }
    }
  }
}
</style>