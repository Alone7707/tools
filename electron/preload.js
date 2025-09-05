const { contextBridge, ipcRenderer } = require('electron');

// 向渲染进程暴露安全的API
contextBridge.exposeInMainWorld('electronAPI', {
  // 文件操作
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke('write-file', filePath, content),
  selectFile: () => ipcRenderer.invoke('select-file'),
  
  // 系统操作
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  
  // 窗口控制
  windowMinimize: () => ipcRenderer.invoke('window-minimize'),
  windowMaximize: () => ipcRenderer.invoke('window-maximize'),
  windowClose: () => ipcRenderer.invoke('window-close'),
  windowMinimizeToTray: () => ipcRenderer.invoke('window-minimize-to-tray'),
  updateGlobalShortcut: (shortcut) => ipcRenderer.invoke('update-global-shortcut', shortcut),
  
  // 系统信息
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  
  // 开发者工具
  openDevTools: () => ipcRenderer.invoke('open-dev-tools'),
  
  // 快捷键相关
  onGetSavedShortcut: (callback) => ipcRenderer.on('get-saved-shortcut', callback),
  sendSavedShortcut: (shortcut) => ipcRenderer.send('saved-shortcut', shortcut)
});
