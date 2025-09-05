<template>
    <form class="base-form" :class="{
        'label-top': labelPosition === 'top',
        'label-left': labelPosition === 'left',
        'label-right': labelPosition === 'right'
    }" @submit.prevent="handleSubmit">
        <slot></slot>
    </form>
</template>

<script setup>
import { provide, reactive, ref, watch } from 'vue'

const props = defineProps({
    // 表单数据对象
    model: {
        type: Object,
        required: true
    },

    // 表单验证规则
    rules: {
        type: Object,
        default: () => ({})
    },

    // 标签的位置
    labelPosition: {
        type: String,
        default: 'right',
        validator: (value) => ['left', 'right', 'top'].includes(value)
    },

    // 标签的宽度
    labelWidth: {
        type: [String, Number],
        default: '80px'
    },

    // 行内表单模式
    inline: {
        type: Boolean,
        default: false
    },

    // 表单尺寸
    size: {
        type: String,
        default: 'default',
        validator: (value) => ['large', 'default', 'small'].includes(value)
    },

    // 是否禁用该表单内的所有组件
    disabled: {
        type: Boolean,
        default: false
    },

    // 是否显示校验错误信息
    showMessage: {
        type: Boolean,
        default: true
    },

    // 是否在输入框中显示校验结果反馈图标
    statusIcon: {
        type: Boolean,
        default: false
    },

    // 是否在 rules 改变后立即触发一次验证
    validateOnRuleChange: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['submit', 'validate'])

// 存储所有表单项
const fields = reactive({})

// 表单验证状态
const isValidating = ref(false)

// 添加表单项
const addField = (field) => {
    if (field.prop) {
        fields[field.prop] = field
    }
}

// 移除表单项
const removeField = (prop) => {
    if (prop && fields[prop]) {
        delete fields[prop]
    }
}

// 验证整个表单
const validate = async (callback) => {
    if (isValidating.value) return

    isValidating.value = true
    const fieldValues = Object.values(fields)

    if (fieldValues.length === 0) {
        isValidating.value = false
        const result = { valid: true, fields: {} }
        callback?.(result.valid, result.fields)
        emit('validate', result.valid, result.fields)
        return result
    }

    try {
        const results = await Promise.all(
            fieldValues.map(async (field) => {
                const result = await field.validate()
                return {
                    prop: field.prop,
                    ...result
                }
            })
        )

        const invalidFields = results.filter(result => !result.valid)
        const isValid = invalidFields.length === 0

        const fieldsResult = {}
        results.forEach(result => {
            if (!result.valid) {
                fieldsResult[result.prop] = result.message
            }
        })

        isValidating.value = false

        const result = {
            valid: isValid,
            fields: fieldsResult,
            invalidFields: invalidFields.length
        }

        callback?.(result.valid, result.fields)
        emit('validate', result.valid, result.fields)

        return result
    } catch (error) {
        isValidating.value = false
        console.error('表单验证出错:', error)

        const result = { valid: false, fields: {}, error }
        callback?.(false, {})
        emit('validate', false, {})

        return result
    }
}

// 验证指定字段
const validateField = async (prop, callback) => {
    const field = fields[prop]
    if (!field) {
        console.warn(`表单字段 "${prop}" 不存在`)
        return { valid: true }
    }

    try {
        const result = await field.validate()
        callback?.(result.valid ? null : result.message)
        return result
    } catch (error) {
        console.error(`验证字段 "${prop}" 出错:`, error)
        callback?.('验证出错')
        return { valid: false, message: '验证出错' }
    }
}

// 重置整个表单
const resetFields = () => {
    Object.values(fields).forEach(field => {
        field.clearValidate()
    })

    // 重置表单数据到初始状态
    if (props.model && typeof props.model === 'object') {
        resetModelData(props.model)
    }
}

// 重置表单数据
const resetModelData = (obj, initialData = {}) => {
    Object.keys(obj).forEach(key => {
        if (Array.isArray(obj[key])) {
            obj[key] = []
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            resetModelData(obj[key], initialData[key] || {})
        } else {
            obj[key] = initialData[key] || ''
        }
    })
}

// 清除指定字段的验证信息
const clearValidate = (props = []) => {
    const fieldsToClean = props.length
        ? props.filter(prop => fields[prop])
        : Object.values(fields)

    fieldsToClean.forEach(field => {
        if (typeof field === 'string') {
            fields[field]?.clearValidate()
        } else {
            field.clearValidate()
        }
    })
}

// 表单提交处理
const handleSubmit = async (event) => {
    event.preventDefault()

    const result = await validate()
    if (result.valid) {
        emit('submit', props.model, result)
    }

    return result
}

// 滚动到第一个错误字段
const scrollToField = (prop) => {
    const field = fields[prop]
    if (field) {
        // 这里可以添加滚动到字段的逻辑
        console.log(`滚动到字段: ${prop}`)
    }
}

// 监听规则变化
watch(() => props.rules, () => {
    if (props.validateOnRuleChange) {
        // 延迟执行验证，避免频繁触发
        setTimeout(() => {
            validate()
        }, 100)
    }
}, { deep: true })

// 提供给子组件的上下文
provide('formInstance', {
    model: props.model,
    rules: props.rules,
    labelPosition: props.labelPosition,
    labelWidth: props.labelWidth,
    inline: props.inline,
    size: props.size,
    disabled: props.disabled,
    showMessage: props.showMessage,
    statusIcon: props.statusIcon,
    addField,
    removeField
})

// 暴露方法
defineExpose({
    validate,
    validateField,
    resetFields,
    clearValidate,
    scrollToField,
    fields
})
</script>

<style scoped lang="scss">
.base-form {
    &.label-top {
        :deep(.base-form-item) {
            flex-direction: column;

            .form-item-label {
                text-align: left;
                margin-bottom: 8px;
            }
        }
    }

    &.label-left {
        :deep(.base-form-item .form-item-label) {
            text-align: left;
        }
    }

    &.label-right {
        :deep(.base-form-item .form-item-label) {
            text-align: right;
        }
    }

    // 行内表单样式
    &.inline {
        :deep(.base-form-item) {
            display: inline-block;
            margin-right: 20px;
            margin-bottom: 0;
            vertical-align: top;

            &:last-child {
                margin-right: 0;
            }

            .form-item-label {
                display: inline-block;
                vertical-align: middle;
                margin-right: 8px;
            }

            .form-item-content {
                display: inline-block;
                vertical-align: middle;
            }
        }
    }

    // 尺寸变化
    &.size-large {
        :deep(.base-form-item) {
            margin-bottom: 28px;

            .form-item-label {
                font-size: 16px;
                line-height: 44px;
            }
        }

        :deep(.base-input .input-field),
        :deep(.base-textarea .textarea-field) {
            padding: 12px 16px;
            font-size: 16px;
        }
    }

    &.size-small {
        :deep(.base-form-item) {
            margin-bottom: 18px;

            .form-item-label {
                font-size: 12px;
                line-height: 32px;
            }
        }

        :deep(.base-input .input-field),
        :deep(.base-textarea .textarea-field) {
            padding: 6px 8px;
            font-size: 12px;
        }
    }

    // 禁用状态
    &.disabled {
        :deep(.base-form-item) {
            opacity: 0.6;
            pointer-events: none;
        }
    }
}
</style>