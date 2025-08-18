<template>
  <aside class="sidebar">
    <nav>
      <router-link 
        v-for="item in menuItems" 
        :key="item.path"
        :to="item.path" 
        class="nav-item" 
        active-class="active"
      >
        <span class="icon">{{ item.icon }}</span>
        <span class="name">{{ item.name }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
const menuItems = [
  { path: '/', name: '仪表盘', icon: '📊' },
  { path: '/tools', name: '工具箱', icon: '🛠️' },
  { path: '/files', name: '文件管理', icon: '📁' },
  { path: '/settings', name: '设置', icon: '⚙️' }
]
</script>

<style scoped>
.sidebar {
  width: 200px;
  background: #f8f9fa;
  border-right: 1px solid #dee2e6;
}

.nav-item {
  display: block;
  padding: 12px 20px;
  color: #495057;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background: #e9ecef;
}

.nav-item.active {
  background: #667eea;
  color: white;
}

.icon {
  margin-right: 8px;
}
</style>