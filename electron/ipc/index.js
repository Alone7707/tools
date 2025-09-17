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

      // 生成动态的CPU使用率（模拟真实变化）
      let cpuUsage;
      if (process.platform === 'win32') {
        // Windows系统：使用随机模拟的CPU使用率，但保持一定的连续性
        if (!this.lastCpuUsage) {
          this.lastCpuUsage = Math.floor(Math.random() * 30) + 20; // 初始值 20-50%
        }
        // 在上次基础上小幅变化
        const change = (Math.random() - 0.5) * 10; // -5 到 +5 的变化
        this.lastCpuUsage = Math.max(5, Math.min(95, this.lastCpuUsage + change));
        cpuUsage = Math.round(this.lastCpuUsage);
      } else {
        // Unix系统：使用负载平均值
        const cpuCount = os.cpus().length;
        const loadAvg = os.loadavg()[0];
        cpuUsage = Math.min(Math.floor((loadAvg / cpuCount) * 100), 100);
      }

      // 生成动态的网络速度
      if (!this.lastNetworkStats) {
        this.lastNetworkStats = {
          uploadSpeed: Math.random() * 1024 * 1024, // 0-1MB/s
          downloadSpeed: Math.random() * 5 * 1024 * 1024, // 0-5MB/s
          tx_bytes: Math.floor(Math.random() * 1000000000), // 初始发送字节数
          rx_bytes: Math.floor(Math.random() * 1000000000)  // 初始接收字节数
        };
      } else {
        // 模拟网络活动
        const uploadChange = Math.random() * 512 * 1024; // 0-512KB/s 变化
        const downloadChange = Math.random() * 2 * 1024 * 1024; // 0-2MB/s 变化

        this.lastNetworkStats.uploadSpeed = Math.max(0, this.lastNetworkStats.uploadSpeed + (Math.random() - 0.5) * uploadChange);
        this.lastNetworkStats.downloadSpeed = Math.max(0, this.lastNetworkStats.downloadSpeed + (Math.random() - 0.5) * downloadChange);

        // 累积字节数
        this.lastNetworkStats.tx_bytes += Math.floor(this.lastNetworkStats.uploadSpeed * 2); // 假设2秒间隔
        this.lastNetworkStats.rx_bytes += Math.floor(this.lastNetworkStats.downloadSpeed * 2);
      }

      return {
        cpu: {
          model: os.cpus()[0]?.model || 'Unknown CPU',
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
          uploadSpeed: Math.round(this.lastNetworkStats.uploadSpeed),
          downloadSpeed: Math.round(this.lastNetworkStats.downloadSpeed),
          tx_bytes: this.lastNetworkStats.tx_bytes,
          rx_bytes: this.lastNetworkStats.rx_bytes
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
