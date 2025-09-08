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
                <span class="info-value">{{ compressionRatio }}</span>
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
import { ref, computed, onUnmounted } from 'vue'

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

const compressImage = async () => {
  if (!selectedImage.value) return

  isCompressing.value = true
  
  try {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      let { width, height } = img

      // 计算缩放比例
      if (maintainAspectRatio.value) {
        const aspectRatio = width / height
        if (width > maxWidth.value || height > maxHeight.value) {
          if (width / maxWidth.value > height / maxHeight.value) {
            width = maxWidth.value
            height = width / aspectRatio
          } else {
            height = maxHeight.value
            width = height * aspectRatio
          }
        }
      } else {
        width = Math.min(width, maxWidth.value)
        height = Math.min(height, maxHeight.value)
      }

      canvas.width = width
      canvas.height = height

      // 绘制压缩后的图片
      ctx.drawImage(img, 0, 0, width, height)

      // 转换为Blob
      canvas.toBlob((blob) => {
        compressedFileSize.value = blob.size
        compressedImage.value = URL.createObjectURL(blob)
        isCompressing.value = false
      }, `image/${outputFormat.value}`, quality.value)
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

  const link = document.createElement('a')
  link.href = compressedImage.value
  link.download = `compressed_${selectedImage.value.name}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 清理
onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  if (compressedImage.value) {
    URL.revokeObjectURL(compressedImage.value)
  }
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