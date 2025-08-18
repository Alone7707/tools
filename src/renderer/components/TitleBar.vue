<template>
  <header class="title-bar">
    <div class="title">🛠️ Electron Tools</div>
    <div class="window-controls">
      <button class="btn-minimize" title="最小化" @click="minimize">−</button>
      <button class="btn-maximize" title="最大化" @click="maximize">□</button>
      <button class="btn-close" title="关闭" @click="close">×</button>
    </div>
  </header>
</template>

<script setup>
const emit = defineEmits(['minimize', 'maximize', 'close'])

const minimize = () => emit('minimize')
const maximize = () => emit('maximize')
const close = () => emit('close')
</script>

<style scoped>
.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  -webkit-app-region: drag;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.window-controls {
  display: flex;
  gap: 5px;
  -webkit-app-region: no-drag;
}

.btn-minimize, .btn-maximize, .btn-close {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 3px;
  transition: background-color 0.2s;
}

.btn-minimize:hover, .btn-maximize:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-close:hover {
  background: #ff4757;
}
</style>