<template>
  <div class="s2work-parser-view">
    <div class="tool-header">
      <div class="header-content">
        <h1>S2Work入参解析工具</h1>
        <p>将S2Work的Base64编码+Url编码的入参解析成正常的JSON格式</p>
      </div>
      <button class="back-btn" @click="goBack">
        <span class="icon">←</span> 返回工具列表
      </button>
    </div>

    <div class="tool-container">
      <div class="input-section">
        <h2>输入参数</h2>
        <div class="input-area">
          <textarea v-model="inputText" placeholder="请输入S2Work的入参（Base64编码+Url编码）" class="input-textarea" rows="11"
            style="resize: none;"></textarea>
        </div>
        <div class="action-buttons">
          <button class="parse-btn" @click="parseInput" :disabled="!inputText">
            解析参数
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
        <h2>解析结果</h2>
        <div class="output-area">
          <div v-if="parsedResult" class="result-container">
            <CodeEditor v-model="parsedResult" language="json" readonly />
          </div>
          <div v-else-if="parseError" class="error-container">
            <div class="error-icon">⚠️</div>
            <div class="error-message">{{ parseError }}</div>
          </div>
          <div v-else class="empty-container">
            <div class="empty-icon">📄</div>
            <p>解析结果将在这里显示</p>
          </div>
        </div>
        <div class="output-actions" v-if="parsedResult">
          <button class="copy-btn" @click="copyResult">
            <span class="icon">📋</span> 复制结果
          </button>
          <button class="download-btn" @click="downloadResult">
            <span class="icon">💾</span> 下载为JSON文件
          </button>
          <button class="fullscreen-btn" @click="showFullscreen">
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
              <CodeEditor v-model="parsedResult" language="json" readonly minimap />
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
        <p>S2Work的入参是经过双重编码的：</p>
        <ol>
          <li>首先进行Url编码</li>
          <li>然后进行Base64编码</li>
        </ol>
        <p>本工具将按照相反的顺序进行解码：</p>
        <ol>
          <li>先进行Base64解码</li>
          <li>再进行Url解码</li>
        </ol>
        <p>解码后，工具会自动识别数据类型并进行格式化：</p>
        <ul style="margin-left: 16px;">
          <li><strong>JSON格式</strong>：自动格式化为易读的JSON结构</li>
          <li><strong>URL参数</strong>：转换为键值对的JSON对象</li>
          <li><strong>键值对</strong>：转换为JSON对象，自动识别数字和布尔值</li>
          <li><strong>逗号分隔值</strong>：转换为JSON数组</li>
          <li><strong>纯文本</strong>：包装为包含元信息的JSON对象</li>
        </ul>
        <p>无论原始数据是什么格式，工具都会尝试将其转换为最易读的形式展示。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue'
import CodeEditor from '../../components/CodeEditor.vue'

const { proxy } = getCurrentInstance()
const router = useRouter()
const inputText = ref('')
const parsedResult = ref('')
const parseError = ref('')
const showFullscreenModal = ref(false)

// 返回工具列表
const goBack = () => {
  router.push({ name: 'Tools' })
}

// 解析输入
const parseInput = () => {
  if (!inputText.value.trim()) {
    parseError.value = '请输入要解析的参数'
    return
  }

  try {
    parseError.value = ''

    // 第一步：Base64解码
    const base64Decoded = atob(inputText.value)

    // 第二步：Url解码
    const urlDecoded = decodeURIComponent(base64Decoded)

    // 尝试解析为JSON并格式化
    try {
      const jsonData = JSON.parse(urlDecoded)
      parsedResult.value = JSON.stringify(jsonData, null, 2)
      console.log(111);
    } catch (e) {
      // 如果不是JSON，尝试其他格式化方式
      parsedResult.value = formatNonJsonResult(urlDecoded)
    }
  } catch (error) {
    parseError.value = `解析失败: ${error.message}`
    parsedResult.value = ''
  }
}

// 格式化非JSON结果，提高可读性
const formatNonJsonResult = (text) => {
  // 尝试检测是否为URL编码的键值对
  if (text.includes('&') && text.includes('=')) {
    try {
      const params = new URLSearchParams(text)
      const result = {}
      for (const [key, value] of params.entries()) {
        result[key] = value
      }
      return JSON.stringify(result, null, 2)
    } catch (e) {
      // 如果URLSearchParams解析失败，继续其他处理
    }
  }

  // 尝试检测是否为逗号分隔的值
  if (text.includes(',') && !text.includes('{') && !text.includes('[')) {
    try {
      const values = text.split(',').map(v => v.trim())
      return JSON.stringify(values, null, 2)
    } catch (e) {
      // 如果CSV格式化失败，继续其他处理
    }
  }

  // 尝试检测是否为键值对（用冒号或等号分隔）
  if ((text.includes(':') || text.includes('=')) && !text.includes('{')) {
    try {
      const lines = text.split('\n')
      const result = {}

      for (const line of lines) {
        const trimmedLine = line.trim()
        if (!trimmedLine) continue

        // 尝试用冒号分隔
        let separator = ':'
        if (!trimmedLine.includes(':') && trimmedLine.includes('=')) {
          separator = '='
        }

        const parts = trimmedLine.split(separator)
        if (parts.length >= 2) {
          const key = parts[0].trim()
          const value = parts.slice(1).join(separator).trim()

          // 尝试将值转换为数字或布尔值
          let parsedValue = value
          if (value === 'true') parsedValue = true
          else if (value === 'false') parsedValue = false
          else if (!isNaN(value) && value !== '') parsedValue = Number(value)

          result[key] = parsedValue
        }
      }

      return JSON.stringify(result, null, 2)
    } catch (e) {
      // 如果键值对格式化失败，继续其他处理
    }
  }

  // 如果以上格式都不适用，尝试将文本放入JSON结构中
  return text
}

// 清空输入
const clearInput = () => {
  inputText.value = ''
  parsedResult.value = ''
  parseError.value = ''
}

// 加载示例
const loadExample = () => {
  // 示例类型：1-JSON, 2-URL参数, 3-键值对, 4-逗号分隔值
  const exampleType = Math.floor(Math.random() * 4) + 1
  let exampleData = ''

  switch (exampleType) {
    case 1: // JSON示例
      exampleData = JSON.stringify({
        name: "测试用户",
        age: 30,
        email: "test@example.com",
        preferences: {
          theme: "dark",
          language: "zh-CN"
        },
        active: true
      })
      break

    case 2: // URL参数示例
      exampleData = "id=123&name=测试用户&age=30&email=test%40example.com&active=true"
      break

    case 3: // 键值对示例
      exampleData = `id: 123
name: 测试用户
age: 30
email: test@example.com
theme: dark
active: true`
      break

    case 4: // 逗号分隔值示例
      exampleData = "123,测试用户,30,test@example.com,dark,true"
      break
  }

  // 先进行Url编码
  const urlEncoded = encodeURIComponent(exampleData)
  // 再进行Base64编码
  const base64Encoded = btoa(unescape(encodeURIComponent(urlEncoded)))

  inputText.value = base64Encoded
  parsedResult.value = ''
  parseError.value = ''
}

// 复制结果
const copyResult = () => {
  if (!parsedResult.value) return

  navigator.clipboard.writeText(parsedResult.value)
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
  if (!parsedResult.value) return
  const blob = new Blob([parsedResult.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const time = new Date().getTime()
  a.download = `S2Work_${time}.json`
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
.s2work-parser-view {
  padding: 20px;
  background: var(--background-color);
  max-width: 1000px;
  margin: 0 auto;

  .tool-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border-color);

    .header-content {
      h1 {
        color: var(--text-color);
        margin-bottom: 8px;
        font-size: 28px;
      }

      p {
        color: var(--text-secondary-color);
        font-size: 16px;
      }
    }

    .back-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: var(--card-background);
      color: var(--text-color);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;

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
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 30px;
    height: 350px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }

    .input-section,
    .output-section {
      height: 100%;
      background: var(--card-background);
      border-radius: 8px;
      border: 1px solid var(--border-color);
      padding: 20px;

      h2 {
        height: 39px;
        color: var(--text-color);
        margin: 0 0 16px 0;
        font-size: 20px;
      }

      .input-area,
      .output-area {
        height: 200px;
        margin-bottom: 16px;

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
      }

      .action-buttons,
      .output-actions {
        height: 39px;
        display: flex;
        gap: 12px;
        flex-wrap: wrap;

        button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .icon {
            font-size: 16px;
          }
        }

        .parse-btn {
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
          gap: 6px;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
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
