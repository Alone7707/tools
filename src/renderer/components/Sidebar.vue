<template>
  <aside class="sidebar">
    <nav style="height: 100%;">
      <!-- <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="nav-item" active-class="active">
        <span class="icon">{{ item.icon }}</span>
        <span class="name">{{ item.name }}</span>
      </router-link> -->
      <BaseMenu :items="menuItems" title="导航菜单" @menu-click="handleMenuClick" />
    </nav>
  </aside>
</template>

<script setup>
import BaseMenu from "@/components/BaseMenu.vue";
const menuItems = [
  { path: "/", title: "仪表盘", icon: "📊" },
  {
    key: "components-demo", title: "组件演示", icon: "🧩", children: [
      { path: "/advanced-form", title: "高级表单", icon: "📨" },
      { path: "/button-demo", title: "按钮演示", icon: "🔘" },
    ]
  },
  { path: "/settings", title: "设置", icon: "⚙️" }
]
</script>

<style lang="scss" scoped>
.sidebar {
  // width: 200px;
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