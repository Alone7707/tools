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

    // 设置超时显示（8秒后无论如何都显示窗口）
    const showTimeout = setTimeout(() => {
      if (!mainWindow.isVisible()) {
        mainWindow.show();
        console.log('⏰ 窗口显示超时，强制显示');
      }
    }, 8000);

    try {
      // 开发模式使用Vite服务器
      if (isDev) {
        console.log('🌐 尝试连接到Vite开发服务器...');
        // 增加重试机制
        let retries = 0;
        const maxRetries = 10;

        while (retries < maxRetries) {
          try {
            await mainWindow.loadURL('http://localhost:5173');
            console.log('✅ Vite服务器连接成功');
            break;
          } catch (loadError) {
            retries++;
            if (retries === maxRetries) {
              throw new Error(`Vite服务器连接失败，已重试${maxRetries}次`);
            }
            console.log(`🔄 连接失败，第${retries}次重试...`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
          }
        }
        mainWindow.webContents.openDevTools();
      } else {
        await mainWindow.loadFile(path.join(__dirname, '../../dist/renderer/index.html'));
      }

      mainWindow.once('ready-to-show', () => {
        clearTimeout(showTimeout);
        mainWindow.show();
        console.log('✅ 窗口已准备就绪并显示');
      });
    } catch (error) {
      console.error('❌ 窗口加载失败:', error.message);
      clearTimeout(showTimeout);

      mainWindow.show();
    }

    this.windows.set('main', mainWindow);
    return mainWindow;
  }

  getWindow(name) {
    return this.windows.get(name);
  }
}

module.exports = WindowManager;