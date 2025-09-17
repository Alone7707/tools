const { app, BrowserWindow, Tray, Menu, globalShortcut } = require('electron');
const { createBaseWindowConfig } = require('./config/window.js');
const IPCManager = require('./ipc/index.js');
const path = require('path');

let tray = null;
let isQuitting = false;
let isPinned = false; // 窗口保留状态

// 辅助函数：根据保留状态显示窗口
const showWindowWithTaskbarControl = (window) => {
  if (!window) return;

  window.show();
  window.focus();
  window.setAlwaysOnTop(true);
  window.setAlwaysOnTop(false);

  if (process.platform === 'win32') {
    // 根据保留状态决定是否在任务栏显示
    window.setSkipTaskbar(!isPinned);
  }
};

// 窗口管理器
const windowManager = {
  windows: {},

  getWindow(name) {
    return this.windows[name];
  },

  setWindow(name, window) {
    this.windows[name] = window;
  }
};

const createWindow = () => {
  const mainWindow = new BrowserWindow(createBaseWindowConfig());

  // 将窗口添加到管理器
  windowManager.setWindow('main', mainWindow);

  // 初始化IPC管理器
  const ipcManager = new IPCManager(windowManager);
  // 传递 isPinned 变量的引用
  ipcManager.setPinnedRef(() => isPinned, (value) => { isPinned = value; });

  // 添加失去焦点时自动隐藏的功能
  mainWindow.on('blur', () => {
    if (mainWindow && !mainWindow.isDestroyed() && !isPinned) {
      mainWindow.hide();
      // 注意：不保留状态下任务栏图标已经在 set-pin-window 中处理了
    }
  });

  // 窗口关闭时的处理
  mainWindow.on('close', (event) => {
    // 如果不是真正退出，则阻止窗口关闭，改为隐藏
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      if (process.platform === 'win32') {
        mainWindow.setSkipTaskbar(true);
      }
    }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL("http://localhost:3004/");
    mainWindow.webContents.openDevTools();
  } else {
    // 在打包后的应用中，使用正确的路径加载 index.html
    // __dirname 在打包后是 resources/app.asar/electron
    // index.html 在 resources/app.asar/dist/index.html
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow()

  // 初始化全局快捷键变量
  global.currentGlobalShortcut = getGlobalShortcut();

  // 将updateGlobalShortcut函数添加到全局作用域
  global.updateGlobalShortcut = updateGlobalShortcut;

  // 立即注册默认快捷键
  registerGlobalShortcut();

  // 创建系统托盘
  createTray()

  // 延迟加载保存的快捷键，确保窗口完全加载
  setTimeout(() => {
    loadSavedShortcut();
  }, 1000);
})

// 从渲染进程获取保存的快捷键
const loadSavedShortcut = () => {
  const mainWindow = windowManager.getWindow('main');
  if (mainWindow) {
    // 向渲染进程发送请求，获取保存的快捷键
    mainWindow.webContents.send('get-saved-shortcut');
  }
}

// 更新全局快捷键
const updateGlobalShortcut = (newShortcut) => {
  // 保存新的快捷键到全局变量
  global.currentGlobalShortcut = newShortcut;

  registerGlobalShortcut(newShortcut);

  if (tray) {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '显示/隐藏主窗口',
        click: () => {
          const window = windowManager.getWindow('main');
          if (window) {
            // 如果窗口可见，则隐藏到托盘
            if (window.isVisible() && !window.isMinimized()) {
              window.hide();
              // 在Windows上，从任务栏中隐藏
              if (process.platform === 'win32') {
                window.setSkipTaskbar(true);
              }
            } else {
              // 如果窗口最小化了，先恢复窗口
              if (window.isMinimized()) {
                window.restore();
              }
              // 显示窗口并根据保留状态控制任务栏
              showWindowWithTaskbarControl(window);
            }
          }
        }
      },
      {
        label: '退出',
        click: () => {
          isQuitting = true;
          app.quit();
        }
      }
    ])

    tray.setContextMenu(contextMenu)
  }
}

// 获取用户设置的全局快捷键
const getGlobalShortcut = () => {
  // 尝试从全局变量中获取用户设置的快捷键
  if (global.currentGlobalShortcut) {
    return global.currentGlobalShortcut;
  }
  // 如果没有设置，则使用默认值
  return 'Shift+Space';
}

// 注册全局快捷键
const registerGlobalShortcut = (shortcut) => {
  // 如果没有提供快捷键，则使用默认值
  const shortcutToRegister = shortcut || getGlobalShortcut();

  // 先注销所有已注册的快捷键
  globalShortcut.unregisterAll();

  // 注册用户设置的快捷键，用于切换主窗口显示/隐藏
  const ret = globalShortcut.register(shortcutToRegister, () => {
    const window = windowManager.getWindow('main');
    if (window) {
      // 如果窗口可见，则隐藏到托盘
      if (window.isVisible() && !window.isMinimized()) {
        window.hide();
        // 在Windows上，从任务栏中隐藏
        if (process.platform === 'win32') {
          window.setSkipTaskbar(true);
        }
      } else {
        // 如果窗口最小化了，先恢复窗口
        if (window.isMinimized()) {
          window.restore();
        }
        // 显示窗口并根据保留状态控制任务栏
        showWindowWithTaskbarControl(window);
      }
    } else {
      // 如果窗口不存在，创建一个新窗口
      createWindow();
      // 延迟显示窗口，确保窗口完全初始化
      setTimeout(() => {
        const newWindow = windowManager.getWindow('main');
        if (newWindow) {
          showWindowWithTaskbarControl(newWindow);
        }
      }, 100);
    }
  })

  if (!ret) {
    console.error('全局快捷键注册失败:', shortcutToRegister)
  } else {
    console.log('全局快捷键注册成功:', shortcutToRegister);
  }
}

// 应用退出时取消注册所有快捷键
app.on('will-quit', () => {
  // 注销所有快捷键
  globalShortcut.unregisterAll()
})

// 创建系统托盘
const createTray = () => {
  tray = new Tray(path.join(__dirname, '../build/icon.ico'))

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示/隐藏主窗口',
      click: () => {
        const window = windowManager.getWindow('main');
        if (window) {
          // 如果窗口可见，则隐藏到托盘
          if (window.isVisible() && !window.isMinimized()) {
            window.hide();
            // 在Windows上，从任务栏中隐藏
            if (process.platform === 'win32') {
              window.setSkipTaskbar(true);
            }
          } else {
            // 如果窗口最小化了，先恢复窗口
            if (window.isMinimized()) {
              window.restore();
            }
            // 显示窗口并置于前台
            window.show();
            window.focus();
            // 强制获得焦点
            window.setAlwaysOnTop(true);
            window.setAlwaysOnTop(false);
            // 在Windows上，确保窗口能够正常显示
            if (process.platform === 'win32') {
              window.setSkipTaskbar(false);
            }
          }
        }
      }
    },
    {
      label: '退出',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ])

  tray.setToolTip('Electron Tools')
  tray.setContextMenu(contextMenu)

  // 双击托盘图标切换主窗口显示/隐藏
  tray.on('double-click', () => {
    const window = windowManager.getWindow('main');
    if (window) {
      // 如果窗口可见，则隐藏到托盘
      if (window.isVisible() && !window.isMinimized()) {
        window.hide();
        // 在Windows上，从任务栏中隐藏
        if (process.platform === 'win32') {
          window.setSkipTaskbar(true);
        }
      } else {
        // 如果窗口最小化了，先恢复窗口
        if (window.isMinimized()) {
          window.restore();
        }
        // 显示窗口并根据保留状态控制任务栏
        showWindowWithTaskbarControl(window);
      }
    }
  })
}

// 所有窗口关闭时不退出应用，因为窗口只是隐藏了
app.on('window-all-closed', () => {
  // 不退出应用，保持在后台运行
  // 应用只能通过托盘菜单的"退出"选项或全局快捷键退出
})

// 应用激活时显示窗口（macOS）
app.on('activate', () => {
  const window = windowManager.getWindow('main');
  if (window === null) {
    createWindow()
  } else {
    showWindowWithTaskbarControl(window)
  }
})
