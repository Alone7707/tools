<template>
  <div class="image-compressor">
    <div class="compressor-header">
      <h1>图片压缩工具</h1>
      <p>智能压缩图片体积，保持高质量，方便快速上传</p>
    </div>

    <div class="compressor-content">
      <!-- 上传区域 -->
      <div class="upload-section" v-if="!selectedImage">
        <div class="upload-area" @drop="handleDrop" @dragover="handleDragOver" @dragleave="handleDragLeave"
          :class="{ 'drag-over': isDragging }">
          <div class="upload-icon">📁</div>
          <h3>拖拽图片到此处</h3>
          <p>或点击选择图片</p>
          <input type="file" ref="fileInput" @change="handleFileSelect" accept="image/*" class="file-input" />
          <button class="upload-btn" @click="triggerFileInput">选择图片</button>
        </div>
      </div>

      <!-- 压缩设置 -->
      <div class="settings-section" v-if="selectedImage">
        <div class="preview-section">
          <h3>图片预览</h3>
          <div class="image-preview">
            <img :src="previewUrl" alt="预览图片" class="preview-image" />
            <div class="image-info">
              <div class="info-item">
                <span class="info-label">原始大小:</span>
                <span class="info-value">{{ originalSize }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">压缩后大小:</span>
                <span class="info-value">{{ compressedSize }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">压缩率:</span>
                <span class="info-value" :class="compressionStatusClass">{{ compressionRatio }}</span>
              </div>
              <div class="info-item" v-if="compressionAdvice">
                <span class="info-label">建议:</span>
                <span class="info-advice">{{ compressionAdvice }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="compression-settings">
          <h3>压缩设置</h3>
          <div class="setting-group">
            <label>图片质量:</label>
            <div class="quality-slider">
              <input type="range" v-model="quality" min="0.1" max="1" step="0.1" class="slider" />
              <span class="quality-value">{{ Math.round(quality * 100) }}%</span>
            </div>
          </div>

          <div class="setting-group">
            <label>最大宽度:</label>
            <div class="dimension-input">
              <input type="number" v-model="maxWidth" min="100" max="4000" class="input-field" />
              <span class="unit">px</span>
            </div>
          </div>

          <div class="setting-group">
            <label>最大高度:</label>
            <div class="dimension-input">
              <input type="number" v-model="maxHeight" min="100" max="4000" class="input-field" />
              <span class="unit">px</span>
            </div>
          </div>

          <div class="setting-group">
            <label>输出格式:</label>
            <select v-model="outputFormat" class="select-field">
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>

          <div class="setting-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="maintainAspectRatio" class="checkbox" />
              保持宽高比
            </label>
          </div>

          <div class="setting-group">
            <label>智能预设:</label>
            <div class="preset-buttons">
              <button @click="applyPreset('web')" class="preset-btn" type="button">网页优化</button>
              <button @click="applyPreset('social')" class="preset-btn" type="button">社交媒体</button>
              <button @click="applyPreset('email')" class="preset-btn" type="button">邮件附件</button>
              <button @click="applyPreset('print')" class="preset-btn" type="button">打印质量</button>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button class="secondary-btn" @click="resetImage">重新选择</button>
          <button class="primary-btn" @click="compressImage" :disabled="isCompressing">
            {{ isCompressing ? '压缩中...' : '开始压缩' }}
          </button>
          <button v-if="compressedImage" class="download-btn" @click="downloadImage">
            下载图片
          </button>
        </div>
      </div>
    </div>

    <!-- 压缩结果 -->
    <div class="result-section" v-if="compressedImage">
      <h3>压缩结果</h3>
      <div class="result-comparison">
        <div class="comparison-item">
          <h4>原始图片</h4>
          <img :src="previewUrl" alt="原始图片" class="comparison-image" />
        </div>
        <div class="comparison-item">
          <h4>压缩后图片</h4>
          <img :src="compressedImage" alt="压缩后图片" class="comparison-image" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()
// 状态管理
const selectedImage = ref(null)
const previewUrl = ref('')
const compressedImage = ref('')
const originalFileSize = ref(0)
const compressedFileSize = ref(0)
const isDragging = ref(false)
const isCompressing = ref(false)

// 压缩设置
const quality = ref(0.8)
const maxWidth = ref(1920)
const maxHeight = ref(1080)
const outputFormat = ref('jpeg')
const maintainAspectRatio = ref(true)

// 文件输入引用
const fileInput = ref(null)

// 计算属性
const originalSize = computed(() => {
  return formatFileSize(originalFileSize.value)
})

const compressedSize = computed(() => {
  return compressedFileSize.value > 0 ? formatFileSize(compressedFileSize.value) : '-'
})

const compressionRatio = computed(() => {
  if (compressedFileSize.value > 0 && originalFileSize.value > 0) {
    const ratio = ((1 - compressedFileSize.value / originalFileSize.value) * 100).toFixed(1)
    return `${ratio}%`
  }
  return '-'
})

const compressionStatusClass = computed(() => {
  if (compressedFileSize.value === 0 || originalFileSize.value === 0) return ''

  const ratio = (1 - compressedFileSize.value / originalFileSize.value) * 100

  if (ratio < 0) return 'negative-compression'  // 负优化
  if (ratio < 5) return 'poor-compression'      // 压缩效果差
  if (ratio < 20) return 'fair-compression'     // 一般
  if (ratio < 50) return 'good-compression'     // 良好
  return 'excellent-compression'                // 优秀
})

const compressionAdvice = computed(() => {
  if (compressedFileSize.value === 0 || originalFileSize.value === 0) return ''

  const ratio = (1 - compressedFileSize.value / originalFileSize.value) * 100
  const originalSizeKB = originalFileSize.value / 1024

  if (ratio < 0) {
    return '图片已被优化，无需进一步压缩'
  }
  if (ratio < 5) {
    if (originalSizeKB < 100) {
      return '小图片压缩效果有限，建议直接使用原图'
    }
    return '尝试降低质量或缩小尺寸'
  }
  if (ratio < 20) {
    return '可尝试调整输出格式或降低质量'
  }
  return '压缩效果良好'
})

// 工具函数
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 文件处理
const triggerFileInput = () => {
  // 通知主进程更新窗口行为
  if (window.electronAPI) {
    window.electronAPI.setPinWindow(true)
  }
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    processImage(file)
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragging.value = false

  const files = event.dataTransfer.files
  if (files.length > 0 && files[0].type.startsWith('image/')) {
    processImage(files[0])
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (event) => {
  event.preventDefault()
  isDragging.value = false
}

const processImage = (file) => {
  // 通知主进程更新窗口行为
  if (window.electronAPI) {
    window.electronAPI.setPinWindow(false)
  }
  selectedImage.value = file
  originalFileSize.value = file.size
  previewUrl.value = URL.createObjectURL(file)
  compressedImage.value = ''
  compressedFileSize.value = 0
}

const resetImage = () => {
  selectedImage.value = null
  previewUrl.value = ''
  compressedImage.value = ''
  originalFileSize.value = 0
  compressedFileSize.value = 0
  quality.value = 0.8
  maxWidth.value = 1920
  maxHeight.value = 1080
  outputFormat.value = 'jpeg'
  maintainAspectRatio.value = true
}

// 智能预设功能
const applyPreset = (presetType) => {
  const originalSizeKB = selectedImage.value ? selectedImage.value.size / 1024 : 0

  switch (presetType) {
    case 'web':
      // 网页优化：平衡质量和加载速度
      quality.value = 0.8
      maxWidth.value = 1920
      maxHeight.value = 1080
      outputFormat.value = 'webp'
      break

    case 'social':
      // 社交媒体：适合上传到社交平台
      quality.value = 0.75
      maxWidth.value = 1200
      maxHeight.value = 1200
      outputFormat.value = 'jpeg'
      break

    case 'email':
      // 邮件附件：大幅减小文件大小
      quality.value = 0.6
      maxWidth.value = 800
      maxHeight.value = 600
      outputFormat.value = 'jpeg'
      break

    case 'print':
      // 打印质量：保持高质量，适度压缩
      quality.value = 0.9
      maxWidth.value = 3000
      maxHeight.value = 3000
      outputFormat.value = originalSizeKB < 500 ? 'png' : 'jpeg'
      break
  }

  maintainAspectRatio.value = true
}

const compressImage = async () => {
  if (!selectedImage.value) return

  isCompressing.value = true

  try {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      let { width, height } = img
      const originalWidth = width
      const originalHeight = height

      // 检查是否需要缩放
      let needsResize = false
      if (maintainAspectRatio.value) {
        const aspectRatio = width / height
        if (width > maxWidth.value || height > maxHeight.value) {
          needsResize = true
          if (width / maxWidth.value > height / maxHeight.value) {
            width = maxWidth.value
            height = width / aspectRatio
          } else {
            height = maxHeight.value
            width = height * aspectRatio
          }
        }
      } else {
        if (width > maxWidth.value || height > maxHeight.value) {
          needsResize = true
          width = Math.min(width, maxWidth.value)
          height = Math.min(height, maxHeight.value)
        }
      }

      // 智能质量调整：小图片或已经很小的图片使用更高质量
      let adaptiveQuality = quality.value
      const originalFileSize = selectedImage.value.size

      // 如果原图很小（< 100KB），提高质量避免负优化
      if (originalFileSize < 100 * 1024) {
        adaptiveQuality = Math.max(adaptiveQuality, 0.9)
      }

      // 如果没有缩放且质量很低，可能导致负优化
      if (!needsResize && adaptiveQuality < 0.7) {
        adaptiveQuality = Math.max(adaptiveQuality, 0.8)
      }

      canvas.width = width
      canvas.height = height

      // 使用高质量绘制
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, width, height)

      // 尝试多种压缩策略
      const tryCompression = (format, qualityLevel) => {
        return new Promise((resolve) => {
          canvas.toBlob((blob) => {
            resolve({
              blob,
              size: blob.size,
              format,
              quality: qualityLevel
            })
          }, `image/${format}`, qualityLevel)
        })
      }

      // 并行尝试多种压缩方案
      const compressionTasks = []

      // 当前设置的压缩方案
      compressionTasks.push(tryCompression(outputFormat.value, adaptiveQuality))

      // 如果原图是PNG且要转换为JPEG，也尝试保持PNG格式
      if (selectedImage.value.type === 'image/png' && outputFormat.value === 'jpeg') {
        compressionTasks.push(tryCompression('png', Math.min(adaptiveQuality + 0.1, 1.0)))
      }

      // 尝试WebP格式（通常压缩率更好）
      if (outputFormat.value !== 'webp') {
        compressionTasks.push(tryCompression('webp', adaptiveQuality))
      }

      // 如果质量设置较低，也尝试稍高的质量
      if (adaptiveQuality < 0.9) {
        compressionTasks.push(tryCompression(outputFormat.value, Math.min(adaptiveQuality + 0.2, 1.0)))
      }

      Promise.all(compressionTasks).then(results => {
        // 找出最优的压缩结果
        let bestResult = results[0]

        for (const result of results) {
          // 选择文件大小最小的结果
          if (result.size < bestResult.size) {
            bestResult = result
          }
        }

        // 检查是否发生了负优化
        const compressionRatio = (originalFileSize - bestResult.size) / originalFileSize

        if (bestResult.size >= originalFileSize * 0.95) {
          // 如果压缩后大小超过原图的95%，认为是负优化
          console.warn('检测到负优化，使用原图')

          // 使用原图
          compressedFileSize.value = originalFileSize
          compressedImage.value = previewUrl.value

          // 提示用户
          setTimeout(() => {
            alert('检测到压缩效果不佳，已自动使用原图。建议调整压缩参数或直接使用原图。')
          }, 100)
        } else {
          // 使用最优压缩结果
          compressedFileSize.value = bestResult.size
          compressedImage.value = URL.createObjectURL(bestResult.blob)

          // 如果使用了不同于用户设置的格式，提示用户
          if (bestResult.format !== outputFormat.value) {
            setTimeout(() => {
              const formatNames = { jpeg: 'JPEG', png: 'PNG', webp: 'WebP' }
              // alert(`为获得最佳压缩效果，自动选择了${formatNames[bestResult.format]}格式`)
              proxy.$toast.success(`为获得最佳压缩效果，自动选择了${formatNames[bestResult.format]}格式`)
            }, 100)
          }
        }

        isCompressing.value = false
      }).catch(error => {
        console.error('压缩优化失败:', error)
        // 降级到原始压缩方案
        canvas.toBlob((blob) => {
          if (blob.size >= originalFileSize * 0.95) {
            // 负优化，使用原图
            compressedFileSize.value = originalFileSize
            compressedImage.value = previewUrl.value
            alert('压缩效果不佳，已使用原图')
          } else {
            compressedFileSize.value = blob.size
            compressedImage.value = URL.createObjectURL(blob)
          }
          isCompressing.value = false
        }, `image/${outputFormat.value}`, adaptiveQuality)
      })
    }

    img.src = previewUrl.value
  } catch (error) {
    console.error('压缩失败:', error)
    isCompressing.value = false
    alert('图片压缩失败，请重试')
  }
}

const downloadImage = () => {
  if (!compressedImage.value) return

  // 通知主进程更新窗口行为 - 固定窗口防止消失
  if (window.electronAPI) {
    window.electronAPI.setPinWindow(true)
  }

  // 设置下载完成监听器
  setupDownloadListener()

  const link = document.createElement('a')
  link.href = compressedImage.value
  link.download = `compressed_${selectedImage.value.name}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 下载监听器相关变量
let downloadTimeoutId = null
let focusListenerAdded = false

// 焦点处理函数（需要在外部定义以便移除监听器）
let handleWindowFocus = null

// 设置下载完成监听
const setupDownloadListener = () => {
  // 清除之前的监听器和定时器
  cleanupDownloadListener()

  // 方法1: 监听窗口重新获得焦点（用户关闭了下载对话框）
  handleWindowFocus = () => {
    console.log('窗口重新获得焦点，可能下载已完成或取消')

    // 延迟一点时间再取消固定，确保下载对话框完全关闭
    setTimeout(() => {
      if (window.electronAPI) {
        window.electronAPI.setPinWindow(false)
        console.log('已取消窗口固定')
      }
      cleanupDownloadListener()
    }, 500)
  }

  // 添加焦点监听器
  if (!focusListenerAdded) {
    window.addEventListener('focus', handleWindowFocus)
    focusListenerAdded = true
    console.log('已添加下载完成监听器')
  }

  // 方法2: 设置超时备份（防止焦点事件失效）
  downloadTimeoutId = setTimeout(() => {
    console.log('下载超时，自动取消窗口固定')
    if (window.electronAPI) {
      window.electronAPI.setPinWindow(false)
    }
    cleanupDownloadListener()
  }, 30000) // 30秒超时
}

// 清理下载监听器
const cleanupDownloadListener = () => {
  // 清除超时定时器
  if (downloadTimeoutId) {
    clearTimeout(downloadTimeoutId)
    downloadTimeoutId = null
  }

  // 移除焦点监听器
  if (focusListenerAdded && handleWindowFocus) {
    window.removeEventListener('focus', handleWindowFocus)
    focusListenerAdded = false
    handleWindowFocus = null
    console.log('已清理下载监听器')
  }
}

// 清理
onUnmounted(() => {
  // 清理图片URL
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  if (compressedImage.value) {
    URL.revokeObjectURL(compressedImage.value)
  }

  // 清理下载监听器
  cleanupDownloadListener()
})
</script>

<style lang="scss" scoped>
.image-compressor {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  .compressor-header {
    text-align: center;
    margin-bottom: 30px;

    h1 {
      color: var(--text-color);
      margin-bottom: 8px;
    }

    p {
      color: var(--text-secondary-color);
    }
  }

  .compressor-content {
    background: var(--card-background);
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .upload-section {
    .upload-area {
      border: 2px dashed var(--border-color);
      border-radius: 12px;
      padding: 40px;
      text-align: center;
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        border-color: var(--primary-color);
        background: rgba(var(--primary-color-rgb), 0.05);
      }

      &.drag-over {
        border-color: var(--primary-color);
        background: rgba(var(--primary-color-rgb), 0.1);
      }

      .upload-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }

      h3 {
        color: var(--text-color);
        margin-bottom: 8px;
      }

      p {
        color: var(--text-secondary-color);
        margin-bottom: 16px;
      }

      .file-input {
        display: none;
      }

      .upload-btn {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;

        &:hover {
          background: var(--secondary-color);
        }
      }
    }
  }

  .settings-section {
    .preview-section {
      margin-bottom: 24px;

      h3 {
        color: var(--text-color);
        margin-bottom: 16px;
      }

      .image-preview {
        display: flex;
        gap: 24px;
        align-items: flex-start;

        .preview-image {
          max-width: 300px;
          max-height: 200px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .image-info {
          flex: 1;

          .info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 8px 0;
            border-bottom: 1px solid var(--border-color);

            .info-label {
              color: var(--text-secondary-color);
            }

            .info-value {
              color: var(--text-color);
              font-weight: bold;

              &.negative-compression {
                color: #ff4757;
              }

              &.poor-compression {
                color: #ffa502;
              }

              &.fair-compression {
                color: #2f3640;
              }

              &.good-compression {
                color: #2ed573;
              }

              &.excellent-compression {
                color: #5352ed;
              }
            }

            .info-advice {
              color: var(--primary-color);
              font-size: 12px;
              font-style: italic;
            }
          }
        }
      }
    }

    .compression-settings {
      margin-bottom: 24px;

      h3 {
        color: var(--text-color);
        margin-bottom: 16px;
      }

      .setting-group {
        margin-bottom: 16px;

        label {
          display: block;
          color: var(--text-color);
          margin-bottom: 8px;
          font-weight: bold;
        }

        .quality-slider {
          display: flex;
          align-items: center;
          gap: 12px;

          .slider {
            flex: 1;
            height: 4px;
            border-radius: 2px;
            background: var(--border-color);
            outline: none;
            -webkit-appearance: none;

            &::-webkit-slider-thumb {
              -webkit-appearance: none;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: var(--primary-color);
              cursor: pointer;
            }
          }

          .quality-value {
            color: var(--text-color);
            font-weight: bold;
            min-width: 40px;
          }
        }

        .dimension-input {
          display: flex;
          align-items: center;
          gap: 8px;

          .input-field {
            padding: 8px;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            background: var(--input-background);
            color: var(--text-color);
            width: 100px;
          }

          .unit {
            color: var(--text-secondary-color);
          }
        }

        .select-field {
          padding: 8px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background: var(--input-background);
          color: var(--text-color);
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;

          .checkbox {
            width: 16px;
            height: 16px;
          }
        }

        .preset-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;

          .preset-btn {
            padding: 6px 12px;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            background: var(--card-background);
            color: var(--text-color);
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;

            &:hover {
              background: var(--primary-color);
              color: white;
              border-color: var(--primary-color);
            }
          }
        }
      }
    }

    .action-buttons {
      display: flex;
      gap: 12px;
      justify-content: flex-end;

      button {
        padding: 12px 24px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;

        &.secondary-btn {
          background: var(--card-background);
          color: var(--text-color);
          border: 1px solid var(--border-color);

          &:hover {
            background: rgba(0, 0, 0, 0.05);
          }
        }

        &.primary-btn {
          background: var(--primary-color);
          color: white;

          &:hover:not(:disabled) {
            background: var(--secondary-color);
          }

          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        }

        &.download-btn {
          background: #4CAF50;
          color: white;

          &:hover {
            background: #45a049;
          }
        }

        &.cancel-pin-btn {
          background: #ff9500;
          color: white;
          font-size: 12px;
          padding: 8px 16px;

          &:hover {
            background: #e8860a;
          }
        }
      }
    }
  }

  .result-section {
    margin-top: 24px;

    h3 {
      color: var(--text-color);
      margin-bottom: 16px;
    }

    .result-comparison {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;

      .comparison-item {
        text-align: center;

        h4 {
          color: var(--text-color);
          margin-bottom: 12px;
        }

        .comparison-image {
          max-width: 100%;
          max-height: 300px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }
      }
    }
  }

  @media (max-width: 768px) {
    .image-preview {
      flex-direction: column !important;

      .preview-image {
        max-width: 100% !important;
      }
    }

    .result-comparison {
      grid-template-columns: 1fr !important;
    }
  }
}
</style>