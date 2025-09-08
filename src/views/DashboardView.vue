<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div class="header-content">
        <h1>欢迎使用 Electron Tools</h1>
        <p>现代化的桌面应用工具集，提升您的工作效率</p>
      </div>
      <div class="header-actions">
        <button class="action-btn" @click="fetchSystemInfo">
          <span class="icon">🔄</span> 刷新数据
        </button>
      </div>
    </div>

    <!-- 系统监控卡片 -->
    <div class="section">
      <h2>系统监控</h2>
      <div class="system-monitor-grid">
        <div class="monitor-card cpu-card">
          <div class="card-header">
            <h3>CPU使用率</h3>
            <span class="card-icon">🖥️</span>
          </div>
          <div class="card-content">
            <div class="big-number" :class="getCpuClass()">
              {{ systemMetrics.cpu.usage }}%
            </div>
            <div class="card-details">
              <div class="detail-item">
                <span class="label">核心数:</span>
                <span class="value">{{ systemMetrics.cpu.cores || 0 }}</span>
              </div>
              <div class="detail-item">
                <span class="label">型号:</span>
                <span class="value">{{ systemMetrics.cpu.model || '未知' }}</span>
              </div>
            </div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: systemMetrics.cpu.usage + '%' }"></div>
          </div>
        </div>

        <div class="monitor-card memory-card">
          <div class="card-header">
            <h3>内存使用</h3>
            <span class="card-icon">🧠</span>
          </div>
          <div class="card-content">
            <div class="big-number" :class="getMemoryClass()">
              {{ systemMetrics.memory.usage }}%
            </div>
            <div class="card-details">
              <div class="detail-item">
                <span class="label">已用:</span>
                <span class="value">{{ formatBytes(systemMetrics.memory.used) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">总计:</span>
                <span class="value">{{ formatBytes(systemMetrics.memory.total) }}</span>
              </div>
            </div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: systemMetrics.memory.usage + '%' }"></div>
          </div>
        </div>

        <div class="monitor-card network-card">
          <div class="card-header">
            <h3>网络状态</h3>
            <span class="card-icon">🌐</span>
          </div>
          <div class="card-content">
            <div class="network-stats">
              <div class="network-item">
                <span class="label">▲ 上传:</span>
                <span class="value">{{ formatBytes(systemMetrics.network.uploadSpeed) }}/s</span>
              </div>
              <div class="network-item">
                <span class="label">▼ 下载:</span>
                <span class="value">{{ formatBytes(systemMetrics.network.downloadSpeed) }}/s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 系统信息卡片 -->
    <div class="section">
      <h2>系统信息</h2>
      <div class="system-info-grid">
        <div class="info-card">
          <div class="info-icon">🖥️</div>
          <div class="info-content">
            <h3>平台</h3>
            <p>{{ systemInfo.platform || '加载中...' }}</p>
          </div>
        </div>
        <div class="info-card">
          <div class="info-icon">🔧</div>
          <div class="info-content">
            <h3>架构</h3>
            <p>{{ systemInfo.arch || '加载中...' }}</p>
          </div>
        </div>
        <div class="info-card">
          <div class="info-icon">⚡</div>
          <div class="info-content">
            <h3>Electron</h3>
            <p>{{ systemInfo.electron || '加载中...' }}</p>
          </div>
        </div>
        <div class="info-card">
          <div class="info-icon">🟢</div>
          <div class="info-content">
            <h3>Node.js</h3>
            <p>{{ systemInfo.node || '加载中...' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 应用信息 -->
    <div class="section">
      <h2>应用信息</h2>
      <div class="app-info-grid">
        <StatCard title="应用版本" :value="appVersion" />
        <StatCard title="应用名称" :value="appName" />
        <StatCard title="应用环境" :value="isDev ? '开发模式' : '生产模式'" />
      </div>
    </div>

    <!-- 功能导航 -->
    <div class="section">
      <h2>功能导航</h2>
      <div class="feature-grid">
        <router-link to="/settings" class="feature-card">
          <div class="feature-icon">⚙️</div>
          <h3>系统设置</h3>
          <p>配置应用偏好和主题</p>
        </router-link>
        <div class="feature-card" @click="openFileExplorer">
          <div class="feature-icon">📁</div>
          <h3>文件管理</h3>
          <p>浏览和管理本地文件</p>
        </div>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="section">
      <div class="section-header">
        <h2>最近活动</h2>
        <button class="text-btn" @click="clearActivity">清除</button>
      </div>
      <div class="activity-list">
        <div v-if="recentActivities.length === 0" class="empty-state">
          <p>暂无活动记录</p>
        </div>
        <div v-else v-for="(activity, index) in recentActivities" :key="index" class="activity-item">
          <div class="activity-icon">{{ activity.icon }}</div>
          <div class="activity-content">
            <h4>{{ activity.title }}</h4>
            <p>{{ activity.description }}</p>
            <span class="activity-time">{{ formatTime(activity.timestamp) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import StatCard from '../components/StatCard.vue'
import pkg from '../../package.json'

const systemInfo = ref({})
const systemMetrics = ref({
  cpu: { usage: 0, cores: 0, model: '' },
  memory: { usage: 0, used: 0, total: 0 },
  network: { uploadSpeed: 0, downloadSpeed: 0 }
})
const recentActivities = ref([])
const isDev = ref(process.env.NODE_ENV === 'development')
const appVersion = ref(pkg.version)
const appName = ref(pkg.name || 'Electron Tools')

// 获取系统信息
const fetchSystemInfo = async () => {
  if (window.electronAPI) {
    try {
      systemInfo.value = await window.electronAPI.getSystemInfo()
    } catch (error) {
      console.error('获取系统信息失败:', error)
    }
  }
}

// 获取系统监控数据
const fetchSystemMetrics = async () => {
  try {
    const metrics = await window.electronAPI.getSystemMetrics()

    // 计算使用率并确保数据完整
    const memoryUsage = metrics.memory.total > 0 ?
      Math.round((metrics.memory.used / metrics.memory.total) * 100) : 0;

    systemMetrics.value = {
      cpu: {
        usage: metrics.cpu.usage || 0,
        cores: metrics.cpu.cores || 4,
        model: metrics.cpu.model || '未知'
      },
      memory: {
        usage: memoryUsage,
        used: metrics.memory.used || 0,
        total: metrics.memory.total || 0
      },
      network: {
        uploadSpeed: metrics.network?.uploadSpeed || 0,
        downloadSpeed: metrics.network?.downloadSpeed || 0
      }
    }
  } catch (error) {
    console.error('获取系统监控数据失败:', error)
  }
}

// 格式化字节
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 获取CSS类名
const getCpuClass = () => {
  const usage = systemMetrics.value.cpu.usage
  if (usage > 80) return 'critical'
  if (usage > 60) return 'warning'
  return 'normal'
}

const getMemoryClass = () => {
  const usage = systemMetrics.value.memory.usage
  if (usage > 90) return 'critical'
  if (usage > 70) return 'warning'
  return 'normal'
}

// 添加活动记录
const addActivity = (title, description, icon = '📝') => {
  recentActivities.value.unshift({
    title,
    description,
    icon,
    timestamp: new Date()
  })

  // 限制活动记录数量
  if (recentActivities.value.length > 5) {
    recentActivities.value = recentActivities.value.slice(0, 5)
  }
}

// 清除活动记录
const clearActivity = () => {
  recentActivities.value = []
}

// 打开文件浏览器
const openFileExplorer = async () => {
  if (window.electronAPI) {
    try {
      const result = await window.electronAPI.selectFile()
      if (result.success) {
        addActivity('文件', `已选择文件: ${result.filePath}`, '📁')
      }
    } catch (error) {
      console.error('打开文件浏览器失败:', error)
      addActivity('错误', '打开文件浏览器失败', '❌')
    }
  }
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins}分钟前`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}小时前`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}天前`
}

onMounted(async () => {
  await fetchSystemInfo()
  await fetchSystemMetrics()

  // 每5秒自动刷新监控数据
  setInterval(() => {
    fetchSystemMetrics()
  }, 5000)
})
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 20px;
  background: var(--background-color);
  max-width: 1200px;
  margin: 0 auto;

  .dashboard-header {
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

    .header-actions {
      .action-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: var(--secondary-color);
          transform: translateY(-2px);
        }

        .icon {
          font-size: 16px;
        }
      }
    }
  }

  .section {
    margin-bottom: 30px;

    h2 {
      color: var(--text-color);
      margin-bottom: 20px;
      font-size: 20px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .text-btn {
        background: none;
        border: none;
        color: var(--primary-color);
        cursor: pointer;
        font-size: 14px;
        padding: 5px 0;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .system-monitor-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;

      .monitor-card {
        background: var(--card-background);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 20px;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;

          h3 {
            margin: 0;
            color: var(--text-color);
            font-size: 16px;
          }

          .card-icon {
            font-size: 24px;
          }
        }

        .card-content {
          .big-number {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 12px;

            &.normal {
              color: var(--success-color, #28a745);
            }

            &.warning {
              color: var(--warning-color, #ffc107);
            }

            &.critical {
              color: var(--danger-color, #dc3545);
            }
          }

          .card-details {
            .detail-item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 4px;

              .label {
                color: var(--text-secondary-color);
                font-size: 14px;
                width: 50px;
                flex-shrink: 0;
              }

              .value {
                color: var(--text-color);
                font-weight: 500;
                text-align: right;
              }
            }
          }

          .network-stats {
            .network-item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;

              .label {
                color: var(--text-secondary-color);
                font-size: 14px;
              }

              .value {
                color: var(--text-color);
                font-weight: 500;
              }
            }
          }
        }

        .progress-bar {
          height: 6px;
          background: var(--border-color);
          border-radius: 3px;
          overflow: hidden;
          margin-top: auto;

          .progress-fill {
            height: 100%;
            background: var(--primary-color);
            transition: width 0.3s ease;
          }
        }
      }
    }

    .system-info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;

      .info-card {
        background: var(--card-background);
        border-radius: 8px;
        padding: 16px;
        border: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        gap: 12px;
        transition: all 0.2s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .info-icon {
          font-size: 24px;
        }

        .info-content {
          h3 {
            margin: 0 0 4px 0;
            color: var(--text-secondary-color);
            font-size: 14px;
            font-weight: normal;
          }

          p {
            margin: 0;
            color: var(--text-color);
            font-size: 16px;
            font-weight: bold;
          }
        }
      }
    }

    .app-info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;

      .feature-card {
        background: var(--card-background);
        border-radius: 8px;
        padding: 20px;
        border: 1px solid var(--border-color);
        cursor: pointer;
        transition: all 0.2s ease;
        text-decoration: none;
        color: var(--text-color);

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
          border-color: var(--primary-color);
        }

        .feature-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }

        h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
        }

        p {
          margin: 0;
          color: var(--text-secondary-color);
          font-size: 14px;
        }
      }
    }

    .activity-list {
      background: var(--card-background);
      border-radius: 8px;
      border: 1px solid var(--border-color);
      overflow: hidden;

      .empty-state {
        padding: 30px;
        text-align: center;
        color: var(--text-secondary-color);
      }

      .activity-item {
        display: flex;
        gap: 16px;
        padding: 16px;
        border-bottom: 1px solid var(--border-color);
        transition: background-color 0.2s ease;

        &:last-child {
          border-bottom: none;
        }

        &:hover {
          background: rgba(var(--primary-color-rgb), 0.05);
        }

        .activity-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;

          h4 {
            margin: 0 0 4px 0;
            color: var(--text-color);
            font-size: 16px;
          }

          p {
            margin: 0 0 8px 0;
            color: var(--text-secondary-color);
            font-size: 14px;
          }

          .activity-time {
            font-size: 12px;
            color: var(--text-secondary-color);
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .dashboard {
    .dashboard-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .section {

      .system-info-grid,
      .app-info-grid,
      .feature-grid {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>
