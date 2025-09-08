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
    component: () => import('../views/demo/AdvancedFormDemoView.vue')
  },
  {
    path: '/button-demo',
    name: 'ButtonDemo',
    component: () => import('../views/demo/ButtonDemoView.vue')
  },
  {
    path: '/editor-demo',
    name: 'editorDemo',
    component: () => import('../views/demo/EditorDemoView.vue')
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
    path: '/tools/json-formatter',
    name: 'JsonFormatter',
    component: () => import('../views/tools/JsonFormatterView.vue')
  },
  {
    path: '/tools/image-compressor',
    name: 'ImageCompressor',
    component: () => import('../views/tools/ImageCompressorView.vue')
  },
  {
    path: '/electron-demo',
    name: 'ElectronDemo',
    component: () => import('../views/demo/ElectronDemoView.vue')
  },
  {
    path: '/loading-demo',
    name: 'LoadingDemo',
    component: () => import('../views/demo/LoadingDemoView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
