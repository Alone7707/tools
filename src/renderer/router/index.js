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
    path: '/form-demo',
    name: 'FormDemo',
    component: () => import('../views/FormDemoView.vue')
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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router