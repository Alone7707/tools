<template>
  <aside class="base-menu" :class="{ 'menu-collapsed': collapsed }">
    <!-- 菜单头部 -->
    <div class="menu-header" :style="{ 'justify-content': collapsed ? 'center' : 'space-between' }">
      <div v-if="!collapsed" class="menu-title">{{ title }}</div>
      <BaseButton type="text" :icon="collapsed ? '📖' : '📕'" @click="toggleCollapse" class="collapse-btn"
        :title="collapsed ? '展开菜单' : '收起菜单'" />
    </div>

    <!-- 菜单内容 -->
    <nav class="menu-content">
      <template v-for="item in menuItems" :key="item.key || item.path">
        <!-- 一级菜单项 -->
        <template v-if="env === 'development' || (env === 'production' && !item.dev) ">
          <div v-if="!item.children || item.children.length === 0" class="menu-item"
            :class="{ 'menu-item-active': isActiveItem(item) }">
            <router-link v-if="item.path" :to="item.path" class="menu-link" @click="handleMenuClick(item)">
              <span class="menu-icon">{{ item.icon }}</span>
              <span v-if="!collapsed" class="menu-text">{{ item.title }}</span>
              <span v-if="item.badge && !collapsed" class="menu-badge">{{ item.badge }}</span>
            </router-link>
            <div v-else class="menu-link menu-link-disabled">
              <span class="menu-icon">{{ item.icon }}</span>
              <span v-if="!collapsed" class="menu-text">{{ item.title }}</span>
              <span v-if="item.badge && !collapsed" class="menu-badge">{{ item.badge }}</span>
            </div>
          </div>

          <!-- 二级菜单组 -->
          <div v-else class="menu-group" :class="{ 'menu-group-active': isActiveGroup(item) }"
            @mouseenter="handleGroupHover(item.key)" @mouseleave="handleGroupLeave">
            <!-- 二级菜单标题 -->
            <div class="menu-group-title" @click="toggleGroup(item.key)"
              :class="{ 'menu-group-expanded': expandedGroups.includes(item.key) }"
              :ref="el => setGroupRef(item.key, el)">
              <span class="menu-icon">{{ item.icon }}</span>
              <span v-if="!collapsed" class="menu-text">{{ item.title }}</span>
              <span v-if="item.badge && !collapsed" class="menu-badge">{{ item.badge }}</span>
              <span v-if="!collapsed" class="menu-arrow"
                :class="{ 'menu-arrow-expanded': expandedGroups.includes(item.key) }">
                ▶
              </span>
            </div>

            <!-- 二级菜单子项 -->
            <transition name="submenu" appear>
              <div v-if="!collapsed && (alwaysExpanded || expandedGroups.includes(item.key))" class="menu-submenu">
                <div v-for="subItem in item.children" :key="subItem.key || subItem.path" class="menu-subitem"
                  :class="{ 'menu-subitem-active': isActiveItem(subItem) }">
                  <router-link v-if="subItem.path" :to="subItem.path" class="menu-sublink"
                    @click="handleMenuClick(subItem)">
                    <span class="menu-subicon">{{ subItem.icon }}</span>
                    <span class="menu-subtext">{{ subItem.title }}</span>
                    <span v-if="subItem.badge" class="menu-subbadge">{{ subItem.badge }}</span>
                  </router-link>
                  <div v-else class="menu-sublink menu-sublink-disabled">
                    <span class="menu-subicon">{{ subItem.icon }}</span>
                    <span class="menu-subtext">{{ subItem.title }}</span>
                    <span v-if="subItem.badge" class="menu-subbadge">{{ subItem.badge }}</span>
                  </div>
                </div>
              </div>
            </transition>

            <!-- 简略版时的浮动子菜单 -->
            <transition name="popup" appear>
              <div v-if="collapsed && hoveredGroup === item.key" class="menu-popup" :style="getPopupStyle(item.key)"
                @mouseenter="handleGroupHover(item.key)" @mouseleave="handleGroupLeave">
                <div class="menu-popup-title">{{ item.title }}</div>
                <div v-for="subItem in item.children" :key="subItem.key || subItem.path" class="menu-popup-item"
                  :class="{ 'menu-popup-item-active': isActiveItem(subItem) }">
                  <router-link v-if="subItem.path" :to="subItem.path" class="menu-popup-link"
                    @click="handleMenuClick(subItem)">
                    <span class="menu-popup-icon">{{ subItem.icon }}</span>
                    <span class="menu-popup-text">{{ subItem.title }}</span>
                    <span v-if="subItem.badge" class="menu-popup-badge">{{ subItem.badge }}</span>
                  </router-link>
                  <div v-else class="menu-popup-link menu-popup-link-disabled">
                    <span class="menu-popup-icon">{{ subItem.icon }}</span>
                    <span class="menu-popup-text">{{ subItem.title }}</span>
                    <span v-if="subItem.badge" class="menu-popup-badge">{{ subItem.badge }}</span>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </template>
      </template>
    </nav>

    <!-- 菜单底部 -->
    <div v-if="$slots.footer" class="menu-footer">
      <slot name="footer" :collapsed="collapsed" />
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGlobalStore } from '@/stores/global'
import BaseButton from '../ui/BaseButton.vue'

defineOptions({
  name: 'BaseMenu'
})

const props = defineProps({
  // 菜单数据
  items: {
    type: Array,
    default: () => []
  },
  // 菜单标题
  title: {
    type: String,
    default: '导航菜单'
  },
  // 是否默认收起
  defaultCollapsed: {
    type: Boolean,
    default: false
  },
  // 是否总是展开二级菜单（不管collapsed状态）
  alwaysExpanded: {
    type: Boolean,
    default: false
  },
  // 默认展开的分组
  defaultExpandedGroups: {
    type: Array,
    default: () => []
  },
  // 是否启用手风琴模式（同时只展开一个分组）
  accordion: {
    type: Boolean,
    default: false
  },
  // 菜单宽度（展开时）
  width: {
    type: String,
    default: '200px'
  },
  // 菜单宽度（收起时）
  collapsedWidth: {
    type: String,
    default: '64px'
  }
})

const emit = defineEmits(['update:collapsed', 'menu-click', 'group-toggle'])

const route = useRoute()
const globalStore = useGlobalStore()

// 响应式数据
const expandedGroups = ref([...props.defaultExpandedGroups])
const hoveredGroup = ref(null)
const groupRefs = ref(new Map())
const leaveTimer = ref(null)

// 当前环境
const env = import.meta.env.MODE

// 使用全局状态的折叠状态
const collapsed = computed({
  get: () => globalStore.collapsed,
  set: (value) => {
    globalStore.setCollapsed(value)
    emit('update:collapsed', value)
  }
})

// 初始化菜单状态
onMounted(() => {
  globalStore.initMenuState()
  // 如果组件有默认值，优先使用组件默认值
  if (props.defaultCollapsed !== false) {
    globalStore.setCollapsed(props.defaultCollapsed)
  }
})

// 计算属性
const menuItems = computed(() => props.items)

// 元素引用管理
const setGroupRef = (key, el) => {
  if (el) {
    groupRefs.value.set(key, el)
  } else {
    groupRefs.value.delete(key)
  }
}

// 获取浮动菜单位置
const getPopupStyle = (groupKey) => {
  const groupEl = groupRefs.value.get(groupKey)
  if (!groupEl) {
    return { top: '0px' }
  }

  const rect = groupEl.getBoundingClientRect()
  const menuRect = groupEl.closest('.base-menu')?.getBoundingClientRect()

  if (!menuRect) {
    return { top: '0px' }
  }

  // 计算相对位置
  const relativeTop = rect.top - menuRect.top

  return {
    top: `${relativeTop}px`
  }
}

// 方法
const toggleCollapse = () => {
  globalStore.toggleCollapse()
  emit('update:collapsed', globalStore.collapsed)
}

const toggleGroup = (groupKey) => {
  if (props.accordion) {
    // 手风琴模式：关闭其他组，切换当前组
    if (expandedGroups.value.includes(groupKey)) {
      expandedGroups.value = []
    } else {
      expandedGroups.value = [groupKey]
    }
  } else {
    // 普通模式：切换当前组
    const index = expandedGroups.value.indexOf(groupKey)
    if (index > -1) {
      expandedGroups.value.splice(index, 1)
    } else {
      expandedGroups.value.push(groupKey)
    }
  }
  emit('group-toggle', groupKey, expandedGroups.value)
}

const handleMenuClick = (item) => {
  emit('menu-click', item)
}

const isActiveItem = (item) => {
  if (!item.path) return false
  return route.path === item.path || route.path.startsWith(item.path + '/')
}

const isActiveGroup = (group) => {
  if (!group.children) return false
  return group.children.some(child => isActiveItem(child))
}

const handleGroupHover = (groupKey) => {
  if (collapsed.value) {
    // 清除任何存在的延时器
    if (leaveTimer.value) {
      clearTimeout(leaveTimer.value)
      leaveTimer.value = null
    }
    hoveredGroup.value = groupKey
  }
}

const handleGroupLeave = () => {
  if (collapsed.value) {
    // 使用延时来防止闪烁
    leaveTimer.value = setTimeout(() => {
      hoveredGroup.value = null
      leaveTimer.value = null
    }, 100) // 100ms 延时
  }
}

// 监听路由变化，自动展开包含当前路由的分组
watch(() => route.path, (newPath) => {
  menuItems.value.forEach(item => {
    if (item.children && item.children.some(child => child.path === newPath)) {
      if (!expandedGroups.value.includes(item.key)) {
        expandedGroups.value.push(item.key)
      }
    }
  })
}, { immediate: true })

// 组件卸载时清理定时器
onUnmounted(() => {
  if (leaveTimer.value) {
    clearTimeout(leaveTimer.value)
    leaveTimer.value = null
  }
})

// 暴露方法
defineExpose({
  toggleCollapse,
  toggleGroup,
  expandGroup: (groupKey) => {
    if (!expandedGroups.value.includes(groupKey)) {
      expandedGroups.value.push(groupKey)
    }
  },
  collapseGroup: (groupKey) => {
    const index = expandedGroups.value.indexOf(groupKey)
    if (index > -1) {
      expandedGroups.value.splice(index, 1)
    }
  },
  collapseAll: () => {
    expandedGroups.value = []
  },
  expandAll: () => {
    expandedGroups.value = menuItems.value
      .filter(item => item.children && item.children.length > 0)
      .map(item => item.key)
  }
})
</script>

<style lang="scss" scoped>
.base-menu {
  height: 100%;
  width: v-bind(width);
  background: var(--card-background);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: width 0.3s ease;
  position: relative;

  &.menu-collapsed {
    width: v-bind(collapsedWidth);
  }
}

// 菜单头部
.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
  min-height: 48px;

  .menu-title {
    font-weight: 600;
    color: var(--text-color);
    font-size: 16px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .collapse-btn {
    flex-shrink: 0;
    padding: 4px;
    min-width: auto;
  }
}

// 菜单内容
.menu-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 2px;
  }
}

// 一级菜单项
.menu-item {
  margin: 2px 8px;

  .menu-link {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    color: var(--text-color);
    text-decoration: none;
    border-radius: 6px;
    transition: all 0.2s ease;
    position: relative;

    &:hover {
      background: rgba(var(--primary-color-rgb), 0.1);
      color: var(--primary-color);
    }

    &.router-link-active {
      background: var(--primary-color);
      color: white;

      .menu-badge {
        background: rgba(255, 255, 255, 0.2);
        color: white;
      }
    }

    &.menu-link-disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .menu-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    font-size: 16px;
    flex-shrink: 0;
  }

  .menu-text {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .menu-badge {
    background: var(--primary-color);
    color: white;
    border-radius: 10px;
    padding: 2px 6px;
    font-size: 12px;
    min-width: 18px;
    text-align: center;
    margin-left: 8px;
  }

  &.menu-item-active .menu-link:not(.router-link-active) {
    background: rgba(var(--primary-color-rgb), 0.1);
    color: var(--primary-color);
  }
}

// 二级菜单组
.menu-group {
  margin: 2px 8px;

  .menu-group-title {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    color: var(--text-color);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;

    &:hover {
      background: rgba(var(--primary-color-rgb), 0.1);
      color: var(--primary-color);
    }

    .menu-icon {
      margin-right: 12px;
    }

    .menu-arrow {
      margin-left: auto;
      font-size: 12px;
      transition: transform 0.2s ease;

      &.menu-arrow-expanded {
        transform: rotate(90deg);
      }
    }
  }

  &.menu-group-active .menu-group-title {
    background: rgba(var(--primary-color-rgb), 0.1);
    color: var(--primary-color);
  }

  // 悬停效果（简略版时）
  &:hover .menu-group-title {
    background: rgba(var(--primary-color-rgb), 0.1);
  }
}

// 二级菜单子项
.menu-submenu {
  margin-left: 20px;
  margin-top: 4px;
  border-left: 2px solid var(--border-color);
  padding-left: 12px;
}

.menu-subitem {
  margin: 1px 0;

  .menu-sublink {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    color: var(--text-secondary-color);
    text-decoration: none;
    border-radius: 4px;
    transition: all 0.2s ease;
    font-size: 14px;

    &:hover {
      background: rgba(var(--primary-color-rgb), 0.08);
      color: var(--primary-color);
    }

    &.router-link-active {
      background: var(--primary-color);
      color: white;

      .menu-subbadge {
        background: rgba(255, 255, 255, 0.2);
        color: white;
      }
    }

    &.menu-sublink-disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .menu-subicon {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    font-size: 14px;
    flex-shrink: 0;
  }

  .menu-subtext {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .menu-subbadge {
    background: var(--text-secondary-color);
    color: white;
    border-radius: 8px;
    padding: 1px 4px;
    font-size: 11px;
    min-width: 16px;
    text-align: center;
    margin-left: 6px;
  }

  &.menu-subitem-active .menu-sublink:not(.router-link-active) {
    background: rgba(var(--primary-color-rgb), 0.08);
    color: var(--primary-color);
  }
}

// 浮动子菜单（简略版时）
.menu-popup {
  position: absolute;
  left: 100%;
  min-width: 180px;
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 8px 0;
  margin-left: 8px;

  .menu-popup-title {
    padding: 8px 16px;
    font-weight: 600;
    color: var(--text-color);
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 4px;
  }

  .menu-popup-item {
    .menu-popup-link {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      color: var(--text-color);
      text-decoration: none;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(var(--primary-color-rgb), 0.1);
        color: var(--primary-color);
      }

      &.router-link-active {
        background: var(--primary-color);
        color: white;
      }

      &.menu-popup-link-disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .menu-popup-icon {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
      font-size: 14px;
    }

    .menu-popup-text {
      flex: 1;
    }

    .menu-popup-badge {
      background: var(--primary-color);
      color: white;
      border-radius: 8px;
      padding: 1px 4px;
      font-size: 11px;
      margin-left: 6px;
    }

    &.menu-popup-item-active .menu-popup-link:not(.router-link-active) {
      background: rgba(var(--primary-color-rgb), 0.1);
      color: var(--primary-color);
    }
  }
}

// 菜单底部
.menu-footer {
  border-top: 1px solid var(--border-color);
  padding: 12px;
}

// 简略版样式调整
.menu-collapsed {
  .menu-icon {
    margin-right: 0;
  }

  .menu-group:hover {
    .menu-popup {
      display: block;
    }
  }

  .menu-group-title:hover+.menu-popup,
  .menu-popup:hover {
    display: block;
  }
}

// 动画效果
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.submenu-enter-to,
.submenu-leave-from {
  opacity: 1;
  max-height: 500px;
  transform: translateY(0);
}

.popup-enter-active,
.popup-leave-active {
  transition: all 0.2s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.popup-enter-to,
.popup-leave-from {
  opacity: 1;
  transform: translateX(0);
}

// 响应式设计
@media (max-width: 768px) {
  .base-menu {
    width: 100%;

    &.menu-collapsed {
      width: v-bind(collapsedWidth);
    }
  }

  .menu-popup {
    position: fixed;
    left: v-bind(collapsedWidth);
    right: 16px;
    min-width: auto;
  }
}
</style>
