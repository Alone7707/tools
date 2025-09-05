<template>
    <div class="base-form-item" :class="{
        'is-error': validateState === 'error',
        'is-validating': validateState === 'validating',
        'is-success': validateState === 'success',
        'is-required': isRequired,
        'label-top': labelPosition === 'top'
    }">
        <label v-if="label || $slots.label" class="form-item-label" :for="labelFor" :style="labelStyle">
            <slot name="label">{{ label }}</slot>
            <span v-if="isRequired" class="required-mark">*</span>
        </label>

        <div class="form-item-content" :style="contentStyle">
            <div class="form-item-control" @blur.capture="handleBlur" @focus.capture="handleFocus"
                @change.capture="handleChange" @input.capture="handleInput">
                <slot></slot>
            </div>

            <transition name="form-error">
                <div v-if="validateState === 'error' && showMessage" class="form-item-error">
                    {{ validateMessage }}
                </div>
            </transition>

            <div v-if="$slots.extra" class="form-item-extra">
                <slot name="extra"></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, provide, ref } from 'vue'
import { FormValidator } from '@shared/validation'

const props = defineProps({
    // 字段标签
    label: {
        type: String,
        default: ''
    },

    // 字段名称，用于验证和数据绑定
    prop: {
        type: String,
        default: ''
    },

    // 验证规则
    rules: {
        type: Array,
        default: () => []
    },

    // 是否显示错误信息
    showMessage: {
        type: Boolean,
        default: true
    },

    // 标签宽度
    labelWidth: {
        type: [String, Number],
        default: ''
    },

    // 内容宽度
    contentWidth: {
        type: [String, Number],
        default: ''
    },

    // 是否必填（用于显示星号）
    required: {
        type: Boolean,
        default: undefined
    },

    // 验证触发方式
    validateTrigger: {
        type: [String, Array],
        default: () => ['blur', 'change']
    }
})

// 注入表单实例
const formInstance = inject('formInstance', null)

// 验证状态
const validateState = ref('')
const validateMessage = ref('')

// 生成唯一的 labelFor
const labelFor = computed(() => {
    return props.prop ? `form-item-${props.prop}` : undefined
})

// 获取表单配置
const labelPosition = computed(() => {
    return formInstance?.labelPosition || 'right'
})

// 计算是否必填
const isRequired = computed(() => {
    if (props.required !== undefined) {
        return props.required
    }

    // 从规则中检查是否有必填规则
    const mergedRules = getMergedRules()
    return mergedRules.some(rule => rule.required)
})

// 合并规则（表单级 + 字段级）
const getMergedRules = () => {
    const formRules = formInstance?.rules || {}
    const propRules = formRules[props.prop] || []
    return [...propRules, ...props.rules]
}

// 标签样式
const labelStyle = computed(() => {
    const style = {}
    const labelWidth = props.labelWidth || formInstance?.labelWidth

    if (labelWidth) {
        style.width = typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth
    }

    return style
})

// 内容样式
const contentStyle = computed(() => {
    const style = {}
    const contentWidth = props.contentWidth

    if (contentWidth) {
        style.width = typeof contentWidth === 'number' ? `${contentWidth}px` : contentWidth
    }

    return style
})

// 验证方法
const validate = async (trigger = '') => {
    if (!props.prop) return { valid: true }

    const rules = getMergedRules()

    // 过滤出符合触发条件的规则
    const triggerRules = trigger
        ? rules.filter(rule => {
            if (!rule.trigger) return true
            const triggers = Array.isArray(rule.trigger) ? rule.trigger : [rule.trigger]
            return triggers.includes(trigger)
        })
        : rules

    if (triggerRules.length === 0) {
        return { valid: true }
    }

    validateState.value = 'validating'

    try {
        const value = getFieldValue()
        const error = await FormValidator.validateField(value, triggerRules)

        if (error) {
            validateState.value = 'error'
            validateMessage.value = error
            return { valid: false, message: error }
        } else {
            validateState.value = 'success'
            validateMessage.value = ''
            return { valid: true }
        }
    } catch (err) {
        validateState.value = 'error'
        validateMessage.value = '验证出错'
        return { valid: false, message: '验证出错' }
    }
}

// 清除验证状态
const clearValidate = () => {
    validateState.value = ''
    validateMessage.value = ''
}

// 获取字段值
const getFieldValue = () => {
    if (!formInstance || !props.prop) return ''
    return getValueByPath(formInstance.model, props.prop)
}

// 通过路径获取值（支持嵌套对象）
const getValueByPath = (obj, path) => {
    const keys = path.split('.')
    let result = obj

    for (const key of keys) {
        if (result == null) return undefined
        result = result[key]
    }

    return result
}

// 事件处理函数
const handleBlur = (event) => {
    if (shouldTriggerValidation('blur')) {
        validate('blur')
    }
}

const handleFocus = (event) => {
    if (shouldTriggerValidation('focus')) {
        validate('focus')
    }
}

const handleChange = (event) => {
    if (shouldTriggerValidation('change')) {
        validate('change')
    }
}

const handleInput = (event) => {
    if (shouldTriggerValidation('input')) {
        validate('input')
    }
}

// 判断是否应该触发验证
const shouldTriggerValidation = (trigger) => {
    if (!props.prop) return false

    const triggers = Array.isArray(props.validateTrigger)
        ? props.validateTrigger
        : [props.validateTrigger]

    return triggers.includes(trigger)
}

// 向表单注册当前字段
onMounted(() => {
    if (formInstance && props.prop) {
        formInstance.addField({
            prop: props.prop,
            validate,
            clearValidate
        })
    }
})

// 从表单注销当前字段
onUnmounted(() => {
    if (formInstance && props.prop) {
        formInstance.removeField(props.prop)
    }
})

// 提供给子组件的方法
provide('formItemInstance', {
    validate,
    clearValidate,
    prop: props.prop,
    labelFor,
    validateTrigger: props.validateTrigger,
    onValidationTrigger: (trigger) => {
        if (shouldTriggerValidation(trigger)) {
            validate(trigger)
        }
    }
})

// 暴露方法
defineExpose({
    validate,
    clearValidate,
    validateState,
    validateMessage
})
</script>

<style scoped lang="scss">
.base-form-item {
    margin-bottom: 22px;
    display: flex;
    align-items: flex-start;

    &.label-top {
        flex-direction: column;

        .form-item-label {
            margin-bottom: 8px;
            text-align: left !important;
        }

        .form-item-content {
            width: 100%;
        }
    }

    .form-item-label {
        display: inline-block;
        padding-right: 12px;
        font-size: 14px;
        color: var(--text-color);
        line-height: 40px;
        text-align: right;
        box-sizing: border-box;
        min-width: 0;
        flex-shrink: 0;

        .required-mark {
            color: #ff4757;
            margin-left: 2px;
        }
    }

    .form-item-content {
        flex: 1;
        min-width: 0;
        position: relative;

        .form-item-control {
            position: relative;

            :deep(.base-input),
            :deep(.base-textarea),
            :deep(.base-radio-group),
            :deep(.base-checkbox-group),
            :deep(.custom-select) {
                width: 100%;
                margin-bottom: 0;
            }
        }

        .form-item-error {
            color: #ff4757;
            font-size: 12px;
            line-height: 1;
            padding-top: 4px;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
        }

        .form-item-extra {
            margin-top: 4px;
            font-size: 12px;
            color: var(--text-secondary-color);
            line-height: 1.5;
        }
    }

    &.is-error {
        .form-item-label {
            color: #ff4757;
        }

        :deep(.base-input .input-field),
        :deep(.base-textarea .textarea-field) {
            border-color: #ff4757;

            &:focus {
                border-color: #ff4757;
                box-shadow: 0 0 0 2px rgba(255, 71, 87, 0.2);
            }
        }
    }

    &.is-validating {
        .form-item-label {
            color: var(--primary-color);
        }
    }

    &.is-success {

        :deep(.base-input .input-field),
        :deep(.base-textarea .textarea-field) {
            border-color: #27ae60;
        }
    }

    &.is-required {
        .form-item-label {
            &::before {
                content: '';
                color: #ff4757;
                margin-right: 4px;
            }
        }
    }
}

// 错误信息动画
.form-error-enter-active,
.form-error-leave-active {
    transition: all 0.3s ease;
}

.form-error-enter-from,
.form-error-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>