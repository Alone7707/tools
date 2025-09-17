<template>
  <aside class="sidebar">
    <nav class="nav-container">
      <router-link v-for="item in menuItems" :key="item.path || item.key" :to="item.path || '/'" class="nav-item"
        :class="{ 'has-children': item.children }" :title="item.title">
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.title }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
const menuItems = [
  { path: "/", title: "首页", icon: "🏠" },
  { path: "/tools", title: "工具", icon: "🔧" },
  { path: "/settings", title: "设置", icon: "⚙️" },
]

const handleMenuClick = (item) => {
  console.log('菜单点击:', item)
}
</script>

<style lang="scss" scoped>
.sidebar {
  width: 72px;
  background: var(--card-background);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;

  .nav-container {
    display: flex;
    flex-direction: column;
    padding: 12px 8px;
    gap: 8px;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 8px;
    color: var(--text-secondary-color);
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.2s ease;
    position: relative;

    .nav-icon {
      font-size: 20px;
      margin-bottom: 4px;
    }

    .nav-label {
      font-size: 10px;
      font-weight: 500;
      text-align: center;
      line-height: 1.2;
      opacity: 0.8;
    }

    &:hover {
      background: var(--border-color);
      color: var(--text-color);

      .nav-label {
        opacity: 1;
      }
    }

    &.router-link-active {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;

      .nav-label {
        opacity: 1;
      }
    }
  }
}
</style>
