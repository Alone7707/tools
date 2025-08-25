<template>
    <BaseMenu :items="menuItems" title="Electron Tools" :default-collapsed="false" width="220px" collapsed-width="64px"
        @menu-click="handleMenuClick" @update:collapsed="handleCollapseChange" class="main-menu">
        <template #footer="{ collapsed }">
            <div class="menu-footer-content">
                <div v-if="!collapsed" class="user-section">
                    <div class="user-avatar">👤</div>
                    <div class="user-info">
                        <div class="user-name">开发者</div>
                        <div class="user-role">Developer</div>
                    </div>
                    <BaseButton type="text" size="small" icon="⚙️" @click="goToSettings" title="设置" />
                </div>
                <BaseButton v-else type="text" icon="⚙️" @click="goToSettings" title="设置" />
            </div>
        </template>
    </BaseMenu>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseMenu from './BaseMenu.vue'
import BaseButton from './BaseButton.vue'

const router = useRouter()

// 菜单数据配置
const menuItems = computed(() => [
    {
        path: '/',
        title: '仪表盘',
        icon: '📊'
    },
    {
        key: 'components',
        title: '组件演示',
        icon: '🧩',
        badge: 'New',
        children: [
            {
                path: '/form-demo',
                title: '基础表单',
                icon: '📝'
            },
            {
                path: '/advanced-form',
                title: '高级表单',
                icon: '📋',
                badge: '2'
            },
            {
                path: '/button-demo',
                title: '按钮组件',
                icon: '🔘'
            },
            {
                path: '/menu-demo',
                title: '菜单组件',
                icon: '📑'
            }
        ]
    },
    {
        key: 'tools',
        title: '工具集合',
        icon: '🔧',
        children: [
            {
                path: '/file-manager',
                title: '文件管理',
                icon: '📁'
            },
            {
                path: '/text-editor',
                title: '文本编辑',
                icon: '📝'
            },
            {
                path: '/image-viewer',
                title: '图片查看',
                icon: '🖼️'
            },
            {
                path: '/code-formatter',
                title: '代码格式化',
                icon: '💻'
            }
        ]
    },
    {
        key: 'system',
        title: '系统管理',
        icon: '⚙️',
        children: [
            {
                path: '/system-info',
                title: '系统信息',
                icon: '💻'
            },
            {
                path: '/performance',
                title: '性能监控',
                icon: '📊'
            },
            {
                path: '/logs',
                title: '日志查看',
                icon: '📋',
                badge: '99+'
            }
        ]
    },
    {
        path: '/help',
        title: '帮助文档',
        icon: '❓'
    }
])

// 事件处理
const handleMenuClick = (item) => {
    console.log('菜单点击:', item)
    // 这里可以添加菜单点击的统计或其他逻辑
}

const handleCollapseChange = (collapsed) => {
    console.log('菜单收起状态改变:', collapsed)
    // 这里可以保存用户偏好到本地存储
    localStorage.setItem('menuCollapsed', JSON.stringify(collapsed))
}

const goToSettings = () => {
    router.push('/settings')
}
</script>

<style lang="scss" scoped>
.main-menu {
    // 自定义主菜单样式
    border-right: 2px solid var(--border-color);
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);

    :deep(.menu-header) {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;

        .menu-title {
            color: white;
            font-weight: bold;
        }

        .collapse-btn {
            color: white;

            &:hover {
                background: rgba(255, 255, 255, 0.1);
            }
        }
    }

    .menu-footer-content {
        .user-section {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px;
            border-radius: 6px;
            background: var(--input-background);

            .user-avatar {
                width: 32px;
                height: 32px;
                background: var(--primary-color);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 16px;
            }

            .user-info {
                flex: 1;
                min-width: 0;

                .user-name {
                    font-size: 14px;
                    font-weight: 500;
                    color: var(--text-color);
                    margin-bottom: 2px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .user-role {
                    font-size: 12px;
                    color: var(--text-secondary-color);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
}

// 深色主题适配
.dark .main-menu {
    :deep(.menu-header) {
        background: linear-gradient(135deg, var(--primary-color), #2c3e50);
    }
}
</style>