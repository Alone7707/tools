<template>
  <div class="settings">
    <h1>设置</h1>
    <div class="settings-grid">
      <div class="setting-item">
        <label>主题:</label>
        <BaseSelect v-model="currentTheme" :options="themeOptions" @change="changeTheme" />
      </div>

      <!-- 自定义主题颜色设置 -->
      <div v-if="currentTheme === 'custom'" class="custom-theme-settings">
        <!-- 预设主题推荐 -->
        <div class="preset-themes">
          <h3>推荐搭配</h3>
          <div class="preset-themes-grid">
            <div class="preset-theme-card" @click="applyPresetTheme('ocean')">
              <div class="preset-theme-preview" :style="{ background: 'linear-gradient(135deg, #2196F3, #0D47A1)' }">
              </div>
              <div class="preset-theme-name">海洋蓝</div>
            </div>
            <div class="preset-theme-card" @click="applyPresetTheme('forest')">
              <div class="preset-theme-preview" :style="{ background: 'linear-gradient(135deg, #4CAF50, #1B5E20)' }">
              </div>
              <div class="preset-theme-name">森林绿</div>
            </div>
            <div class="preset-theme-card" @click="applyPresetTheme('sunset')">
              <div class="preset-theme-preview" :style="{ background: 'linear-gradient(135deg, #FF9800, #E65100)' }">
              </div>
              <div class="preset-theme-name">夕阳橙</div>
            </div>
            <div class="preset-theme-card" @click="applyPresetTheme('lavender')">
              <div class="preset-theme-preview" :style="{ background: 'linear-gradient(135deg, #9C27B0, #4A148C)' }">
              </div>
              <div class="preset-theme-name">薰衣草</div>
            </div>
          </div>
        </div>
        <h3>自定义颜色</h3>
        <div class="custom-theme-color">
          <div class="setting-item">
            <label>主色调:</label>
            <div class="color-picker-wrapper">
              <input type="color" v-model="primaryColor" @change="updateCustomColors" class="color-picker" />
            </div>
          </div>

          <div class="setting-item">
            <label>辅色调:</label>
            <div class="color-picker-wrapper">
              <input type="color" v-model="secondaryColor" @change="updateCustomColors" class="color-picker" />
            </div>
          </div>

          <div class="setting-item">
            <label>背景色:</label>
            <div class="color-picker-wrapper">
              <input type="color" v-model="backgroundColor" @change="updateCustomColors" class="color-picker" />
            </div>
          </div>

          <div class="setting-item">
            <label>卡片背景色:</label>
            <div class="color-picker-wrapper">
              <input type="color" v-model="cardBackgroundColor" @change="updateCustomColors" class="color-picker" />
            </div>
          </div>

          <div class="setting-item">
            <label>文本颜色:</label>
            <div class="color-picker-wrapper">
              <input type="color" v-model="textColor" @change="updateCustomColors" class="color-picker" />
            </div>
          </div>

          <div class="setting-item">
            <label>次要文本颜色:</label>
            <div class="color-picker-wrapper">
              <input type="color" v-model="textSecondaryColor" @change="updateCustomColors" class="color-picker" />
            </div>
          </div>

          <div class="setting-item">
            <label>边框颜色:</label>
            <div class="color-picker-wrapper">
              <input type="color" v-model="borderColor" @change="updateCustomColors" class="color-picker" />
            </div>
          </div>

          <div class="setting-item">
            <label>输入框背景色:</label>
            <div class="color-picker-wrapper">
              <input type="color" v-model="inputBackgroundColor" @change="updateCustomColors" class="color-picker" />
            </div>
          </div>
        </div>
      </div>

      <!-- 快捷键设置 -->
      <div class="setting-item">
        <label>全局快捷键:</label>
        <div class="shortcut-input-wrapper">
          <div class="shortcut-input-container">
            <div class="shortcut-hint">提示: 点击录制按钮后按下快捷键组合</div>
            <input type="text" v-model="shortcutKey" @change="updateShortcutKey" @focus="startRecording"
              placeholder="例如: Ctrl+Shift+T" class="shortcut-input" :class="{ 'recording': isRecording }" readonly />
            <button @click="toggleRecording" class="record-button" :class="{ 'recording': isRecording }">
              {{ isRecording ? '停止' : '录制' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, getCurrentInstance } from 'vue'
import { useGlobalStore } from '@/stores/global'
import BaseSelect from '@/components/ui/BaseSelect.vue'

const { proxy } = getCurrentInstance()

const themeOptions = [
  { value: 'light', label: '浅色' },
  { value: 'dark', label: '深色' },
  { value: 'custom', label: '自定义' }
]

const themeStore = useGlobalStore()

const currentTheme = computed({
  get: () => {
    if (themeStore.isCustomTheme) return 'custom'
    return themeStore.isDark ? 'dark' : 'light'
  },
  set: (value) => {
    if (value === 'custom') {
      themeStore.enableCustomTheme()
    } else {
      themeStore.setTheme(value)
    }
  }
})

const primaryColor = ref(themeStore.themePrimaryColor || '#667eea')
const secondaryColor = ref(themeStore.themeSecondaryColor || '#764ba2')
const backgroundColor = ref(themeStore.themeBackgroundColor || '#f8f9fa')
const cardBackgroundColor = ref(themeStore.themeCardBackgroundColor || 'white')
const textColor = ref(themeStore.themeTextColor || '#333')
const textSecondaryColor = ref(themeStore.themeTextSecondaryColor || '#666')
const borderColor = ref(themeStore.themeBorderColor || '#dee2e6')
const inputBackgroundColor = ref(themeStore.themeInputBackgroundColor || 'white')

// 全局快捷键
const shortcutKey = ref(themeStore.globalShortcut || 'CommandOrControl+Shift+T')
const isRecording = ref(false)
const pressedKeys = new Set()
const recordedShortcut = ref('')

// 监听主题颜色变化，更新本地引用
watch(() => themeStore.themePrimaryColor, (newVal) => {
  primaryColor.value = newVal
})

watch(() => themeStore.themeSecondaryColor, (newVal) => {
  secondaryColor.value = newVal
})

watch(() => themeStore.themeBackgroundColor, (newVal) => {
  backgroundColor.value = newVal
})

watch(() => themeStore.themeCardBackgroundColor, (newVal) => {
  cardBackgroundColor.value = newVal
})

watch(() => themeStore.themeTextColor, (newVal) => {
  textColor.value = newVal
})

watch(() => themeStore.themeTextSecondaryColor, (newVal) => {
  textSecondaryColor.value = newVal
})

watch(() => themeStore.themeBorderColor, (newVal) => {
  borderColor.value = newVal
})

watch(() => themeStore.themeInputBackgroundColor, (newVal) => {
  inputBackgroundColor.value = newVal
})

// 监听全局快捷键变化
watch(() => themeStore.globalShortcut, (newVal) => {
  shortcutKey.value = newVal
})

// 开始录制快捷键
const startRecording = () => {
  isRecording.value = true
  pressedKeys.clear()
  recordedShortcut.value = ''
  shortcutKey.value = ''
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyUp)
}

// 停止录制快捷键
const stopRecording = () => {
  if (isRecording.value) {
    isRecording.value = false
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('keyup', handleKeyUp)
    pressedKeys.clear()

    // 恢复显示保存的完整快捷键
    if (recordedShortcut.value) {
      shortcutKey.value = recordedShortcut.value
    }
  }
}

// 切换录制状态
const toggleRecording = () => {
  if (isRecording.value) {
    // 停止录制并应用快捷键
    if (recordedShortcut.value) {
      shortcutKey.value = recordedShortcut.value
      updateShortcutKey()
    }
    stopRecording()
  } else {
    startRecording()
  }
}

// 处理按键按下事件
const handleKeyDown = (e) => {
  if (!isRecording.value) return

  e.preventDefault()

  // 记录按下的键
  pressedKeys.add(e.key.toLowerCase())

  // 更新显示的快捷键
  updateShortcutDisplay()

  // 保存当前录制的快捷键
  recordedShortcut.value = shortcutKey.value
}

// 处理按键释放事件
const handleKeyUp = (e) => {
  if (!isRecording.value) return

  e.preventDefault()

  // 移除释放的键
  pressedKeys.delete(e.key.toLowerCase())

  // 保持显示之前录制的完整快捷键，不更新显示
}

// 更新快捷键显示
const updateShortcutDisplay = () => {
  const modifiers = []
  const mainKey = []

  // 分类修饰键和主键
  pressedKeys.forEach(key => {
    if (['control', 'ctrl', 'shift', 'alt', 'meta', 'cmd', 'command'].includes(key)) {
      modifiers.push(key)
    } else if (key.length === 1 || ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12', 'escape', 'tab', 'capslock', 'space', 'enter', 'backspace', 'delete', 'insert', 'home', 'end', 'pageup', 'pagedown', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
      mainKey.push(key)
    }
  })

  // 格式化快捷键显示
  let formattedShortcut = ''

  // 标准化修饰键名称
  if (modifiers.includes('control') || modifiers.includes('ctrl')) {
    formattedShortcut += 'Ctrl+'
  }
  if (modifiers.includes('shift')) {
    formattedShortcut += 'Shift+'
  }
  if (modifiers.includes('alt')) {
    formattedShortcut += 'Alt+'
  }
  if (modifiers.includes('meta') || modifiers.includes('cmd') || modifiers.includes('command')) {
    formattedShortcut += 'Cmd+'
  }

  // 添加主键
  if (mainKey.length > 0) {
    // 标准化主键名称
    const key = mainKey[0]
    if (key === ' ') {
      formattedShortcut += 'Space'
    } else if (key === 'escape') {
      formattedShortcut += 'Esc'
    } else if (key.startsWith('arrow')) {
      formattedShortcut += key.charAt(5).toUpperCase() + key.slice(6)
    } else if (key.length === 1) {
      formattedShortcut += key.toUpperCase()
    } else {
      formattedShortcut += key.charAt(0).toUpperCase() + key.slice(1)
    }
  }

  // 更新显示
  shortcutKey.value = formattedShortcut
}

const changeTheme = () => {
  if (currentTheme.value === 'custom') {
    themeStore.enableCustomTheme()
  } else {
    themeStore.setTheme(currentTheme.value)
  }
}

const updateCustomColors = () => {
  themeStore.setCustomColors(
    primaryColor.value, secondaryColor.value,
    backgroundColor.value,
    cardBackgroundColor.value,
    textColor.value,
    textSecondaryColor.value,
    borderColor.value,
    inputBackgroundColor.value
  )
}

// 更新全局快捷键
const updateShortcutKey = () => {
  // 确保快捷键格式正确
  let formattedShortcut = shortcutKey.value.trim()
  const previousShortcut = themeStore.globalShortcut // 保存之前的快捷键，以便在失败时回滚

  // 标准化快捷键格式
  if (formattedShortcut) {
    // 替换可能的变体
    formattedShortcut = formattedShortcut
      .replace(/control/i, 'Ctrl')
      .replace(/command/i, 'Cmd')
      .replace(/meta/i, 'Cmd')
      .replace(/alt/i, 'Alt')
      .replace(/shift/i, 'Shift')
      .replace(/\+/g, '+')
      .replace(/\+\+/g, '+')
      .replace(/^\+|\+$/g, '')

    // 确保修饰键在前
    const parts = formattedShortcut.split('+')
    const modifiers = ['Ctrl', 'Cmd', 'Alt', 'Shift']
    const otherKeys = parts.filter(p => !modifiers.includes(p))
    const modifierKeys = parts.filter(p => modifiers.includes(p))

    if (modifierKeys.length > 0 && otherKeys.length > 0) {
      formattedShortcut = [...modifierKeys, ...otherKeys].join('+')
    }

    // 更新输入框和存储
    shortcutKey.value = formattedShortcut
    themeStore.setGlobalShortcut(formattedShortcut)

    // 通知主进程更新全局快捷键
    if (window.electronAPI && window.electronAPI.updateGlobalShortcut) {
      window.electronAPI.updateGlobalShortcut(formattedShortcut)
        .then(result => {
          if (result && result.success) {
            console.log('全局快捷键更新成功:', formattedShortcut)
          } else {
            console.error('全局快捷键更新失败:', result ? result.error : '未知错误')
            // 回滚快捷键设置
            shortcutKey.value = previousShortcut
            themeStore.setGlobalShortcut(previousShortcut)
            // 显示错误提示
            if (proxy && proxy.$toast) {
              proxy.$toast.error('快捷键设置失败，请重试')
            }
          }
        })
        .catch(error => {
          console.error('调用全局快捷键更新API失败:', error)
          // 回滚快捷键设置
          shortcutKey.value = previousShortcut
          themeStore.setGlobalShortcut(previousShortcut)
          // 显示错误提示
          if (proxy && proxy.$toast) {
            proxy.$toast.error('快捷键设置失败，请重试')
          }
        })
    }
  }
}

// 应用预设主题
const applyPresetTheme = (themeName) => {
  let preset = {}

  switch (themeName) {
    case 'ocean':
      preset = {
        primary: '#2196F3',
        secondary: '#0D47A1',
        background: '#E3F2FD',
        cardBackground: '#FFFFFF',
        text: '#263238',
        textSecondary: '#546E7A',
        border: '#BBDEFB',
        inputBackground: '#FFFFFF'
      }
      break
    case 'forest':
      preset = {
        primary: '#4CAF50',
        secondary: '#1B5E20',
        background: '#E8F5E9',
        cardBackground: '#FFFFFF',
        text: '#1B5E20',
        textSecondary: '#388E3C',
        border: '#A5D6A7',
        inputBackground: '#FFFFFF'
      }
      break
    case 'sunset':
      preset = {
        primary: '#FF9800',
        secondary: '#E65100',
        background: '#FFF3E0',
        cardBackground: '#FFFFFF',
        text: '#3E2723',
        textSecondary: '#5D4037',
        border: '#FFCC80',
        inputBackground: '#FFFFFF'
      }
      break
    case 'lavender':
      preset = {
        primary: '#9C27B0',
        secondary: '#4A148C',
        background: '#F3E5F5',
        cardBackground: '#FFFFFF',
        text: '#4A148C',
        textSecondary: '#7B1FA2',
        border: '#CE93D8',
        inputBackground: '#FFFFFF'
      }
      break
  }

  // 更新本地颜色值
  primaryColor.value = preset.primary
  secondaryColor.value = preset.secondary
  backgroundColor.value = preset.background
  cardBackgroundColor.value = preset.cardBackground
  textColor.value = preset.text
  textSecondaryColor.value = preset.textSecondary
  borderColor.value = preset.border
  inputBackgroundColor.value = preset.inputBackground

  // 应用到主题
  updateCustomColors()
}
</script>

<style lang="scss" scoped>
@keyframes pulse {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.7;
  }

  100% {
    opacity: 1;
  }
}

.settings {
  padding: 20px;
  background: var(--background-color);

  h1 {
    color: var(--text-color);
    margin-bottom: 20px;
  }

  .settings-grid {
    max-width: 100%;

    .setting-item {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      background: var(--card-background, white);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border-color);
      margin-bottom: 10px;
      transition: box-shadow 0.3s ease;

      &:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      label {
        width: 200px;
        font-weight: bold;
        color: var(--text-color);
      }

      select {
        padding: 5px 10px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--input-background, white);
        color: var(--text-color);
      }

      .color-picker-wrapper {
        display: flex;
        align-items: center;
        gap: 10px;

        .color-picker {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      }

      .shortcut-input-wrapper {
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 60%;

        .shortcut-input-container {
          display: flex;
          gap: 8px;
          align-items: center;

          .shortcut-hint {
            font-size: 12px;
            color: var(--text-secondary-color);
            display: inline;
            margin-left: 24px;
          }

          .shortcut-input {
            flex: 1;
            padding: 8px 10px;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            background: var(--input-background, white);
            color: var(--text-color);
            font-size: 14px;
            transition: border-color 0.3s;
            cursor: pointer;

            &:focus {
              outline: none;
              border-color: var(--primary-color);
            }

            &.recording {
              border-color: var(--primary-color);
              box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb, 102, 126, 234), 0.2);
            }
          }

          .record-button {
            padding: 6px 12px;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            background: var(--input-background, white);
            color: var(--text-color);
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
              background: var(--primary-color);
              color: white;
              border-color: var(--primary-color);
            }

            &.recording {
              background: var(--primary-color);
              color: white;
              border-color: var(--primary-color);
              animation: pulse 1.5s infinite;
            }
          }
        }
      }
    }
  }

  .custom-theme-settings {
    margin-top: 15px;
    padding: 15px;
    background: var(--card-background, white);
    border-radius: 8px;
    border: 1px solid var(--border-color);

    .setting-item {
      margin-bottom: 0;
    }

    .preset-themes {
      grid-column: 1 / -1;
      margin-bottom: 15px;

      .preset-themes-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 10px;

        .preset-theme-card {
          cursor: pointer;
          border-radius: 6px;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          border: 1px solid var(--border-color);

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          }

          .preset-theme-preview {
            height: 60px;
            width: 100%;
          }

          .preset-theme-name {
            padding: 8px;
            text-align: center;
            background: var(--card-background, white);
            color: var(--text-color);
            font-size: 14px;
          }
        }
      }
    }

    h3 {
      margin: 0 0 10px 0;
      color: var(--text-color);
      font-size: 16px;
    }

    .custom-theme-color {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 12px;

    }
  }
}
</style>
