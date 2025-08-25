<template>
  <aside class="sidebar">
    <nav>
      <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="nav-item" active-class="active">
        <span class="icon">{{ item.icon }}</span>
        <span class="name">{{ item.name }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
const menuItems = [
  { path: '/', name: '仪表盘', icon: '📊' },
  { path: '/advanced-form', name: '高级表单', icon: '📨' },
  { path: '/button-demo', name: '按钮演示', icon: '🔘' },
  { path: '/settings', name: '设置', icon: '⚙️' }
]
</script>

<style lang="scss" scoped>
.sidebar {
  width: 200px;
  background: var(--background-color);
  border-right: 1px solid var(--border-color);

  .nav-item {
    display: block;
    padding: 12px 20px;
    color: var(--text-color);
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(var(--primary-color-rgb), 0.1);
    }

    .icon {
      margin-right: 8px;
    }
  }

  .active {
    background: var(--primary-color);
    color: white;
  }
}
</style>