import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsView.vue')
  },
  {
    path: '/advanced-form',
    name: 'AdvancedForm',
    component: () => import('../views/AdvancedFormDemoView.vue')
  },
  {
    path: '/button-demo',
    name: 'ButtonDemo',
    component: () => import('../views/ButtonDemoView.vue')
  },
  {
    path: '/editor-demo',
    name: 'editorDemo',
    component: () => import('../views/EditorDemoView.vue')
  },
  {
    path: '/tools',
    name: 'Tools',
    component: () => import('../views/ToolsView.vue')
  },
  {
    path: '/tools/s2work-parser',
    name: 'S2WorkParser',
    component: () => import('../views/tools/S2WorkParserView.vue')
  },
  {
    path: '/electron-demo',
    name: 'ElectronDemo',
    component: () => import('../views/ElectronDemoView.vue')
  },
  {
    path: '/loading-demo',
    name: 'LoadingDemo',
    component: () => import('../views/LoadingDemoView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
