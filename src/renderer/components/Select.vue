<template>
  <div class="custom-select" :class="{ 'select-open': isOpen }">
    <div class="select-trigger" @click="toggleDropdown">
      <span class="selected-value">{{ selectedLabel }}</span>
      <span class="select-arrow">▼</span>
    </div>
    
    <div v-if="isOpen" class="select-dropdown">
      <div class="select-options">
        <div
          v-for="(option, index) in options"
          :key="index"
          class="select-option"
          :class="{ 'selected': isSelected(option), 'disabled': option.disabled }"
          @click="selectOption(option)"
        >
          {{ option.label }}
        </div>
      </div>
    </div>
    
    <!-- 原生select用于表单提交和保持原生行为 -->
    <select
      v-bind="$attrs"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      style="display: none"
    >
      <option
        v-for="(option, index) in options"
        :key="index"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

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
  placeholder: {
    type: String,
    default: '请选择'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)

const selectedLabel = computed(() => {
  const selectedOption = props.options.find(option => option.value === props.modelValue)
  return selectedOption ? selectedOption.label : props.placeholder
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (option) => {
  if (option.disabled) return
  
  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
}

const isSelected = (option) => {
  return option.value === props.modelValue
}

const handleClickOutside = (event) => {
  const selectElement = event.target.closest('.custom-select')
  if (!selectElement) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="scss">
.custom-select {
  position: relative;
  width: 100%;
  
  .select-trigger {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--input-background, white);
    color: var(--text-color);
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 38px;
    
    &:hover {
      border-color: var(--primary-color);
    }
    
    .selected-value {
      flex: 1;
      text-align: left;
    }
    
    .select-arrow {
      transition: transform 0.2s ease;
      font-size: 12px;
      color: var(--text-secondary-color);
    }
  }
  
  &.select-open {
    .select-trigger {
      border-color: var(--primary-color);
      
      .select-arrow {
        transform: rotate(180deg);
      }
    }
    
    .select-dropdown {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
  }
  
  .select-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 4px;
    background: var(--input-background, white);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.2s ease;
    pointer-events: none;
    
    .select-options {
      max-height: 200px;
      overflow-y: auto;
      
      .select-option {
        padding: 8px 12px;
        cursor: pointer;
        transition: background-color 0.2s ease;
        color: var(--text-color);
        
        &:hover {
          background: rgba(var(--primary-color-rgb), 0.1);
        }
        
        &.selected {
          background: var(--primary-color);
          color: white;
        }
        
        &.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          
          &:hover {
            background: transparent;
          }
        }
      }
    }
  }
}
</style>