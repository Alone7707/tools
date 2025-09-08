<template>
  <header class="title-bar">
    <div class="title">🛠️ Alone Tools</div>
    <div class="window-controls">
      <button class="btn-minimize" title="最小化" @click="minimize">
        <img src="@/assets/svg/minimize.svg" width="16" alt="">
      </button>
      <button class="btn-maximize" title="最大化" @click="maximize">
        <img src="@/assets/svg/maximize.svg" width="16" alt="">
      </button>
      <button class="btn-close" title="最小化到托盘" @click="minimizeToTray">
        <img src="@/assets/svg/close.svg" width="16" alt="">
      </button>
    </div>
  </header>
</template>

<script setup>
const emit = defineEmits(['minimize', 'maximize', 'minimizeToTray'])

const minimize = () => emit('minimize')
const maximize = () => emit('maximize')
const minimizeToTray = () => emit('minimizeToTray')
</script>

<style scoped lang="scss">
.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  height: 45px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  -webkit-app-region: drag;

  .title {
    font-size: 18px;
    font-weight: bold;
  }

  .window-controls {
    display: flex;
    gap: 5px;
    -webkit-app-region: no-drag;

    .btn-minimize,
    .btn-maximize,
    .btn-close {
      width: 45px;
      height: 45px;
      background: none;
      border: none;
      color: white;
      font-size: 16px;
      cursor: pointer;
      border-radius: 3px;
      transition: background-color 0.2s;

      img {
        // 将SVG图标颜色改为白色
        filter: brightness(0) invert(1);
      }

      &:hover {

        &.btn-minimize,
        &.btn-maximize {
          background: rgba(255, 255, 255, 0.2);

          img {
            // 悬停时保持白色
            filter: brightness(0) invert(1);
          }
        }

        &.btn-close {
          background: #ff4757;

          img {
            // 关闭按钮悬停时也保持白色
            filter: brightness(0) invert(1);
          }
        }
      }
    }
  }
}
</style>
