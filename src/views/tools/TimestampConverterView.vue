<template>
  <div class="timestamp-converter-container">
    <div class="header">
      <h1>⏰ 时间戳转换工具</h1>
      <p class="subtitle">轻松转换时间戳和日期时间格式</p>
    </div>

    <div class="converter-grid">
      <!-- 时间戳转时间 -->
      <div class="converter-card">
        <div class="card-header">
          <h3>🔢 时间戳转时间</h3>
          <p class="description">将Unix时间戳转换为可读的日期时间格式</p>
        </div>

        <div class="input-section">
          <div class="input-group">
            <label>时间戳</label>
            <input v-model="timestampInput" type="text" placeholder="请输入Unix时间戳..." class="timestamp-input" />
            <div class="format-selector">
              <label>
                <input type="radio" v-model="timestampFormat" value="seconds" />
                秒级
              </label>
              <label>
                <input type="radio" v-model="timestampFormat" value="milliseconds" />
                毫秒级
              </label>
            </div>
          </div>

          <div class="button-group">
            <button @click="convertTimestampToDate" class="btn-primary">转换</button>
            <button @click="useCurrentTimestamp" class="btn-secondary">使用当前时间</button>
            <button @click="clearTimestamp" class="btn-clear">清空</button>
          </div>

          <div class="result-section">
            <label>转换结果</label>
            <div class="result-display">
              <div class="result-item">
                <span class="label">北京时间:</span>
                <span class="value">{{ timestampToBeijing }}</span>
                <button @click="copyToClipboard(timestampToBeijing)" class="btn-copy">复制</button>
              </div>
              <div class="result-item">
                <span class="label">UTC时间:</span>
                <span class="value">{{ timestampToUTC }}</span>
                <button @click="copyToClipboard(timestampToUTC)" class="btn-copy">复制</button>
              </div>
              <div class="result-item">
                <span class="label">ISO格式:</span>
                <span class="value">{{ timestampToISO }}</span>
                <button @click="copyToClipboard(timestampToISO)" class="btn-copy">复制</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 时间转时间戳 -->
      <div class="converter-card">
        <div class="card-header">
          <h3>🕒 时间转时间戳</h3>
          <p class="description">将日期时间转换为Unix时间戳</p>
        </div>

        <div class="input-section">
          <div class="input-group">
            <label>日期时间</label>
            <input v-model="dateTimeInput" type="datetime-local" class="datetime-input" />
          </div>

          <div class="button-group">
            <button @click="convertDateToTimestamp" class="btn-primary">转换</button>
            <button @click="useCurrentDateTime" class="btn-secondary">使用当前时间</button>
            <button @click="clearDateTime" class="btn-clear">清空</button>
          </div>

          <div class="result-section">
            <label>转换结果</label>
            <div class="result-display">
              <div class="result-item">
                <span class="label">秒级时间戳:</span>
                <span class="value">{{ dateToTimestampSeconds }}</span>
                <button @click="copyToClipboard(dateToTimestampSeconds)" class="btn-copy">复制</button>
              </div>
              <div class="result-item">
                <span class="label">毫秒级时间戳:</span>
                <span class="value">{{ dateToTimestampMilliseconds }}</span>
                <button @click="copyToClipboard(dateToTimestampMilliseconds)" class="btn-copy">复制</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 批量转换 -->
      <div class="converter-card full-width">
        <div class="card-header">
          <h3>📊 批量转换</h3>
          <p class="description">批量转换时间戳或日期时间</p>
        </div>

        <div class="batch-section">
          <div class="batch-input">
            <label>批量输入（每行一个）</label>
            <textarea v-model="batchInput" placeholder="请输入时间戳或日期时间，每行一个..." rows="5" class="batch-textarea"></textarea>
          </div>

          <div class="batch-options">
            <label>
              <input type="radio" v-model="batchType" value="timestamp" />
              时间戳转时间
            </label>
            <label>
              <input type="radio" v-model="batchType" value="datetime" />
              时间转时间戳
            </label>
          </div>

          <div class="button-group">
            <button @click="batchConvert" class="btn-primary">批量转换</button>
            <button @click="clearBatch" class="btn-clear">清空</button>
          </div>

          <div class="result-section">
            <label>批量结果</label>
            <textarea v-model="batchOutput" readonly rows="5" class="batch-result"
              placeholder="转换结果将显示在这里..."></textarea>
            <button @click="copyToClipboard(batchOutput)" class="btn-copy">复制全部</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

// 输入数据
const timestampInput = ref('')
const timestampFormat = ref('seconds')
const dateTimeInput = ref('')
const batchInput = ref('')
const batchType = ref('timestamp')

// 计算结果
const timestampToBeijing = ref('')
const timestampToUTC = ref('')
const timestampToISO = ref('')
const dateToTimestampSeconds = ref('')
const dateToTimestampMilliseconds = ref('')
const batchOutput = ref('')

// 复制到剪贴板
const copyToClipboard = async (text) => {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    proxy.$toast.success('复制成功！')
  } catch (err) {
    proxy.$toast.error('复制失败：' + err.message)
  }
}

// 时间戳转时间
const convertTimestampToDate = () => {
  if (!timestampInput.value) {
    proxy.$toast.error('请输入时间戳')
    return
  }

  const timestamp = parseInt(timestampInput.value)
  if (isNaN(timestamp)) {
    proxy.$toast.error('请输入有效的时间戳')
    return
  }

  const multiplier = timestampFormat.value === 'milliseconds' ? 1 : 1000
  const date = new Date(timestamp * multiplier)

  if (isNaN(date.getTime())) {
    proxy.$toast.error('无效的时间戳')
    return
  }

  timestampToBeijing.value = date.toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  timestampToUTC.value = date.toLocaleString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  timestampToISO.value = date.toISOString()
}

// 使用当前时间戳
const useCurrentTimestamp = () => {
  const now = Date.now()
  timestampInput.value = timestampFormat.value === 'seconds'
    ? Math.floor(now / 1000).toString()
    : now.toString()
  convertTimestampToDate()
}

// 清空时间戳转换
const clearTimestamp = () => {
  timestampInput.value = ''
  timestampToBeijing.value = ''
  timestampToUTC.value = ''
  timestampToISO.value = ''
}

// 时间转时间戳
const convertDateToTimestamp = () => {
  if (!dateTimeInput.value) {
    proxy.$toast.error('请选择日期时间')
    return
  }

  const date = new Date(dateTimeInput.value)
  if (isNaN(date.getTime())) {
    proxy.$toast.error('无效的日期时间')
    return
  }

  dateToTimestampSeconds.value = Math.floor(date.getTime() / 1000).toString()
  dateToTimestampMilliseconds.value = date.getTime().toString()
}

// 使用当前日期时间
const useCurrentDateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  dateTimeInput.value = `${year}-${month}-${day}T${hours}:${minutes}`
  convertDateToTimestamp()
}

// 清空日期时间转换
const clearDateTime = () => {
  dateTimeInput.value = ''
  dateToTimestampSeconds.value = ''
  dateToTimestampMilliseconds.value = ''
}

// 批量转换
const batchConvert = () => {
  if (!batchInput.value.trim()) {
    proxy.$toast.error('请输入要转换的内容')
    return
  }

  const lines = batchInput.value.trim().split('\n').filter(line => line.trim())
  const results = []

  lines.forEach(line => {
    const trimmedLine = line.trim()
    if (!trimmedLine) return

    try {
      if (batchType.value === 'timestamp') {
        // 时间戳转时间
        const timestamp = parseInt(trimmedLine)
        if (!isNaN(timestamp)) {
          const multiplier = timestamp > 9999999999 ? 1 : 1000 // 自动判断是毫秒还是秒
          const date = new Date(timestamp * multiplier)
          if (!isNaN(date.getTime())) {
            const formatted = date.toLocaleString('zh-CN', {
              timeZone: 'Asia/Shanghai',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            })
            results.push(`${trimmedLine} → ${formatted}`)
          } else {
            results.push(`${trimmedLine} → 无效时间戳`)
          }
        } else {
          results.push(`${trimmedLine} → 无效时间戳`)
        }
      } else {
        // 时间转时间戳
        const date = new Date(trimmedLine)
        if (!isNaN(date.getTime())) {
          const timestamp = date.getTime()
          results.push(`${trimmedLine} → ${timestamp}`)
        } else {
          results.push(`${trimmedLine} → 无效日期时间`)
        }
      }
    } catch (error) {
      results.push(`${trimmedLine} → 转换失败`)
    }
  })

  batchOutput.value = results.join('\n')
}

// 清空批量转换
const clearBatch = () => {
  batchInput.value = ''
  batchOutput.value = ''
}
</script>

<style scoped>
.timestamp-converter-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 32px;
  color: var(--text-color);
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  color: var(--text-secondary-color);
}

.converter-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.converter-card {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.converter-card.full-width {
  grid-column: 1 / -1;
}

.card-header {
  margin-bottom: 20px;
}

.card-header h3 {
  font-size: 20px;
  color: var(--text-color);
  margin-bottom: 4px;
}

.description {
  font-size: 14px;
  color: var(--text-secondary-color);
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group label {
  display: block;
  font-size: 14px;
  color: var(--text-color);
  margin-bottom: 8px;
  font-weight: 500;
}

.timestamp-input,
.datetime-input,
.batch-textarea,
.batch-result {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Consolas', 'Monaco', monospace;
  background: var(--bg-color-secondary);
  color: var(--text-color);
  margin-top: 6px;
  outline: none;
}

.format-selector {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.format-selector label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  cursor: pointer;
}

.button-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary,
.btn-clear {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
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

.result-section {
  margin-top: 16px;
}

.result-section label {
  display: block;
  font-size: 14px;
  color: var(--text-color);
  margin-bottom: 8px;
  font-weight: 500;
}

.result-display {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--bg-color-tertiary);
  border-radius: 6px;
  font-family: 'Consolas', 'Monaco', monospace;
}

.result-item .label {
  font-size: 12px;
  color: var(--text-secondary-color);
  min-width: 80px;
}

.result-item .value {
  flex: 1;
  font-size: 14px;
  color: var(--text-color);
}

.btn-copy {
  padding: 4px 8px;
  font-size: 12px;
  background: var(--warning-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-copy:hover {
  background: var(--warning-color-hover);
}

.batch-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.batch-options {
  display: flex;
  gap: 16px;
}

.batch-options label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .converter-grid {
    grid-template-columns: 1fr;
  }

  .timestamp-converter-container {
    padding: 16px;
  }

  .button-group {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary,
  .btn-clear {
    width: 100%;
  }
}
</style>
