<template>
    <button :class="buttonClasses" :disabled="disabled || loading" :type="nativeType" v-bind="$attrs"
        @click="handleClick">
        <!-- 加载图标 -->
        <span v-if="loading" class="btn-icon btn-loading">
            <svg viewBox="0 0 1024 1024" class="loading-icon">
                <path
                    d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C637 83.6 579.4 72 520 72s-117 11.6-171.3 34.6a440.45 440.45 0 00-139.9 94.3 437.71 437.71 0 00-94.3 139.9C91.6 395 80 452.6 80 512s11.6 117 34.6 171.3a440.45 440.45 0 0094.3 139.9 437.71 437.71 0 00139.9 94.3C395 940.4 452.6 952 512 952s117-11.6 171.3-34.6a440.45 440.45 0 00139.9-94.3 437.71 437.71 0 0094.3-139.9C940.4 629 952 571.4 952 512c0-19.9 16.1-36 36-36s36 16.1 36 36c0 256.1-207.9 464-464 464S48 768.1 48 512 255.9 48 512 48s464 207.9 464 464c0 19.9-16.1 36-36 36z" />
            </svg>
        </span>

        <!-- 前置图标 -->
        <span v-if="!loading && icon && iconPosition === 'left'" class="btn-icon">
            <component :is="icon" v-if="typeof icon === 'object'" />
            <span v-else class="icon-text">{{ icon }}</span>
        </span>

        <!-- 按钮内容 -->
        <span v-if="$slots.default" class="btn-content">
            <slot />
        </span>

        <!-- 后置图标 -->
        <span v-if="!loading && icon && iconPosition === 'right'" class="btn-icon">
            <component :is="icon" v-if="typeof icon === 'object'" />
            <span v-else class="icon-text">{{ icon }}</span>
        </span>
    </button>
</template>

<script setup>
import { computed, getCurrentInstance } from 'vue'

defineOptions({
    name: 'BaseButton',
    inheritAttrs: false
})

const props = defineProps({
    // 按钮类型
    type: {
        type: String,
        default: 'default',
        validator: (value) => ['default', 'primary', 'secondary', 'success', 'warning', 'danger', 'info', 'text', 'link'].includes(value)
    },
    // 按钮尺寸
    size: {
        type: String,
        default: 'medium',
        validator: (value) => ['mini', 'small', 'medium', 'large'].includes(value)
    },
    // 是否为朴素按钮
    plain: {
        type: Boolean,
        default: false
    },
    // 是否为圆角按钮
    round: {
        type: Boolean,
        default: false
    },
    // 是否为圆形按钮
    circle: {
        type: Boolean,
        default: false
    },
    // 是否禁用
    disabled: {
        type: Boolean,
        default: false
    },
    // 是否加载中
    loading: {
        type: Boolean,
        default: false
    },
    // 图标
    icon: {
        type: [String, Object],
        default: null
    },
    // 图标位置
    iconPosition: {
        type: String,
        default: 'left',
        validator: (value) => ['left', 'right'].includes(value)
    },
    // 原生按钮类型
    nativeType: {
        type: String,
        default: 'button',
        validator: (value) => ['button', 'submit', 'reset'].includes(value)
    },
    // 是否为块级按钮
    block: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['click'])

// 计算按钮样式类
const buttonClasses = computed(() => {
    return [
        'base-button',
        `base-button--${props.type}`,
        `base-button--${props.size}`,
        {
            'base-button--plain': props.plain,
            'base-button--round': props.round,
            'base-button--circle': props.circle,
            'base-button--disabled': props.disabled,
            'base-button--loading': props.loading,
            'base-button--block': props.block,
            'base-button--icon-only': !getCurrentInstance().slots.default && (props.icon || props.loading)
        }
    ]
})

// 点击事件处理
const handleClick = (event) => {
    if (!props.disabled && !props.loading) {
        emit('click', event)
    }
}
</script>

<style lang="scss" scoped>
.base-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: var(--background-color);
    border: 1px solid var(--border-color);
    color: var(--text-color);
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    font-weight: 500;
    user-select: none;
    transition: all 0.2s ease;
    font-family: inherit;
    text-decoration: none;

    &:hover {
        opacity: 0.8;
        border-color: var(--primary-color);
    }

    &:focus {
        outline: 2px solid rgba(var(--primary-color-rgb), 0.2);
        outline-offset: 2px;
    }

    &:active {
        transform: translateY(1px);
    }

    // 按钮类型样式
    &--primary {
        background: var(--primary-color);
        border-color: var(--primary-color);
        color: white;

        &:hover {
            opacity: 0.9;
            border-color: var(--primary-color);
        }

        &.base-button--plain {
            background: transparent;
            color: var(--primary-color);

            &:hover {
                background: var(--primary-color);
                color: white;
            }
        }
    }

    &--secondary {
        background: var(--text-secondary-color);
        border-color: var(--text-secondary-color);
        color: white;

        &:hover {
            opacity: 0.9;
        }

        &.base-button--plain {
            background: transparent;
            color: var(--text-secondary-color);

            &:hover {
                background: var(--text-secondary-color);
                color: white;
            }
        }
    }

    &--success {
        background: #67c23a;
        border-color: #67c23a;
        color: white;

        &:hover {
            opacity: 0.9;
        }

        &.base-button--plain {
            background: transparent;
            color: #67c23a;

            &:hover {
                background: #67c23a;
                color: white;
            }
        }
    }

    &--warning {
        background: #e6a23c;
        border-color: #e6a23c;
        color: white;

        &:hover {
            opacity: 0.9;
        }

        &.base-button--plain {
            background: transparent;
            color: #e6a23c;

            &:hover {
                background: #e6a23c;
                color: white;
            }
        }
    }

    &--danger {
        background: #f56c6c;
        border-color: #f56c6c;
        color: white;

        &:hover {
            opacity: 0.9;
        }

        &.base-button--plain {
            background: transparent;
            color: #f56c6c;

            &:hover {
                background: #f56c6c;
                color: white;
            }
        }
    }

    &--info {
        background: #909399;
        border-color: #909399;
        color: white;

        &:hover {
            opacity: 0.9;
        }

        &.base-button--plain {
            background: transparent;
            color: #909399;

            &:hover {
                background: #909399;
                color: white;
            }
        }
    }

    &--text {
        background: transparent;
        border-color: transparent;
        color: var(--primary-color);
        padding-left: 0;
        padding-right: 0;

        &:hover {
            background: rgba(var(--primary-color-rgb), 0.1);
            border-color: transparent;
        }
    }

    &--link {
        background: transparent;
        border-color: transparent;
        color: var(--primary-color);
        text-decoration: underline;
        padding-left: 0;
        padding-right: 0;

        &:hover {
            opacity: 0.8;
            background: transparent;
            border-color: transparent;
        }
    }

    // 按钮尺寸
    &--mini {
        padding: 4px 8px;
        font-size: 12px;
        border-radius: 3px;

        &.base-button--circle {
            width: 24px;
            height: 24px;
            padding: 0;
        }
    }

    &--small {
        padding: 6px 12px;
        font-size: 13px;
        border-radius: 4px;

        &.base-button--circle {
            width: 32px;
            height: 32px;
            padding: 0;
        }
    }

    &--medium {
        padding: 8px 16px;
        font-size: 14px;
        border-radius: 4px;

        &.base-button--circle {
            width: 40px;
            height: 40px;
            padding: 0;
        }
    }

    &--large {
        padding: 12px 24px;
        font-size: 16px;
        border-radius: 6px;

        &.base-button--circle {
            width: 48px;
            height: 48px;
            padding: 0;
        }
    }

    // 特殊形状
    &--round {
        border-radius: 20px;
    }

    &--circle {
        border-radius: 50%;
    }

    // 状态
    &--disabled {
        cursor: not-allowed;
        opacity: 0.6;

        &:hover {
            opacity: 0.6;
            transform: none;
        }

        &:active {
            transform: none;
        }
    }

    &--loading {
        cursor: default;

        &:hover {
            transform: none;
        }

        &:active {
            transform: none;
        }
    }

    // 块级按钮
    &--block {
        width: 100%;
        display: flex;
    }

    // 只有图标的按钮
    &--icon-only {
        padding-left: 8px;
        padding-right: 8px;

        &.base-button--mini {
            padding: 4px;
        }

        &.base-button--small {
            padding: 6px;
        }

        &.base-button--medium {
            padding: 8px;
        }

        &.base-button--large {
            padding: 12px;
        }
    }
}

// 按钮内容
.btn-content {
    display: inline-flex;
    align-items: center;
}

// 图标样式
.btn-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:not(:last-child) {
        margin-right: 6px;
    }

    &:not(:first-child) {
        margin-left: 6px;
    }

    .icon-text {
        font-size: 1em;
    }

    svg {
        width: 1em;
        height: 1em;
        fill: currentColor;
    }
}

// 加载动画
.btn-loading {
    .loading-icon {
        animation: loading-rotate 2s linear infinite;
    }
}

@keyframes loading-rotate {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

// 按钮组间距
.base-button+.base-button {
    margin-left: 8px;
}
</style>