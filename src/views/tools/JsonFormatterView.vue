<template>
  <div class="json-formatter-view">
    <div class="tool-header">
      <div class="header-content">
        <h1>JSON格式化工具</h1>
        <p>格式化、压缩和验证JSON数据</p>
      </div>
      <button class="back-btn" @click="goBack">
        <span class="icon">←</span> 返回工具列表
      </button>
    </div>

    <div class="tool-container">
      <div class="input-section">
        <h2>输入JSON</h2>
        <div class="input-area">
          <textarea v-model="inputText" placeholder="请输入要格式化的JSON数据" class="input-textarea" rows="11"
            style="resize: none;"></textarea>
        </div>
        <div class="action-buttons">
          <button class="format-btn" @click="formatJson" :disabled="!inputText">
            格式化
          </button>
          <button class="compress-btn" @click="compressJson" :disabled="!inputText">
            压缩
          </button>
          <button class="validate-btn" @click="validateJson" :disabled="!inputText">
            验证
          </button>
          <button class="clear-btn" @click="clearInput">
            清空
          </button>
          <button class="example-btn" @click="loadExample">
            <span class="icon">📝</span> 加载示例
          </button>
        </div>
      </div>

      <div class="output-section">
        <h2>格式化结果</h2>
        <div class="output-area">
          <div v-if="formattedResult" class="result-container">
            <code-editor v-model="formattedResult" language="json" readonly />
          </div>
          <div v-else-if="formatError" class="error-container">
            <div class="error-icon">⚠️</div>
            <div class="error-message">{{ formatError }}</div>
          </div>
          <div v-else-if="isValidated !== null" class="validation-container"
            :class="{ 'valid': isValidated, 'invalid': !isValidated }">
            <div class="validation-icon">{{ isValidated ? '✅' : '❌' }}</div>
            <div class="validation-message">
              {{ isValidated ? 'JSON格式有效' : 'JSON格式无效' }}
              <div v-if="!isValidated && validationMessage" class="error-detail">{{ validationMessage }}</div>
            </div>
          </div>
          <div v-else class="empty-container">
            <div class="empty-icon">📄</div>
            <p>格式化结果将在这里显示</p>
          </div>
        </div>
        <div class="output-actions" v-if="formattedResult || isValidated !== null">
          <button class="copy-btn" @click="copyResult">
            <span class="icon">📋</span> 复制结果
          </button>
          <button class="download-btn" @click="downloadResult" v-if="formattedResult">
            <span class="icon">💾</span> 下载为JSON文件
          </button>
          <button class="fullscreen-btn" @click="showFullscreen" v-if="formattedResult">
            <span class="icon">🔍</span> 全屏展示
          </button>
        </div>

        <!-- 全屏展示模态框 -->
        <div v-if="showFullscreenModal" class="fullscreen-modal" @click.self="closeFullscreen">
          <div class="fullscreen-content">
            <div class="fullscreen-header">
              <h3>解析结果 - 全屏展示</h3>
              <button class="close-btn" @click="closeFullscreen">✕</button>
            </div>
            <div class="fullscreen-body">
              <code-editor v-model="formattedResult" language="json" readonly minimap />
            </div>
            <div class="fullscreen-footer">
              <button class="copy-btn" @click="copyResult">
                <span class="icon">📋</span> 复制结果
              </button>
              <button class="download-btn" @click="downloadResult">
                <span class="icon">💾</span> 下载为JSON文件
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="tool-info">
      <h2>工具说明</h2>
      <div class="info-content">
        <h3>JSON格式化工具</h3>
        <p>本工具用于格式化、压缩和验证JSON数据，使其更易读和更规范。</p>
        <p>使用步骤：</p>
        <ol>
          <li>在输入框中粘贴JSON数据</li>
          <li>点击"格式化"按钮进行格式化，或点击"压缩"按钮进行压缩</li>
          <li>点击"验证"按钮检查JSON格式是否正确</li>
          <li>在右侧查看处理后的结果</li>
          <li>可以复制结果、下载为JSON文件或全屏查看</li>
        </ol>
        <p>功能说明：</p>
        <ul>
          <li><strong>格式化</strong>：将JSON数据格式化为易读的缩进格式</li>
          <li><strong>压缩</strong>：移除JSON中的所有空白字符，生成最小化的JSON</li>
          <li><strong>验证</strong>：检查JSON格式是否正确，并显示错误信息</li>
        </ul>
      </div>
    </div>

    <!-- 全屏模态框 -->
    <div v-if="showFullscreenModal" class="fullscreen-modal" @click.self="closeFullscreen">
      <div class="fullscreen-content">
        <div class="fullscreen-header">
          <h3>格式化结果</h3>
          <button class="close-btn" @click="closeFullscreen">✕</button>
        </div>
        <div class="fullscreen-body">
          <code-editor v-model="formattedResult" language="json" minimap readonly />
        </div>
        <div class="fullscreen-footer">
          <button class="copy-btn" @click="copyResult">
            <span class="icon">📋</span> 复制结果
          </button>
          <button class="download-btn" @click="downloadResult">
            <span class="icon">💾</span> 下载为json文件
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import CodeEditor from '../../components/CodeEditor.vue'

const { proxy } = getCurrentInstance()
const router = useRouter()
const inputText = ref('')
const formattedResult = ref('')
const formatError = ref('')
const isValidated = ref(null)
const validationMessage = ref('')
const showFullscreenModal = ref(false)

// 返回工具列表
const goBack = () => {
  router.push({ name: 'Tools' })
}

// 格式化JSON
const formatJson = () => {
  if (!inputText.value.trim()) {
    formatError.value = '请输入要格式化的JSON'
    return
  }

  formatError.value = ''
  formattedResult.value = ''
  isValidated.value = null
  validationMessage.value = ''

  try {
    const jsonData = JSON.parse(inputText.value)
    formattedResult.value = JSON.stringify(jsonData, null, 2)
    isValidated.value = true
  } catch (error) {
    formatError.value = `格式化失败: ${error instanceof Error ? error.message : '未知错误'}`
    isValidated.value = false
    validationMessage.value = error instanceof Error ? error.message : '未知错误'
  }
}

// 压缩JSON
const compressJson = () => {
  if (!inputText.value.trim()) {
    formatError.value = '请输入要压缩的JSON'
    return
  }

  formatError.value = ''
  formattedResult.value = ''
  isValidated.value = null
  validationMessage.value = ''

  try {
    const jsonData = JSON.parse(inputText.value)
    formattedResult.value = JSON.stringify(jsonData)
    isValidated.value = true
  } catch (error) {
    formatError.value = `压缩失败: ${error instanceof Error ? error.message : '未知错误'}`
    isValidated.value = false
    validationMessage.value = error instanceof Error ? error.message : '未知错误'
  }
}

// 验证JSON
const validateJson = () => {
  if (!inputText.value.trim()) {
    formatError.value = '请输入要验证的JSON'
    return
  }

  formatError.value = ''
  formattedResult.value = ''
  validationMessage.value = ''

  try {
    JSON.parse(inputText.value)
    isValidated.value = true
  } catch (error) {
    isValidated.value = false
    validationMessage.value = error instanceof Error ? error.message : '未知错误'
  }
}

// 清空输入
const clearInput = () => {
  inputText.value = ''
  formattedResult.value = ''
  formatError.value = ''
  isValidated.value = null
  validationMessage.value = ''
}

// 加载示例
const loadExample = () => {
  // 示例：未格式化的JSON
  const example = '{"userId":"12345","username":"alice","age":28,"isActive":true,"preferences":["coding","reading","gaming"],"address":{"street":"123 Main St","city":"New York","zip":"10001"}}'
  inputText.value = example
  formatJson()
}

// 复制结果
const copyResult = () => {
  const textToCopy = formattedResult.value || inputText.value
  if (!textToCopy) return

  navigator.clipboard.writeText(textToCopy)
    .then(() => {
      proxy.$toast.success('结果已复制到剪贴板！')
    })
    .catch(err => {
      console.error('复制失败:', err)
      proxy.$toast.error('复制失败，请手动复制')
    })
}

// 下载结果
const downloadResult = () => {
  const textToDownload = formattedResult.value || inputText.value
  if (!textToDownload) return

  const blob = new Blob([textToDownload], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const time = new Date().getTime()
  a.download = `formatted_${time}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 显示全屏
const showFullscreen = () => {
  showFullscreenModal.value = true
  // 防止背景滚动
  document.body.style.overflow = 'hidden'
}

// 关闭全屏
const closeFullscreen = () => {
  showFullscreenModal.value = false
  // 恢复背景滚动
  document.body.style.overflow = ''
}
</script>

<style lang="scss" scoped>
.json-formatter-view {
  padding: 16px;
  background: var(--background-color);
  max-width: 100%;
  margin: 0;
  min-height: 100vh;
  box-sizing: border-box;

  .tool-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border-color);

    .header-content {
      h1 {
        color: var(--text-color);
        margin-bottom: 6px;
        font-size: 22px;
      }

      p {
        color: var(--text-secondary-color);
        font-size: 14px;
        margin: 0;
      }
    }

    .back-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background: var(--card-background);
      color: var(--text-color);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;

      &:hover {
        background: rgba(0, 0, 0, 0.05);
        transform: translateY(-2px);
      }

      .icon {
        font-size: 16px;
      }
    }
  }

  .tool-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 20px;


    .input-section,
    .output-section {
      background: var(--card-background);
      border-radius: 8px;
      border: 1px solid var(--border-color);
      padding: 16px;

      h2 {
        color: var(--text-color);
        margin: 0 0 12px 0;
        font-size: 18px;
      }

      .input-area,
      .output-area {
        height: 150px;
        margin-bottom: 12px;

        .input-textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          background: var(--background-color);
          color: var(--text-color);
          font-family: 'Courier New', monospace;
          font-size: 14px;
          resize: vertical;
          transition: all 0.2s ease;

          &:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
          }
        }

        .result-container {
          height: 100%;
        }

        .error-container {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(244, 67, 54, 0.1);
          border: 1px solid rgba(244, 67, 54, 0.3);
          border-radius: 6px;
          color: #f44336;

          .error-icon {
            font-size: 24px;
          }

          .error-message {
            font-size: 14px;
          }
        }

        .empty-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 20px;
          color: var(--text-secondary-color);
          border: 1px dashed var(--border-color);
          border-radius: 6px;

          .empty-icon {
            font-size: 32px;
            margin-bottom: 12px;
          }

          p {
            margin: 0;
            font-size: 14px;
          }
        }

        .validation-container {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          border-radius: 6px;

          &.valid {
            background: rgba(76, 175, 80, 0.1);
            border: 1px solid rgba(76, 175, 80, 0.3);
            color: #4caf50;
          }

          &.invalid {
            background: rgba(244, 67, 54, 0.1);
            border: 1px solid rgba(244, 67, 54, 0.3);
            color: #f44336;
          }

          .validation-icon {
            font-size: 24px;
            margin-top: 2px;
          }

          .validation-message {
            font-size: 14px;

            .error-detail {
              margin-top: 8px;
              font-size: 12px;
              opacity: 0.8;
            }
          }
        }
      }

      .action-buttons,
      .output-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;

        button {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          white-space: nowrap;

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .icon {
            font-size: 16px;
          }
        }

        .format-btn {
          background: var(--primary-color);
          color: white;

          &:hover:not(:disabled) {
            background: var(--secondary-color);
          }
        }

        .compress-btn {
          background: var(--primary-color);
          color: white;

          &:hover:not(:disabled) {
            background: var(--secondary-color);
          }
        }

        .validate-btn {
          background: var(--primary-color);
          color: white;

          &:hover:not(:disabled) {
            background: var(--secondary-color);
          }
        }

        .clear-btn {
          background: var(--card-background);
          color: var(--text-color);
          border: 1px solid var(--border-color);

          &:hover:not(:disabled) {
            background: rgba(0, 0, 0, 0.05);
          }
        }

        .example-btn {
          background: var(--card-background);
          color: var(--text-color);
          border: 1px solid var(--border-color);

          &:hover:not(:disabled) {
            background: rgba(0, 0, 0, 0.05);
          }
        }

        .copy-btn,
        .download-btn,
        .fullscreen-btn {
          background: var(--card-background);
          color: var(--text-color);
          border: 1px solid var(--border-color);

          &:hover {
            background: rgba(0, 0, 0, 0.05);
          }
        }
      }
    }
  }

  .tool-info {
    background: var(--card-background);
    border-radius: 8px;
    border: 1px solid var(--border-color);
    padding: 20px;

    h2 {
      color: var(--text-color);
      margin: 0 0 16px 0;
      font-size: 20px;
    }

    .info-content {
      color: var(--text-color);
      line-height: 1.6;

      p {
        margin: 0 0 12px 0;
      }

      ol {
        margin: 0 0 16px 0;
        padding-left: 20px;

        li {
          margin-bottom: 6px;
        }
      }
    }
  }

  // 全屏模态框样式
  .fullscreen-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;

    .fullscreen-content {
      width: 90%;
      height: 90%;
      background: var(--card-background);
      border-radius: 8px;
      border: 1px solid var(--border-color);
      overflow: hidden;

      .fullscreen-header {
        height: 70px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid var(--border-color);

        h3 {
          margin: 0;
          color: var(--text-color);
          font-size: 18px;
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--text-secondary-color);
          font-size: 20px;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;

          &:hover {
            background: rgba(0, 0, 0, 0.1);
            color: var(--text-color);
          }
        }
      }

      .fullscreen-body {
        height: calc(100% - 140px);
        padding: 20px;
      }

      .fullscreen-footer {
        height: 70px;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 16px 20px;
        border-top: 1px solid var(--border-color);

        button {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          white-space: nowrap;
          background: var(--card-background);
          color: var(--text-color);
          border: 1px solid var(--border-color);

          &:hover {
            background: rgba(0, 0, 0, 0.05);
          }

          .icon {
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>
