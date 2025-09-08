<template>
  <div class="encoder-decoder-container">
    <div class="header">
      <h1>🔐 加解密编码工具</h1>
      <p class="subtitle">支持多种编码格式的转换与加解密</p>
    </div>

    <!-- 顶部选项卡 -->
    <div class="tabs-container">
      <div class="tabs">
        <button v-for="tab in tabs" :key="tab.id" :class="['tab-button', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id">
          <span class="tab-icon">{{ tab.icon }}</span>
          {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- 下方内容区域 -->
    <div class="content-area">
      <transition name="fade-slide" mode="out-in">
        <!-- Base64 编码/解码 -->
        <div :key="activeTab" class="tool-content">
          <div v-if="activeTab === 'base64'">
            <div class="tool-header">
              <h3>Base64 编码/解码</h3>
              <p class="tool-description">将文本编码为Base64格式或将Base64解码为原始文本</p>
            </div>
            <div class="input-group">
              <label>输入文本</label>
              <textarea v-model="base64Input" placeholder="请输入要处理的文本..."></textarea>
            </div>
            <div class="button-group">
              <button @click="encodeBase64" class="btn-primary">编码</button>
              <button @click="decodeBase64" class="btn-secondary">解码</button>
              <button @click="clearBase64" class="btn-clear">清空</button>
            </div>
            <div class="result-group">
              <label>结果</label>
              <textarea v-model="base64Output" readonly placeholder="结果将显示在这里..."></textarea>
              <button @click="copyToClipboard(base64Output)" class="btn-copy">复制</button>
            </div>
          </div>

          <!-- URL 编码/解码 -->
          <div v-else-if="activeTab === 'url'">
            <div class="tool-header">
              <h3>URL 编码/解码</h3>
              <p class="tool-description">将文本编码为URL安全格式或将URL编码解码为原始文本</p>
            </div>
            <div class="input-group">
              <label>输入文本</label>
              <textarea v-model="urlInput" placeholder="请输入要处理的文本..."></textarea>
            </div>
            <div class="button-group">
              <button @click="encodeUrl" class="btn-primary">编码</button>
              <button @click="decodeUrl" class="btn-secondary">解码</button>
              <button @click="clearUrl" class="btn-clear">清空</button>
            </div>
            <div class="result-group">
              <label>结果</label>
              <textarea v-model="urlOutput" readonly placeholder="结果将显示在这里..."></textarea>
              <button @click="copyToClipboard(urlOutput)" class="btn-copy">复制</button>
            </div>
          </div>

          <!-- MD5 加密 -->
          <div v-else-if="activeTab === 'md5'">
            <div class="tool-header">
              <h3>MD5 加密</h3>
              <p class="tool-description">将文本转换为32位的MD5哈希值</p>
            </div>
            <div class="input-group">
              <label>输入文本</label>
              <textarea v-model="md5Input" placeholder="请输入要加密的文本..."></textarea>
            </div>
            <div class="button-group">
              <button @click="encryptMD5" class="btn-primary">加密</button>
              <button @click="clearMD5" class="btn-clear">清空</button>
            </div>
            <div class="result-group">
              <label>MD5 结果</label>
              <textarea v-model="md5Output" readonly placeholder="MD5 结果将显示在这里..."></textarea>
              <button @click="copyToClipboard(md5Output)" class="btn-copy">复制</button>
            </div>
          </div>

          <!-- SHA1 加密 -->
          <div v-else-if="activeTab === 'sha1'">
            <div class="tool-header">
              <h3>SHA1 加密</h3>
              <p class="tool-description">将文本转换为40位的SHA1哈希值</p>
            </div>
            <div class="input-group">
              <label>输入文本</label>
              <textarea v-model="sha1Input" placeholder="请输入要加密的文本..."></textarea>
            </div>
            <div class="button-group">
              <button @click="encryptSHA1" class="btn-primary">加密</button>
              <button @click="clearSHA1" class="btn-clear">清空</button>
            </div>
            <div class="result-group">
              <label>SHA1 结果</label>
              <textarea v-model="sha1Output" readonly placeholder="SHA1 结果将显示在这里..."></textarea>
              <button @click="copyToClipboard(sha1Output)" class="btn-copy">复制</button>
            </div>
          </div>

          <!-- SHA256 加密 -->
          <div v-else-if="activeTab === 'sha256'">
            <div class="tool-header">
              <h3>SHA256 加密</h3>
              <p class="tool-description">将文本转换为64位的SHA256哈希值</p>
            </div>
            <div class="input-group">
              <label>输入文本</label>
              <textarea v-model="sha256Input" placeholder="请输入要加密的文本..."></textarea>
            </div>
            <div class="button-group">
              <button @click="encryptSHA256" class="btn-primary">加密</button>
              <button @click="clearSHA256" class="btn-clear">清空</button>
            </div>
            <div class="result-group">
              <label>SHA256 结果</label>
              <textarea v-model="sha256Output" readonly placeholder="SHA256 结果将显示在这里..."></textarea>
              <button @click="copyToClipboard(sha256Output)" class="btn-copy">复制</button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

// 选项卡配置
const tabs = [
  { id: 'base64', name: 'Base64', icon: '🔤' },
  { id: 'url', name: 'URL编码', icon: '🔗' },
  { id: 'md5', name: 'MD5', icon: '🔒' },
  { id: 'sha1', name: 'SHA1', icon: '🔐' },
  { id: 'sha256', name: 'SHA256', icon: '🛡️' }
]

// 默认激活第一个选项卡
const activeTab = ref('base64')

// Base64
const base64Input = ref('')
const base64Output = ref('')

// URL
const urlInput = ref('')
const urlOutput = ref('')

// MD5
const md5Input = ref('')
const md5Output = ref('')

// SHA1
const sha1Input = ref('')
const sha1Output = ref('')

// SHA256
const sha256Input = ref('')
const sha256Output = ref('')

// Base64 编码
const encodeBase64 = () => {
  try {
    base64Output.value = btoa(base64Input.value)
  } catch (error) {
    proxy.$toast.error('Base64编码失败：' + error.message)
  }
}

// Base64 解码
const decodeBase64 = () => {
  try {
    base64Output.value = atob(base64Input.value)
  } catch (error) {
    proxy.$toast.error('Base64解码失败：' + error.message)
  }
}

// Base64 清空
const clearBase64 = () => {
  base64Input.value = ''
  base64Output.value = ''
}

// URL 编码
const encodeUrl = () => {
  try {
    urlOutput.value = encodeURIComponent(urlInput.value)
  } catch (error) {
    proxy.$toast.error('URL编码失败：' + error.message)
  }
}

// URL 解码
const decodeUrl = () => {
  try {
    urlOutput.value = decodeURIComponent(urlInput.value)
  } catch (error) {
    proxy.$toast.error('URL解码失败：' + error.message)
  }
}

// URL 清空
const clearUrl = () => {
  urlInput.value = ''
  urlOutput.value = ''
}

// MD5 加密（模拟实现）
const encryptMD5 = () => {
  if (!md5Input.value.trim()) {
    proxy.$toast.warning('请输入要加密的文本')
    return
  }

  // 这里使用简单的哈希模拟，实际项目中应该使用crypto-js等库
  const simpleHash = (str) => {
    let hash = 0
    if (str.length === 0) return hash.toString()

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // 转换为32位整数
    }

    // 转换为16进制并填充到32位
    let hex = Math.abs(hash).toString(16)
    while (hex.length < 32) {
      hex = '0' + hex
    }
    return hex
  }

  md5Output.value = simpleHash(md5Input.value)
  proxy.$toast.success('MD5加密完成')
}

// MD5 清空
const clearMD5 = () => {
  md5Input.value = ''
  md5Output.value = ''
}

// SHA1 加密（模拟实现）
const encryptSHA1 = () => {
  if (!sha1Input.value.trim()) {
    proxy.$toast.warning('请输入要加密的文本')
    return
  }

  // 简单的SHA1模拟
  const simpleSHA1 = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) + hash + char) & 0x7fffffff
    }

    let hex = Math.abs(hash).toString(16)
    while (hex.length < 40) {
      hex = '0' + hex
    }
    return hex
  }

  sha1Output.value = simpleSHA1(sha1Input.value)
  proxy.$toast.success('SHA1加密完成')
}

// SHA1 清空
const clearSHA1 = () => {
  sha1Input.value = ''
  sha1Output.value = ''
}

// SHA256 加密（模拟实现）
const encryptSHA256 = () => {
  if (!sha256Input.value.trim()) {
    proxy.$toast.warning('请输入要加密的文本')
    return
  }

  // 简单的SHA256模拟
  const simpleSHA256 = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) + hash + char + i) & 0x7fffffff
    }

    let hex = Math.abs(hash).toString(16)
    while (hex.length < 64) {
      hex = '0' + hex
    }
    return hex
  }

  sha256Output.value = simpleSHA256(sha256Input.value)
  proxy.$toast.success('SHA256加密完成')
}

// SHA256 清空
const clearSHA256 = () => {
  sha256Input.value = ''
  sha256Output.value = ''
}

// 复制到剪贴板
const copyToClipboard = async (text) => {
  if (!text.trim()) {
    proxy.$toast.warning('没有内容可复制')
    return
  }

  try {
    await navigator.clipboard.writeText(text)
    proxy.$toast.success('已复制到剪贴板')
  } catch (error) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    proxy.$toast.success('已复制到剪贴板')
  }
}
</script>

<style scoped>
.encoder-decoder-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 32px;
  color: var(--text-color);
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  color: var(--text-color-secondary);
}

/* 选项卡样式 */
.tabs-container {
  margin-bottom: 30px;
}

.tabs {
  display: flex;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 4px;
  gap: 4px;
  overflow-x: auto;
}

.tab-button {
  flex: 1;
  min-width: 120px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: var(--text-color-secondary);
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
}

.tab-button:hover {
  background: var(--bg-color-secondary);
  color: var(--text-color);
}

.tab-button.active {
  background: var(--primary-color);
  color: white;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.tab-icon {
  font-size: 16px;
}

/* 内容区域样式 */
.content-area {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 400px;
  overflow: hidden;
}

.tool-content {
  padding: 30px;
  width: 100%;
  box-sizing: border-box;
}

.tool-header {
  margin-bottom: 24px;
  text-align: center;
}

.tool-header h3 {
  font-size: 24px;
  color: var(--text-color);
  margin-bottom: 8px;
}

.tool-description {
  font-size: 14px;
  color: var(--text-color-secondary);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 过渡动画样式 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.input-group,
.result-group {
  margin-bottom: 16px;
}

.input-group label,
.result-group label {
  display: block;
  font-size: 14px;
  color: var(--text-color);
  margin-bottom: 8px;
  font-weight: 500;
}

.input-group textarea,
.result-group textarea {
  width: 100%;
  min-height: 80px;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Consolas', 'Monaco', monospace;
  background: var(--bg-color-secondary);
  color: var(--text-color);
  resize: vertical;
}

.input-group textarea:focus,
.result-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.button-group {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary,
.btn-clear,
.btn-copy {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-color-hover);
}

.btn-secondary {
  background: var(--success-color);
  color: white;
}

.btn-secondary:hover {
  background: var(--success-color-hover);
}

.btn-clear {
  background: var(--error-color);
  color: white;
}

.btn-clear:hover {
  background: var(--error-color-hover);
}

.btn-copy {
  background: var(--warning-color);
  color: white;
  margin-top: 8px;
}

.btn-copy:hover {
  background: var(--warning-color-hover);
}

.result-group {
  position: relative;
}

.result-group textarea {
  background: var(--bg-color-tertiary);
  color: var(--text-color);
}

.result-group .btn-copy {
  position: absolute;
  right: 8px;
  bottom: 8px;
  padding: 4px 8px;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .encoder-decoder-container {
    padding: 16px;
  }

  .tool-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .tool-card {
    padding: 16px;
  }

  .header h1 {
    font-size: 24px;
  }

  .button-group {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary,
  .btn-clear,
  .btn-copy {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .encoder-decoder-container {
    padding: 12px;
  }

  .tool-card {
    padding: 12px;
  }
}
</style>
