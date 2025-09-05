<template>
  <aside class="sidebar">
    <nav style="height: 100%;">
      <BaseMenu :items="menuItems" title="导航菜单" @menu-click="handleMenuClick" />
    </nav>
  </aside>
</template>

<script setup>
import BaseMenu from "@/components/layout/BaseMenu.vue";
const menuItems = [
  { path: "/", title: "仪表盘", icon: "📊" },
  { path: "/tools", title: "工具列表", icon: "🔧" },
  {
    key: "components-demo", title: "组件演示", icon: "🧩", dev: true, children: [
      { path: "/advanced-form", title: "高级表单", icon: "📨" },
      { path: "/button-demo", title: "按钮演示", icon: "🔘" },
      { path: "/electron-demo", title: "Electron API", icon: "⚡" },
      { path: "/editor-demo", title: "编辑器演示", icon: "✏️" },
      { path: "/loading-demo", title: "loading演示", icon: "⏳" },
    ]
  },
  { path: "/settings", title: "设置", icon: "⚙️" },
]

const handleMenuClick = (item) => {
  console.log('菜单点击:', item)
}
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
