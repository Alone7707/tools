const { app } = require('electron');
const WindowManager = require('./window');
const AppMenu = require('./menu');
const IPCManager = require('./ipc');

// 处理在Windows上安装/卸载时创建/删除快捷方式
if (require('electron-squirrel-startup')) {
  app.quit();
}

class ElectronApp {
  constructor() {
    this.windowManager = new WindowManager();
    this.appMenu = new AppMenu();
    this.ipcManager = null;
  }

  async initialize() {
    try {
      await app.whenReady();
      
      console.log('📱 Electron 已就绪，创建应用窗口...');
      
      // 初始化菜单
      this.appMenu.build();
      
      // 创建主窗口
      const mainWindow = this.windowManager.createMainWindow();
      
      // 初始化IPC通信
      this.ipcManager = new IPCManager(this.windowManager);
      
      console.log('🎉 Electron Tools 应用已启动！');
      
    } catch (error) {
      console.error('❌ 应用启动失败:', error);
    }
  }

  setupEventHandlers() {
    // 应用激活事件
    app.on('activate', () => {
      if (this.windowManager.windows.size === 0) {
        this.windowManager.createMainWindow();
      }
    });

    // 所有窗口关闭事件
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    // 应用退出前清理
    app.on('before-quit', () => {
      this.windowManager.closeAllWindows();
    });

    // 处理未捕获的异常
    process.on('uncaughtException', (error) => {
      console.error('未捕获的异常:', error);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('未处理的Promise拒绝:', reason);
    });
  }
}

// 启动应用
const electronApp = new ElectronApp();
electronApp.setupEventHandlers();
electronApp.initialize();
