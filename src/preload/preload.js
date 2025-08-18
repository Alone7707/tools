const { contextBridge, ipcRenderer } = require('electron')

// 暴露安全的API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 窗口控制
  windowMinimize: () => {
    return ipcRenderer.invoke('window-minimize')
  },
  
  windowMaximize: () => {
    return ipcRenderer.invoke('window-maximize')
  },
  
  windowClose: () => {
    return ipcRenderer.invoke('window-close')
  },

  // 系统信息
  getSystemInfo: () => {
    return ipcRenderer.invoke('get-system-info')
  },

  // 文件操作
  selectFile: () => {
    return ipcRenderer.invoke('select-file')
  },

  readFile: (filePath) => {
    return ipcRenderer.invoke('read-file', filePath)
  },

  writeFile: (filePath, content) => {
    return ipcRenderer.invoke('write-file', filePath, content)
  },

  // 消息框
  showMessageBox: (options) => {
    return ipcRenderer.invoke('show-message-box', options)
  },

  // 打开外部链接
  openExternal: (url) => {
    return ipcRenderer.invoke('open-external', url)
  }
})

// 添加调试日志
console.log('Preload script loaded, electronAPI exposed')