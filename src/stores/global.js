import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore('global', () => {
  const isDark = ref(false)
  const isCustomTheme = ref(false)

  const themePrimaryColor = ref('');
  const themeSecondaryColor = ref('');
  const themeBackgroundColor = ref('');
  const themeCardBackgroundColor = ref('');
  const themeTextColor = ref('');
  const themeTextSecondaryColor = ref('');
  const themeBorderColor = ref('');
  const themeInputBackgroundColor = ref('');

  // 全局快捷键
  const globalShortcut = ref('CommandOrControl+Shift+T');

  // 初始化全局快捷键
  const initGlobalShortcut = () => {
    const savedGlobalShortcut = localStorage.getItem('globalShortcut');
    if (savedGlobalShortcut) {
      globalShortcut.value = savedGlobalShortcut;
    }
  }

  // 设置全局快捷键
  const setGlobalShortcut = (shortcut) => {
    globalShortcut.value = shortcut;
    localStorage.setItem('globalShortcut', shortcut);
  }

  // 初始化主题
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    const savedCustomTheme = localStorage.getItem('customTheme')
    const savedPrimaryColor = localStorage.getItem('primaryColor')
    const savedSecondaryColor = localStorage.getItem('secondaryColor')
    const savedBackgroundColor = localStorage.getItem('backgroundColor')
    const savedCardBackgroundColor = localStorage.getItem('cardBackgroundColor')
    const savedTextColor = localStorage.getItem('textColor')
    const savedTextSecondaryColor = localStorage.getItem('textSecondaryColor')
    const savedBorderColor = localStorage.getItem('borderColor')
    const savedInputBackgroundColor = localStorage.getItem('inputBackgroundColor')

    if (savedTheme === 'custom' && savedCustomTheme === 'true') {
      isCustomTheme.value = true
      themePrimaryColor.value = savedPrimaryColor || '#667eea'
      themeSecondaryColor.value = savedSecondaryColor || '#764ba2'
      themeBackgroundColor.value = savedBackgroundColor || '#f8f9fa'
      themeCardBackgroundColor.value = savedCardBackgroundColor || 'white'
      themeTextColor.value = savedTextColor || '#333'
      themeTextSecondaryColor.value = savedTextSecondaryColor || '#666'
      themeBorderColor.value = savedBorderColor || '#dee2e6'
      themeInputBackgroundColor.value = savedInputBackgroundColor || 'white'
      setTheme('custom')
    } else if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // 检测系统主题偏好
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(systemDark ? 'dark' : 'light')
    }
  }

  // 切换主题
  const toggleTheme = () => {
    const newTheme = isDark.value ? 'light' : 'dark'
    setTheme(newTheme)
  }

  // 设置主题
  const setTheme = (theme) => {
    if (theme === 'dark') {
      isDark.value = true
      isCustomTheme.value = false
      themePrimaryColor.value = '#667eea'
      themeSecondaryColor.value = '#764ba2'
      themeBackgroundColor.value = '#1a1a1a'
      themeCardBackgroundColor.value = '#2d2d2d'
      themeTextColor.value = '#fff'
      themeTextSecondaryColor.value = '#ccc'
      themeBorderColor.value = '#333'
      themeInputBackgroundColor.value = '#3d3d3d'
    } else if (theme === 'light') {
      isDark.value = false
      isCustomTheme.value = false
      themePrimaryColor.value = '#764ba2'
      themeSecondaryColor.value = '#667eea'
      themeBackgroundColor.value = '#f8f9fa'
      themeCardBackgroundColor.value = 'white'
      themeTextColor.value = '#333'
      themeTextSecondaryColor.value = '#666'
      themeBorderColor.value = '#dee2e6'
      themeInputBackgroundColor.value = 'white'
    } else if (theme === 'custom') {
      isCustomTheme.value = true
      // 保持当前颜色值不变
    }

    localStorage.setItem('theme', theme)
    localStorage.setItem('customTheme', isCustomTheme.value.toString())
  }

  const collapsed = ref(false)

  // 初始化菜单状态
  const initMenuState = () => {
    const savedState = localStorage.getItem('menu-collapsed')
    if (savedState !== null) {
      collapsed.value = savedState === 'true'
    }
  }

  // 切换菜单折叠状态
  const toggleCollapse = () => {
    collapsed.value = !collapsed.value
    localStorage.setItem('menu-collapsed', collapsed.value.toString())
  }

  // 设置菜单折叠状态
  const setCollapsed = (isCollapsed) => {
    collapsed.value = isCollapsed
    localStorage.setItem('menu-collapsed', collapsed.value.toString())
  }

  // 设置自定义主题颜色
  const setCustomColors = (primaryColor, secondaryColor, backgroundColor, cardBackgroundColor, textColor, textSecondaryColor, borderColor, inputBackgroundColor) => {
    themePrimaryColor.value = primaryColor
    themeSecondaryColor.value = secondaryColor
    themeBackgroundColor.value = backgroundColor
    themeCardBackgroundColor.value = cardBackgroundColor
    themeTextColor.value = textColor
    themeTextSecondaryColor.value = textSecondaryColor
    themeBorderColor.value = borderColor
    themeInputBackgroundColor.value = inputBackgroundColor
    localStorage.setItem('primaryColor', primaryColor)
    localStorage.setItem('secondaryColor', secondaryColor)
    localStorage.setItem('backgroundColor', backgroundColor)
    localStorage.setItem('cardBackgroundColor', cardBackgroundColor)
    localStorage.setItem('textColor', textColor)
    localStorage.setItem('textSecondaryColor', textSecondaryColor)
    localStorage.setItem('borderColor', borderColor)
    localStorage.setItem('inputBackgroundColor', inputBackgroundColor)

    if (!isCustomTheme.value) {
      setTheme('custom')
    }
  }

  // 切换到自定义主题
  const enableCustomTheme = () => {
    setTheme('custom')
  }

  return {
    isDark,
    isCustomTheme,
    themePrimaryColor,
    themeSecondaryColor,
    themeBackgroundColor,
    themeCardBackgroundColor,
    themeTextColor,
    themeTextSecondaryColor,
    themeBorderColor,
    themeInputBackgroundColor,
    globalShortcut,
    initTheme,
    initGlobalShortcut,
    toggleTheme,
    setTheme,
    setCustomColors,
    enableCustomTheme,
    setGlobalShortcut,
    collapsed,
    initMenuState,
    toggleCollapse,
    setCollapsed
  }
})
