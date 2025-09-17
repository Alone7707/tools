<template>
  <header class="title-bar">
    <div class="app-info">
      <div class="app-icon">⚡</div>
      <div class="app-title">
        <span class="app-name">Tools</span>
        <span class="app-subtitle">小工具集</span>
      </div>
    </div>
    <!-- <div class="window-controls">
      <button class="control-btn minimize" title="最小化" @click="minimize">
        <svg viewBox="0 0 1024 1024" width="16" height="16">
          <path d="M128 448h768v128H128z" fill="currentColor" />
        </svg>
      </button>
      <button class="control-btn maximize" title="最大化" @click="maximize">
        <svg viewBox="0 0 1024 1024" width="16" height="16">
          <path
            d="M959.72 0H294.216a63.96 63.96 0 0 0-63.96 63.96v127.92H64.28A63.96 63.96 0 0 0 0.32 255.84V959.4a63.96 63.96 0 0 0 63.96 63.96h703.56a63.96 63.96 0 0 0 63.96-63.96V792.465h127.92a63.96 63.96 0 0 0 63.96-63.96V63.96A63.96 63.96 0 0 0 959.72 0zM767.84 728.505V959.4H64.28V255.84h703.56z m189.322 0H831.8V255.84a63.96 63.96 0 0 0-63.96-63.96H294.216V63.96H959.72z"
            fill="currentColor" />
        </svg>
      </button>
      <button class="control-btn close" title="最小化到托盘" @click="minimizeToTray">
        <svg viewBox="0 0 1024 1024" width="16" height="16">
          <path
            d="M585.412525 512.594747L973.601616 124.418586c19.600808-19.600808 19.600808-51.898182 0-71.49899l-2.120404-2.120404c-19.600808-19.600808-51.898182-19.600808-71.49899 0L511.793131 439.518384 123.61697 50.799192c-19.600808-19.600808-51.898182-19.600808-71.49899 0l-2.120404 2.120404c-20.11798 19.600808-20.11798 51.898182 0 71.49899l388.189091 388.189091L49.997576 900.783838c-19.587879 19.600808-19.587879 51.898182 0 71.49899l2.120404 2.120404c19.600808 19.600808 51.898182 19.600808 71.49899 0L511.793131 586.214141l388.189091 388.176162c19.600808 19.600808 51.898182 19.600808 71.49899 0l2.120404-2.120404c19.600808-19.600808 19.600808-51.898182 0-71.49899L585.412525 512.594747z m0 0"
            fill="currentColor" />
        </svg>
      </button>
    </div> -->
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
  justify-content: center;
  align-items: center;
  padding: 0 16px;
  height: 38px;
  background: var(--card-background);
  border-bottom: 1px solid var(--border-color);
  -webkit-app-region: drag;

  .app-info {
    display: flex;
    align-items: center;
    gap: 10px;

    .app-icon {
      font-size: 20px;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      border-radius: 6px;
      color: white;
    }

    .app-title {
      display: flex;
      flex-direction: column;
      line-height: 1.2;

      .app-name {
        font-size: 14px;
        font-weight: 600;
        color: var(--text-color);
      }

      .app-subtitle {
        font-size: 11px;
        color: var(--text-secondary-color);
      }
    }
  }

  .window-controls {
    display: flex;
    -webkit-app-region: no-drag;

    .control-btn {
      width: 32px;
      height: 32px;
      background: none;
      border: none;
      color: var(--text-secondary-color);
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 16px;
        height: 16px;
        opacity: 0.8;
        transition: opacity 0.2s ease;
      }

      &:hover {
        background: var(--border-color);
        color: var(--text-color);

        svg {
          opacity: 1;
        }

        &.close {
          background: #ff5f56;
          color: white;
        }
      }

    }
  }
}
</style>
