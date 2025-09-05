<template>
  <div class="electron-demo">
    <h2>Electron API 演示</h2>
    
    <div class="demo-section">
      <h3>系统信息</h3>
      <button @click="getSystemInfo">获取系统信息</button>
      <div v-if="systemInfo" class="info-box">
        <p>平台: {{ systemInfo.platform }}</p>
        <p>架构: {{ systemInfo.arch }}</p>
        <p>版本: {{ systemInfo.version }}</p>
        <p>Electron: {{ systemInfo.electron }}</p>
        <p>Node: {{ systemInfo.node }}</p>
      </div>
    </div>
    
    <div class="demo-section">
      <h3>文件操作</h3>
      <button @click="selectFile">选择文件</button>
      <div v-if="selectedFile" class="info-box">
        <p>已选择文件: {{ selectedFile }}</p>
      </div>
    </div>
    
    <div class="demo-section">
      <h3>窗口控制</h3>
      <div class="button-group">
        <button @click="minimizeWindow">最小化</button>
        <button @click="maximizeWindow">最大化/还原</button>
        <button @click="closeWindow">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ElectronDemo',
  setup() {
    const systemInfo = ref(null);
    const selectedFile = ref('');
    
    // 获取系统信息
    const getSystemInfo = async () => {
      try {
        if (window.electronAPI) {
          const info = await window.electronAPI.getSystemInfo();
          systemInfo.value = info;
        } else {
          console.error('electronAPI 不可用');
        }
      } catch (error) {
        console.error('获取系统信息失败:', error);
      }
    };
    
    // 选择文件
    const selectFile = async () => {
      try {
        if (window.electronAPI) {
          const result = await window.electronAPI.selectFile();
          if (result.success) {
            selectedFile.value = result.filePath;
          } else {
            console.error('选择文件失败:', result.error);
          }
        } else {
          console.error('electronAPI 不可用');
        }
      } catch (error) {
        console.error('选择文件失败:', error);
      }
    };
    
    // 窗口控制
    const minimizeWindow = () => {
      if (window.electronAPI) {
        window.electronAPI.windowMinimize();
      }
    };
    
    const maximizeWindow = () => {
      if (window.electronAPI) {
        window.electronAPI.windowMaximize();
      }
    };
    
    const closeWindow = () => {
      if (window.electronAPI) {
        window.electronAPI.windowClose();
      }
    };
    
    return {
      systemInfo,
      selectedFile,
      getSystemInfo,
      selectFile,
      minimizeWindow,
      maximizeWindow,
      closeWindow
    };
  }
});
</script>

<style scoped>
.electron-demo {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.demo-section {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
}

h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

h3 {
  color: #42b983;
  margin-bottom: 15px;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3aa876;
}

.info-box {
  margin-top: 15px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.button-group {
  display: flex;
  gap: 10px;
}
</style>