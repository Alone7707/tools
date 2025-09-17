<template>
  <div class="dashboard">
    <div class="welcome-section">
      <div class="welcome-card">
        <div class="welcome-icon">⚡</div>
        <div class="welcome-content">
          <h2>小工具集</h2>
          <p>快速、轻量的桌面工具</p>
        </div>
      </div>
    </div>

    <!-- 快捷工具 -->
    <div class="quick-tools">
      <h3>快捷工具</h3>
      <div class="tools-grid">
        <router-link to="/tools/timestamp" class="tool-card">
          <div class="tool-icon">🕒</div>
          <span>时间戳转换</span>
        </router-link>
        <router-link to="/tools/encoder-decoder" class="tool-card">
          <div class="tool-icon">🔐</div>
          <span>编码解码</span>
        </router-link>
        <router-link to="/tools/json-formatter" class="tool-card">
          <div class="tool-icon">📄</div>
          <span>JSON格式化</span>
        </router-link>
        <router-link to="/tools/cron-generator" class="tool-card">
          <div class="tool-icon">⏰</div>
          <span>Cron表达式</span>
        </router-link>
      </div>
    </div>

    <!-- 系统信息 -->
    <div class="system-info">
      <h3>系统状态</h3>
      <div class="info-grid">
        <div class="info-card">
          <div class="info-icon">🖥️</div>
          <div class="info-content">
            <div class="info-value">{{ systemMetrics.cpu.usage }}%</div>
            <div class="info-label">CPU使用率</div>
          </div>
        </div>

        <div class="info-card">
          <div class="info-icon">🧠</div>
          <div class="info-content">
            <div class="info-value">{{ systemMetrics.memory.usagePercent }}%</div>
            <div class="info-label">内存使用</div>
          </div>
        </div>

        <div class="info-card">
          <div class="info-icon">📡</div>
          <div class="info-content">
            <div class="info-value">{{ formatNetworkSpeed(systemMetrics.network.uploadSpeed) }}</div>
            <div class="info-label">上传速度</div>
          </div>
        </div>

        <div class="info-card">
          <div class="info-icon">📥</div>
          <div class="info-content">
            <div class="info-value">{{ formatNetworkSpeed(systemMetrics.network.downloadSpeed) }}</div>
            <div class="info-label">下载速度</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 系统指标数据
const systemMetrics = ref({
  cpu: {
    usage: 0,
    cores: 0,
    model: ''
  },
  memory: {
    total: 0,
    used: 0,
    usagePercent: 0
  },
  network: {
    uploadSpeed: 0,
    downloadSpeed: 0
  }
})

// 定时器变量
let interval = null

// 格式化字节数
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 格式化网络速度
const formatNetworkSpeed = (bytesPerSecond) => {
  if (bytesPerSecond === 0) return '0 B/s'
  const k = 1024
  const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s']
  const i = Math.floor(Math.log(bytesPerSecond) / Math.log(k))
  return parseFloat((bytesPerSecond / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// 获取系统信息
const fetchSystemInfo = async () => {
  try {
    // 尝试获取真实的系统信息
    if (window.electronAPI && window.electronAPI.getSystemMetrics) {
      const info = await window.electronAPI.getSystemMetrics()

      // 直接使用后端计算的网络速度
      const uploadSpeed = info.network?.uploadSpeed || 0
      const downloadSpeed = info.network?.downloadSpeed || 0

      systemMetrics.value = {
        cpu: {
          usage: Math.round(info.cpu?.usage || 0),
          cores: info.cpu?.cores || 0,
          model: info.cpu?.model || '未知'
        },
        memory: {
          total: info.memory?.total || 0,
          used: info.memory?.used || 0,
          usagePercent: Math.round(((info.memory?.used || 0) / (info.memory?.total || 1)) * 100)
        },
        network: {
          uploadSpeed,
          downloadSpeed
        }
      }
    } else {
      // 如果没有 electronAPI，使用模拟数据
      generateMockData()
    }
  } catch (error) {
    console.error('获取系统信息失败:', error)
    // 出错时使用模拟数据
    generateMockData()
  }
}

// 生成模拟数据（用于开发和测试）
const generateMockData = () => {
  systemMetrics.value = {
    cpu: {
      usage: Math.round(Math.random() * 30 + 10), // 10-40% 随机CPU使用率
      cores: 8,
      model: 'Intel Core i7'
    },
    memory: {
      total: 16 * 1024 * 1024 * 1024, // 16GB
      used: Math.round(Math.random() * 8 * 1024 * 1024 * 1024 + 4 * 1024 * 1024 * 1024), // 4-12GB
      usagePercent: Math.round(Math.random() * 50 + 25) // 25-75%
    },
    network: {
      uploadSpeed: Math.random() * 1024 * 1024, // 0-1MB/s
      downloadSpeed: Math.random() * 5 * 1024 * 1024 // 0-5MB/s
    }
  }
}

onMounted(() => {
  fetchSystemInfo()
  // 每2秒更新一次系统指标，让变化更明显
  interval = setInterval(() => {
    fetchSystemInfo()
  }, 2000)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>

<style lang="scss" scoped>
.dashboard {
  max-width: 800px;
  margin: 0 auto;

  .welcome-section {
    margin-bottom: 12px;

    .welcome-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px 24px;
      background: var(--card-background);
      border-radius: 8px;
      border: 1px solid var(--border-color);

      .welcome-icon {
        font-size: 32px;
        flex-shrink: 0;
      }

      .welcome-content {
        flex: 1;

        h2 {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-color);
          margin-bottom: 4px;
        }

        p {
          color: var(--text-secondary-color);
          font-size: 13px;
          margin: 0;
        }
      }
    }
  }

  .quick-tools {
    margin-bottom: 16px;

    h3 {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-color);
      margin-bottom: 16px;
    }

    .tools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;

      .tool-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 16px;
        background: var(--card-background);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        text-decoration: none;
        color: var(--text-color);
        transition: all 0.2s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: var(--primary-color);
        }

        .tool-icon {
          font-size: 28px;
          margin-bottom: 8px;
        }

        span {
          font-size: 12px;
          text-align: center;
          font-weight: 500;
        }
      }
    }
  }

  .system-info {
    h3 {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-color);
      margin-bottom: 16px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;

      .info-card {
        display: flex;
        align-items: center;
        padding: 16px;
        background: var(--card-background);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        gap: 12px;

        .info-icon {
          font-size: 24px;
        }

        .info-content {
          .info-value {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-color);
            line-height: 1.2;
          }

          .info-label {
            font-size: 11px;
            color: var(--text-secondary-color);
            margin-top: 2px;
          }
        }
      }
    }
  }
}
</style>