import { createVNode, render } from 'vue'
import Toast from '@/components/Toast.vue'

// 最大Toast数量
const MAX_TOAST_COUNT = 5

// 创建Toast容器
const createContainer = () => {
  const container = document.createElement('div')
  container.setAttribute('id', 'toast-container')
  container.style.position = 'fixed'
  container.style.top = '50px'
  container.style.left = '0'
  container.style.width = '100%'
  container.style.height = 'auto'
  container.style.pointerEvents = 'none'
  container.style.zIndex = '9999'
  container.style.display = 'flex'
  container.style.flexDirection = 'column'
  container.style.justifyContent = 'flex-start'
  container.style.alignItems = 'center'
  container.style.maxHeight = 'calc(100vh - 40px)'
  container.style.overflow = 'hidden'
  container.style.transition = 'all 0.3s ease'
  document.body.appendChild(container)
  return container
}

// 获取或创建容器
const getContainer = () => {
  let container = document.getElementById('toast-container')
  if (!container) {
    container = createContainer()
  }
  return container
}

// 创建Toast包装器，用于支持多个Toast
const createToastWrapper = () => {
  const wrapper = document.createElement('div')
  wrapper.style.position = 'relative'
  wrapper.style.pointerEvents = 'none'
  wrapper.style.marginTop = '10px'
  // 添加过渡效果，使Toast位置变化时有平滑动画
  wrapper.style.transition = 'transform 0.3s ease, margin-top 0.3s ease'
  return wrapper
}

// 获取所有Toast包装器
const getAllToastWrappers = () => {
  const container = getContainer()
  return Array.from(container.children)
}

// 移除最旧的Toast
const removeOldestToast = () => {
  const wrappers = getAllToastWrappers()
  if (wrappers.length > 0) {
    const oldestWrapper = wrappers[0]
    if (oldestWrapper.parentNode) {
      oldestWrapper.parentNode.removeChild(oldestWrapper)
    }
  }
}

// 重新排列所有Toast位置
const rearrangeToasts = () => {
  const wrappers = getAllToastWrappers()

  // 使用requestAnimationFrame确保动画流畅
  requestAnimationFrame(() => {
    wrappers.forEach((wrapper) => {
      // 为每个Toast更新位置类
      const toastElement = wrapper.querySelector('.toast')
      if (toastElement) {
        // 移除所有位置类
        toastElement.classList.remove('toast--top', 'toast--middle', 'toast--bottom')
      }
    })
  })
}

// 创建Toast实例
const createToast = (options) => {
  const container = getContainer()

  // 检查是否超过最大数量
  const wrappers = getAllToastWrappers()
  if (wrappers.length >= MAX_TOAST_COUNT) {
    removeOldestToast()
  }

  const wrapper = createToastWrapper()
  container.appendChild(wrapper)

  // 创建虚拟节点
  const vnode = createVNode(Toast, {
    ...options,
    onClose: () => {
      // 先重新排列剩余的Toast，让它们开始向上移动
      rearrangeToasts()

      // 延迟移除当前Toast，给其他Toast留出过渡时间
      setTimeout(() => {
        // 从容器中移除当前Toast的包装器
        if (wrapper.parentNode === container) {
          container.removeChild(wrapper)
          // 再次重新排列确保位置正确
          rearrangeToasts()
        }
        // 调用外部传入的onClose回调
        if (options.onClose) {
          options.onClose()
        }
      }, 300) // 与过渡动画时间保持一致
    }
  })

  // 渲染到包装器
  render(vnode, wrapper)

  // 重新排列所有Toast位置
  rearrangeToasts()

  // 返回关闭方法
  return {
    close: () => {
      if (vnode.component && vnode.component.exposed) {
        vnode.component.exposed.close()
      }
    }
  }
}

// Toast方法
const toast = {
  success(message, options = {}) {
    return createToast({
      type: 'success',
      message,
      ...options
    })
  },

  warning(message, options = {}) {
    return createToast({
      type: 'warning',
      message,
      ...options
    })
  },

  error(message, options = {}) {
    return createToast({
      type: 'error',
      message,
      ...options
    })
  },

  info(message, options = {}) {
    return createToast({
      type: 'info',
      message,
      ...options
    })
  },

  // 显示默认Toast
  show(message, options = {}) {
    return createToast({
      message,
      ...options
    })
  }
}

export default toast
