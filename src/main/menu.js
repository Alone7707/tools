const { Menu, app, dialog, BrowserWindow } = require('electron');

class AppMenu {
  constructor() {
    this.template = this.createTemplate();
  }

  createTemplate() {
    const isMac = process.platform === 'darwin';
    
    const template = [
      // 应用菜单 (macOS)
      ...(isMac ? [{
        label: app.getName(),
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      }] : []),
      
      // 文件菜单
      {
        label: '文件',
        submenu: [
          {
            label: '新建',
            accelerator: 'CmdOrCtrl+N',
            click: () => {
              // 新建文件逻辑
              console.log('新建文件');
            }
          },
          {
            label: '打开',
            accelerator: 'CmdOrCtrl+O',
            click: async () => {
              const result = await dialog.showOpenDialog({
                properties: ['openFile'],
                filters: [
                  { name: 'All Files', extensions: ['*'] }
                ]
              });
              
              if (!result.canceled) {
                const win = BrowserWindow.getFocusedWindow();
                win.webContents.send('file-opened', result.filePaths[0]);
              }
            }
          },
          { type: 'separator' },
          {
            label: '退出',
            accelerator: isMac ? 'Cmd+Q' : 'Ctrl+Q',
            click: () => {
              app.quit();
            }
          }
        ]
      },
      
      // 编辑菜单
      {
        label: '编辑',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          ...(isMac ? [
            { role: 'pasteAndMatchStyle' },
            { role: 'delete' },
            { role: 'selectAll' },
            { type: 'separator' },
            {
              label: '语音',
              submenu: [
                { role: 'startSpeaking' },
                { role: 'stopSpeaking' }
              ]
            }
          ] : [
            { role: 'delete' },
            { type: 'separator' },
            { role: 'selectAll' }
          ])
        ]
      },
      
      // 视图菜单
      {
        label: '视图',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      
      // 窗口菜单
      {
        label: '窗口',
        submenu: [
          { role: 'minimize' },
          { role: 'close' },
          ...(isMac ? [
            { type: 'separator' },
            { role: 'front' },
            { type: 'separator' },
            { role: 'window' }
          ] : [])
        ]
      },
      
      // 帮助菜单
      {
        label: '帮助',
        submenu: [
          {
            label: '关于',
            click: () => {
              dialog.showMessageBox({
                type: 'info',
                title: '关于 Electron Tools',
                message: 'Electron Tools v1.0.0',
                detail: '一个现代化的Electron桌面应用\n\n© 2024 Electron Tools Team'
              });
            }
          }
        ]
      }
    ];
    
    return template;
  }

  build() {
    const menu = Menu.buildFromTemplate(this.template);
    Menu.setApplicationMenu(menu);
    return menu;
  }
}

module.exports = AppMenu;