const path = require('path');

const width = 900;  // 更紧凑的宽度
const height = 600; // 更紧凑的高度

module.exports = {
  createBaseWindowConfig(xy) {
    const config = {
      width,
      height,
      minWidth: 600,  // 更小的最小宽度
      minHeight: 450, // 更小的最小高度
      transparent: false,
      webPreferences: {
        // 安全设置
        nodeIntegration: false, // 禁用Node.js集成
        contextIsolation: true, // 启用上下文隔离
        preload: path.join(__dirname, '../preload.js') // 加载preload脚本
      },
      frame: false,
      titleBarStyle: 'hidden',
      show: false,        // 启动时不显示窗口
      skipTaskbar: true,  // 不在任务栏显示
    }
    if (xy) {
      config.x = xy.x;
      config.y = xy.y;
    }
    return config;
  }
};
