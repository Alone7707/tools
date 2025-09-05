import { createVNode, render } from 'vue'
import Loading from '../components/Loading.vue'

// 创建loading实例
let loadingInstance = null
let loadingContainer = null

// 创建loading容器
const createContainer = () => {
  if (!loadingContainer) {
    loadingContainer = document.createElement('div')
    loadingContainer.setAttribute('id', 'loading-container')
    document.body.appendChild(loadingContainer)
  }
  return loadingContainer
}

// 显示loading
const showLoading = (options = {}) => {
  // 如果已有loading实例，先移除
  if (loadingInstance) {
    hideLoading()
  }

  // 创建容器
  const container = createContainer()
  
  // 处理options参数
  const props = typeof options === 'string' ? { text: options } : options
  
  // 创建loading vnode
  const loadingVNode = createVNode(Loading, props)
  
  // 渲染loading
  render(loadingVNode, container)
  loadingInstance = loadingVNode
  
  return loadingInstance
}

// 隐藏loading
const hideLoading = () => {
  if (loadingInstance && loadingContainer) {
    render(null, loadingContainer)
    loadingInstance = null
  }
}

// Loading插件
const LoadingPlugin = {
  install(app) {
    // 注册Loading组件
    app.component('Loading', Loading)
    
    // 添加全局方法
    app.config.globalProperties.$loading = {
      show: showLoading,
      hide: hideLoading
    }
    
    // 添加全局属性
    app.provide('loading', {
      show: showLoading,
      hide: hideLoading
    })
  }
}

// 导出插件和方法
export default LoadingPlugin
export { showLoading, hideLoading }