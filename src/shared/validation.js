/**
 * 表单验证规则系统
 * 提供常用的验证规则和自定义验证功能
 */

// 验证规则类型定义
export const VALIDATION_TRIGGER = {
    BLUR: 'blur',
    CHANGE: 'change',
    INPUT: 'input'
}

// 内置验证规则
export const BUILT_IN_RULES = {
    // 必填验证
    required: (message = '此字段为必填项') => ({
        required: true,
        message,
        trigger: [VALIDATION_TRIGGER.BLUR, VALIDATION_TRIGGER.CHANGE]
    }),

    // 邮箱验证
    email: (message = '请输入正确的邮箱地址') => ({
        type: 'email',
        message,
        trigger: [VALIDATION_TRIGGER.BLUR]
    }),

    // 手机号验证
    phone: (message = '请输入正确的手机号码') => ({
        pattern: /^1[3-9]\d{9}$/,
        message,
        trigger: [VALIDATION_TRIGGER.BLUR]
    }),

    // 长度验证
    length: (min, max, message) => ({
        min,
        max,
        message: message || `长度在 ${min} 到 ${max} 个字符`,
        trigger: [VALIDATION_TRIGGER.BLUR]
    }),

    // 最小长度
    minLength: (min, message) => ({
        min,
        message: message || `最少 ${min} 个字符`,
        trigger: [VALIDATION_TRIGGER.BLUR]
    }),

    // 最大长度
    maxLength: (max, message) => ({
        max,
        message: message || `最多 ${max} 个字符`,
        trigger: [VALIDATION_TRIGGER.BLUR]
    }),

    // 数字验证
    number: (message = '请输入数字') => ({
        type: 'number',
        message,
        trigger: [VALIDATION_TRIGGER.BLUR]
    }),

    // 数字范围验证
    numberRange: (min, max, message) => ({
        type: 'number',
        min,
        max,
        message: message || `请输入 ${min} 到 ${max} 之间的数字`,
        trigger: [VALIDATION_TRIGGER.BLUR]
    }),

    // URL验证
    url: (message = '请输入正确的URL地址') => ({
        type: 'url',
        message,
        trigger: [VALIDATION_TRIGGER.BLUR]
    }),

    // 正则表达式验证
    pattern: (pattern, message = '格式不正确') => ({
        pattern,
        message,
        trigger: [VALIDATION_TRIGGER.BLUR]
    }),

    // 自定义验证函数
    validator: (validator, message, trigger = [VALIDATION_TRIGGER.BLUR]) => ({
        validator,
        message,
        trigger
    })
}

// 验证器类
export class FormValidator {
    /**
     * 验证单个字段
     * @param {*} value - 要验证的值
     * @param {Array} rules - 验证规则数组
     * @returns {Promise} - 验证结果
     */
    static async validateField(value, rules = []) {
        const errors = []

        for (const rule of rules) {
            try {
                const error = await this.validateSingleRule(value, rule)
                if (error) {
                    errors.push(error)
                    // 如果是必填验证失败，直接返回，不再执行后续验证
                    if (rule.required) {
                        break
                    }
                }
            } catch (err) {
                errors.push(err.message || '验证出错')
            }
        }

        return errors.length > 0 ? errors[0] : null
    }

    /**
     * 验证单个规则
     * @param {*} value - 要验证的值
     * @param {Object} rule - 验证规则
     * @returns {Promise} - 验证结果
     */
    static async validateSingleRule(value, rule) {
        // 必填验证
        if (rule.required) {
            if (this.isEmpty(value)) {
                return rule.message || '此字段为必填项'
            }
        }

        // 如果值为空且不是必填，跳过其他验证
        if (this.isEmpty(value) && !rule.required) {
            return null
        }

        // 类型验证
        if (rule.type) {
            const typeError = this.validateType(value, rule.type, rule.message)
            if (typeError) return typeError
        }

        // 长度验证
        if (rule.min !== undefined || rule.max !== undefined) {
            const lengthError = this.validateLength(value, rule.min, rule.max, rule.message)
            if (lengthError) return lengthError
        }

        // 正则表达式验证
        if (rule.pattern) {
            const patternError = this.validatePattern(value, rule.pattern, rule.message)
            if (patternError) return patternError
        }

        // 自定义验证函数
        if (rule.validator && typeof rule.validator === 'function') {
            return await this.validateCustom(value, rule.validator, rule.message, rule)
        }

        return null
    }

    /**
     * 检查值是否为空
     */
    static isEmpty(value) {
        if (value === null || value === undefined) return true
        if (typeof value === 'string') return value.trim() === ''
        if (Array.isArray(value)) return value.length === 0
        return false
    }

    /**
     * 类型验证
     */
    static validateType(value, type, message) {
        switch (type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                return emailRegex.test(value) ? null : (message || '请输入正确的邮箱地址')

            case 'url':
                try {
                    new URL(value)
                    return null
                } catch {
                    return message || '请输入正确的URL地址'
                }

            case 'number':
                return !isNaN(Number(value)) ? null : (message || '请输入数字')

            case 'array':
                if (!Array.isArray(value)) {
                    return message || '请选择至少一项'
                }
                if (value.length === 0) {
                    return message || '请选择至少一项'
                }
                return null

            case 'date':
                const date = new Date(value)
                return !isNaN(date.getTime()) ? null : (message || '请选择日期')

            default:
                return null
        }
    }

    /**
     * 长度验证
     */
    static validateLength(value, min, max, message) {
        const length = String(value).length

        if (min !== undefined && length < min) {
            return message || `最少 ${min} 个字符`
        }

        if (max !== undefined && length > max) {
            return message || `最多 ${max} 个字符`
        }

        return null
    }

    /**
     * 正则表达式验证
     */
    static validatePattern(value, pattern, message) {
        const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern)
        return regex.test(value) ? null : (message || '格式不正确')
    }

    /**
     * 自定义验证
     */
    static async validateCustom(value, validator, message, rule = {}) {
        try {
            // Element Plus 风格的 validator：(rule, value, callback) => {}
            if (validator.length >= 3) {
                return new Promise((resolve) => {
                    const callback = (error) => {
                        if (error) {
                            resolve(error instanceof Error ? error.message : error)
                        } else {
                            resolve(null)
                        }
                    }
                    validator(rule, value, callback)
                })
            } else {
                // 旧风格的 validator: (value) => boolean | string
                const result = await validator(value)
                if (result === true) return null
                if (result === false) return message || '验证失败'
                return result || null
            }
        } catch (error) {
            return error.message || message || '验证出错'
        }
    }
}

// 导出常用的验证规则组合
export const commonRules = {
    // 用户名规则
    username: [
        BUILT_IN_RULES.required('请输入用户名'),
        BUILT_IN_RULES.length(3, 20, '用户名长度为3-20个字符'),
        BUILT_IN_RULES.pattern(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线')
    ],

    // 密码规则
    password: [
        BUILT_IN_RULES.required('请输入密码'),
        BUILT_IN_RULES.minLength(6, '密码至少6位'),
        BUILT_IN_RULES.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码需要包含大小写字母和数字')
    ],

    // 邮箱规则
    email: [
        BUILT_IN_RULES.required('请输入邮箱'),
        BUILT_IN_RULES.email()
    ],

    // 手机号规则
    phone: [
        BUILT_IN_RULES.required('请输入手机号'),
        BUILT_IN_RULES.phone()
    ]
}