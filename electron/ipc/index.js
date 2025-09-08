const { ipcMain, dialog, shell, app } = require('electron');
const fs = require('fs').promises;
const process = require('process');

class IPCManager {
  constructor(windowManager) {
    this.windowManager = windowManager;
    this.setupHandlers();
  }

  setupHandlers() {
    // 文件操作
    ipcMain.handle('read-file', async (event, filePath) => {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        return { success: true, content };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('write-file', async (event, filePath, content) => {
      try {
        await fs.writeFile(filePath, content, 'utf-8');
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('select-file', async () => {
      const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
          { name: 'Text Files', extensions: ['txt', 'md', 'json'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (!result.canceled && result.filePaths.length > 0) {
        return { success: true, filePath: result.filePaths[0] };
      }

      return { success: false, error: 'No file selected' };
    });

    // 系统操作
    ipcMain.handle('get-app-version', () => {
      return app.getVersion();
    });

    ipcMain.handle('open-external', async (event, url) => {
      await shell.openExternal(url);
    });

    ipcMain.handle('show-message-box', async (event, options) => {
      const window = this.windowManager.getWindow('main');
      return await dialog.showMessageBox(window, options);
    });

    // 窗口控制
    ipcMain.handle('window-minimize', () => {
      const window = this.windowManager.getWindow('main');
      if (window) window.minimize();
    });

    ipcMain.handle('window-maximize', () => {
      const window = this.windowManager.getWindow('main');
      if (window) {
        if (window.isMaximized()) {
          window.unmaximize();
        } else {
          window.maximize();
        }
      }
    });

    ipcMain.handle('window-close', () => {
      const window = this.windowManager.getWindow('main');
      if (window) window.close();
    });

    ipcMain.handle('window-minimize-to-tray', () => {
      const window = this.windowManager.getWindow('main');
      if (window) window.hide();
    });

    ipcMain.handle('update-global-shortcut', (event, shortcut) => {
      // 通过全局变量访问updateGlobalShortcut函数
      // 这里假设updateGlobalShortcut函数在全局作用域中
      if (global.updateGlobalShortcut && typeof global.updateGlobalShortcut === 'function') {
        global.updateGlobalShortcut(shortcut);
        return { success: true };
      }
      return { success: false, error: 'updateGlobalShortcut function not found' };
    });

    // 渲染进程API
    ipcMain.handle('get-system-info', () => {
      return {
        platform: process.platform,
        arch: process.arch,
        version: app.getVersion(),
        electron: process.versions.electron,
        node: process.versions.node
      };
    });

    ipcMain.handle('get-system-metrics', () => {
      const os = require('os');
      
      // Windows系统使用随机模拟数据，Unix系统使用负载平均值
      let cpuUsage;
      if (process.platform === 'win32') {
        // Windows系统：使用随机模拟的CPU使用率
        cpuUsage = Math.floor(Math.random() * 30) + 10; // 10-40%范围
      } else {
        // Unix系统：使用负载平均值
        const cpuCount = os.cpus().length;
        const loadAvg = os.loadavg()[0];
        cpuUsage = Math.min(Math.floor((loadAvg / cpuCount) * 100), 100);
      }
      
      return {
        cpu: {
          model: os.cpus()[0].model,
          cores: os.cpus().length,
          usage: cpuUsage,
          loadAvg: os.loadavg()
        },
        memory: {
          total: os.totalmem(),
          free: os.freemem(),
          used: os.totalmem() - os.freemem()
        },
        disk: process.platform === 'win32' ? 'C:\\' : '/',
        uptime: os.uptime(),
        hostname: os.hostname(),
        network: {
          uploadSpeed: Math.floor(Math.random() * 1024 * 1024), // 模拟数据
          downloadSpeed: Math.floor(Math.random() * 5 * 1024 * 1024) // 模拟数据
        }
      };
    });

    ipcMain.handle('get-processes', () => {
      const os = require('os');
      const processes = [];

      // 简化的进程信息
      for (let i = 0; i < 10; i++) {
        processes.push({
          pid: Math.floor(Math.random() * 10000),
          name: `Process ${i + 1}`,
          cpu: Math.random() * 10,
          memory: Math.random() * 100 * 1024 * 1024 // 模拟内存使用
        });
      }

      return processes;
    });

    ipcMain.handle('get-battery-info', () => {
      // 电池信息 - 在大多数桌面系统上可能不可用
      return {
        hasBattery: false,
        level: 100,
        charging: false,
        timeRemaining: null
      };
    });

    // 开发者工具
    ipcMain.handle('open-dev-tools', () => {
      const window = this.windowManager.getWindow('main');
      if (window) {
        window.webContents.openDevTools();
        return { success: true };
      }
      return { success: false, error: 'Window not found' };
    });

    // 接收渲染进程返回的保存的快捷键
    ipcMain.on('saved-shortcut', (event, shortcut) => {
      if (shortcut && global.updateGlobalShortcut && typeof global.updateGlobalShortcut === 'function') {
        global.currentGlobalShortcut = shortcut;
        global.updateGlobalShortcut(shortcut);
        console.log('从渲染进程加载保存的快捷键:', shortcut);
      }
    });
  }
}

module.exports = IPCManager;
