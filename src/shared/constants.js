// 应用常量
const APP_CONSTANTS = {
  // 应用信息
  APP_NAME: 'ATools',
  APP_VERSION: '1.0.0',

  // 窗口配置
  WINDOW_CONFIG: {
    MIN_WIDTH: 800,
    MIN_HEIGHT: 600,
    DEFAULT_WIDTH: 1200,
    DEFAULT_HEIGHT: 800
  },

  // 文件类型
  SUPPORTED_FILE_TYPES: {
    TEXT: ['txt', 'md', 'json', 'js', 'html', 'css'],
    IMAGE: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'],
    DOCUMENT: ['pdf', 'doc', 'docx', 'xls', 'xlsx']
  },

  // IPC事件名称
  IPC_EVENTS: {
    FILE: {
      READ: 'read-file',
      WRITE: 'write-file',
      SELECT: 'select-file'
    },
    WINDOW: {
      MINIMIZE: 'window-minimize',
      MAXIMIZE: 'window-maximize',
      CLOSE: 'window-close'
    },
    SYSTEM: {
      GET_VERSION: 'get-app-version',
      OPEN_EXTERNAL: 'open-external',
      SHOW_MESSAGE: 'show-message-box'
    }
  }
};

module.exports = APP_CONSTANTS;