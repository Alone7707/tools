export interface ElectronAPI {
  // 文件操作
  readFile: (filePath: string) => Promise<{ success: boolean; content?: string; error?: string }>;
  writeFile: (filePath: string, content: string) => Promise<{ success: boolean; error?: string }>;
  selectFile: () => Promise<{ success: boolean; filePath?: string; error?: string }>;
  
  // 系统操作
  getAppVersion: () => Promise<string>;
  openExternal: (url: string) => Promise<void>;
  showMessageBox: (options: any) => Promise<any>;
  
  // 窗口控制
  windowMinimize: () => Promise<void>;
  windowMaximize: () => Promise<void>;
  windowClose: () => Promise<void>;
  
  // 系统信息
  getSystemInfo: () => Promise<{
    platform: string;
    arch: string;
    version: string;
    electron: string;
    node: string;
  }>;
  
  // 开发者工具
  openDevTools: () => Promise<{ success: boolean; error?: string }>;
}

declare interface Window {
  electronAPI: ElectronAPI;
}

// 扩展Vue的全局属性
import '@vue/runtime-core';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $electron: ElectronAPI;
  }
}