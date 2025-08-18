const { BrowserWindow } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');

class WindowManager {
  constructor() {
    this.windows = new Map();
  }

  async createMainWindow() {
    const mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, '../preload/preload.js'),
        webSecurity: !isDev
      },
      frame: false,
      titleBarStyle: 'hidden',
      show: false
    });

    // 开发模式使用Vite服务器
    if (isDev) {
      await mainWindow.loadURL('http://localhost:5173');
      mainWindow.webContents.openDevTools();
    } else {
      await mainWindow.loadFile(path.join(__dirname, '../../dist/renderer/index.html'));
    }

    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
    });

    this.windows.set('main', mainWindow);
    return mainWindow;
  }

  getWindow(name) {
    return this.windows.get(name);
  }
}

module.exports = WindowManager;