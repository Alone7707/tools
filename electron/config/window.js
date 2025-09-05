const path = require('path');

const width = 1200;
const height = 800;

module.exports = {
  createBaseWindowConfig(xy) {
    const config = {
      width,
      height,
      minWidth: width,
      minHeight: height,
      transparent: false,
      webPreferences: {
        // 安全设置
        nodeIntegration: false, // 禁用Node.js集成
        contextIsolation: true, // 启用上下文隔离
        preload: path.join(__dirname, '../preload.js') // 加载preload脚本
      },
      frame: false,
      titleBarStyle: 'hidden',
    }
    if (xy) {
      config.x = xy.x;
      config.y = xy.y;
    }
    return config;
  }
};
