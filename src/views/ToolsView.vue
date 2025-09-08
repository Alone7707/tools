<template>
  <div class="tools-view">
    <div class="tools-header">
      <div class="header-content">
        <h1>工具列表</h1>
        <p>探索和使用各种实用工具，提升您的工作效率</p>
      </div>
      <div class="header-actions">
        <div class="search-box">
          <input type="text" v-model="searchQuery" placeholder="搜索工具..." class="search-input" />
          <span class="search-icon">🔍</span>
        </div>
        <button class="action-btn" @click="refreshTools">
          <span class="icon">🔄</span> 刷新
        </button>
      </div>
    </div>

    <!-- 工具分类筛选 -->
    <div class="categories">
      <button v-for="category in categories" :key="category.id"
        :class="['category-btn', { active: selectedCategory === category.id }]" @click="selectCategory(category.id)">
        <span class="category-icon">{{ category.icon }}</span>
        {{ category.name }}
      </button>
    </div>

    <!-- 工具列表 -->
    <div class="tools-container">
      <div v-if="filteredTools.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>未找到匹配的工具</h3>
        <p>请尝试其他搜索词或选择不同的分类</p>
      </div>

      <div v-else class="tools-grid">
        <div v-for="tool in filteredTools" :key="tool.id" class="tool-card" @click="selectTool(tool)">
          <div class="tool-header">
            <div class="tool-icon">{{ tool.icon }}</div>
            <div class="tool-badge" v-if="tool.isNew">新</div>
          </div>
          <div class="tool-content">
            <h3>{{ tool.name }}</h3>
            <p>{{ tool.description }}</p>
          </div>
          <div class="tool-footer">
            <span class="tool-category">{{ getCategoryName(tool.category) }}</span>
            <span class="tool-rating">
              <span v-for="i in 5" :key="i" class="star">{{ i <= tool.rating ? '★' : '☆' }}</span>
              </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 工具详情弹窗 -->
    <div v-if="selectedToolDetail" class="tool-modal" @click.self="closeToolDetail">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">
            <span class="modal-icon">{{ selectedToolDetail.icon }}</span>
            <h2>{{ selectedToolDetail.name }}</h2>
          </div>
          <button class="close-btn" @click="closeToolDetail">✕</button>
        </div>

        <div class="modal-body">
          <div class="tool-info">
            <div class="info-item">
              <span class="info-label">分类：</span>
              <span class="info-value">{{ getCategoryName(selectedToolDetail.category) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">版本：</span>
              <span class="info-value">{{ selectedToolDetail.version }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">好用指数：</span>
              <span class="info-value">
                <span v-for="i in 5" :key="i" class="star">{{ i <= selectedToolDetail.rating ? '★' : '☆' }}</span>
                </span>
            </div>
          </div>

          <div class="tool-description">
            <h3>工具描述</h3>
            <p>{{ selectedToolDetail.fullDescription }}</p>
          </div>

          <div class="tool-features">
            <h3>主要功能</h3>
            <ul>
              <li v-for="(feature, index) in selectedToolDetail.features" :key="index">
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>

        <div class="modal-footer">
          <button class="secondary-btn" @click="closeToolDetail">取消</button>
          <button class="primary-btn" @click="launchTool(selectedToolDetail)">
            启动工具
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 工具分类
const categories = [
  { id: 'all', name: '全部', icon: '🔧' },
  { id: 'system', name: '系统工具', icon: '⚙️' },
  { id: 'development', name: '开发工具', icon: '💻' },
  { id: 'productivity', name: '效率工具', icon: '📊' },
  { id: 'multimedia', name: '多媒体', icon: '🎵' },
  { id: 'network', name: '网络工具', icon: '🌐' },
]

// 工具数据
const tools = [
  {
    id: 1,
    routerName: 'S2WorkParser',
    name: '入参解析',
    description: '把垃圾项目S2Work的入参解析成正常的入参。',
    icon: '📊',
    category: 'development',
    rating: 5,
    version: '1.0.0',
    isNew: true,
    fullDescription: '把垃圾项目S2Work的入参解析成正常的入参。S2Work的入参是Base64编码+Url编码的，需要先Base64解码再Url解码。',
    features: [
      'S2Work的入参解析',
      'Base64解码+Url解码',
      '格式化成JSON格式'
    ]
  },
  {
    id: 2,
    routerName: 'JsonFormatter',
    name: 'JSON格式化',
    description: '把JSON字符串格式化，方便阅读。',
    icon: '📝',
    category: 'productivity',
    rating: 5,
    version: '1.0.0',
    isNew: true,
    fullDescription: '把JSON字符串格式化，方便阅读。',
    features: [
      'JSON格式化',
      'JSON校验',
      'JSON压缩'
    ]
  },
  {
    id: 3,
    routerName: 'ImageCompressor',
    name: '图片压缩',
    description: '把图片压缩，方便上传。',
    icon: '🖼️',
    category: 'multimedia',
    rating: 5,
    version: '1.0.0',
    isNew: true,
    fullDescription: '把图片体积压缩，方便上传。',
    features: [
      '图片压缩',
      '图片上传'
    ]
  },
  {
    id: 4,
    routerName: 'EncoderDecoder',
    name: '加解密编码',
    description: '加解密编码工具',
    icon: '🔐',
    category: 'development',
    rating: 5,
    version: '1.0.0',
    isNew: true,
    fullDescription: '加解密编码工具',
    features: [
      '加解密',
      '支持Base64、Url、MD5、SHA1、SHA256编码/解码',
    ]
  },
  {
    id: 5,
    routerName: 'TimestampConverter',
    name: '时间戳转换',
    description: '时间戳转换工具',
    icon: '🕒',
    category: 'development',
    rating: 5,
    version: '1.0.0',
    isNew: true,
    fullDescription: '时间戳转换工具',
    features: [
      '时间戳转换',
      '支持时间戳到时间的转换',
      '支持时间到时间戳的转换'
    ]
  },
  {
    id: 6,
    routerName: 'CronGenerator',
    name: 'Cron生成器',
    description: 'Cron表达式生成器',
    icon: '🕒',
    category: 'development',
    rating: 5,
    version: '1.0.0',
    isNew: true,
    fullDescription: 'Cron表达式生成器',
    features: [
      'Cron表达式生成',
      '支持Cron表达式的生成',
      '支持Cron表达式的校验'
    ]
  }
]

// 路由
const router = useRouter()

// 状态管理
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedToolDetail = ref(null)

// 根据搜索和分类筛选工具
const filteredTools = computed(() => {
  let result = tools

  // 按分类筛选
  if (selectedCategory.value !== 'all') {
    result = result.filter(tool => tool.category === selectedCategory.value)
  }

  // 按搜索词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(tool =>
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query)
    )
  }

  return result
})

// 选择分类
const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
}

// 选择工具查看详情
const selectTool = (tool) => {
  selectedToolDetail.value = tool
}

// 关闭工具详情
const closeToolDetail = () => {
  selectedToolDetail.value = null
}

// 启动工具
const launchTool = (tool) => {
  // 根据工具ID导航到相应的工具页面
  if (tool.routerName) {
    // S2Work入参解析工具
    router.push({ name: tool.routerName })
  } else {
    // 其他工具暂时使用提示框
    alert(`正在启动工具: ${tool.name}`)
  }
  closeToolDetail()
}

// 刷新工具列表
const refreshTools = () => {
  // 这里可以添加刷新工具列表的逻辑
  searchQuery.value = ''
  selectedCategory.value = 'all'
}

// 获取分类名称
const getCategoryName = (categoryId) => {
  const category = categories.find(c => c.id === categoryId)
  return category ? category.name : '未分类'
}

// 组件挂载时的初始化
onMounted(() => {
  // 可以在这里添加初始化逻辑，比如从API获取工具列表
})
</script>

<style lang="scss" scoped>
.tools-view {
  padding: 20px;
  background: var(--background-color);
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;

  .tools-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
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
      display: flex;
      gap: 16px;
      align-items: center;

      .search-box {
        position: relative;

        .search-input {
          padding: 10px 16px 10px 40px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          background: var(--card-background);
          color: var(--text-color);
          width: 250px;
          font-size: 14px;
          transition: all 0.2s ease;

          &:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
          }
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary-color);
        }
      }

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

  .categories {
    display: flex;
    gap: 12px;
    margin-bottom: 15px;
    overflow-x: auto;
    padding: 10px 0;

    .category-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: var(--card-background);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      font-size: 14px;
      color: var(--text-color);
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--primary-color);
        transform: translateY(-2px);
      }

      &.active {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
      }

      .category-icon {
        font-size: 16px;
      }
    }
  }

  .tools-container {
    height: 100%;
    overflow: hidden;
    overflow-y: auto;

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;

      .empty-icon {
        font-size: 48px;
        margin-bottom: 16px;
        color: var(--text-secondary-color);
      }

      h3 {
        color: var(--text-color);
        margin-bottom: 8px;
      }

      p {
        color: var(--text-secondary-color);
      }
    }

    .tools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 14px;

      .tool-card {
        background: var(--card-background);
        border-radius: 8px;
        border: 1px solid var(--border-color);
        margin: 6px;
        padding: 20px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
          border-color: var(--primary-color);
        }

        .tool-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;

          .tool-icon {
            font-size: 32px;
          }

          .tool-badge {
            background: var(--primary-color);
            color: white;
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 12px;
          }
        }

        .tool-content {
          flex: 1;
          margin-bottom: 16px;

          h3 {
            color: var(--text-color);
            margin: 0 0 8px 0;
            font-size: 18px;
          }

          p {
            color: var(--text-secondary-color);
            margin: 0;
            font-size: 14px;
            line-height: 1.4;
          }
        }

        .tool-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;

          .tool-category {
            color: var(--text-secondary-color);
          }

          .tool-rating {
            color: #ffc107;

            .star {
              font-size: 14px;
            }
          }
        }
      }
    }
  }

  .tool-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;

    .modal-content {
      background: var(--card-background);
      border-radius: 12px;
      max-width: 600px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid var(--border-color);

        .modal-title {
          display: flex;
          align-items: center;
          gap: 12px;

          .modal-icon {
            font-size: 28px;
          }

          h2 {
            color: var(--text-color);
            margin: 0;
            font-size: 24px;
          }
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 20px;
          color: var(--text-secondary-color);
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;

          &:hover {
            background: rgba(0, 0, 0, 0.1);
            color: var(--text-color);
          }
        }
      }

      .modal-body {
        padding: 20px;

        .tool-info {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;

          .info-item {
            .info-label {
              color: var(--text-secondary-color);
              font-size: 14px;
              display: block;
              margin-bottom: 4px;
            }

            .info-value {
              color: var(--text-color);
              font-weight: bold;

              .star {
                color: #ffc107;
                font-size: 14px;
              }
            }
          }
        }

        .tool-description {
          margin-bottom: 24px;

          h3 {
            color: var(--text-color);
            margin: 0 0 12px 0;
            font-size: 18px;
          }

          p {
            color: var(--text-color);
            margin: 0;
            line-height: 1.6;
          }
        }

        .tool-features {
          h3 {
            color: var(--text-color);
            margin: 0 0 12px 0;
            font-size: 18px;
          }

          ul {
            margin: 0;
            padding-left: 20px;
            color: var(--text-color);
            line-height: 1.6;

            li {
              margin-bottom: 6px;
            }
          }
        }
      }

      .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 16px 20px;
        border-top: 1px solid var(--border-color);

        .secondary-btn,
        .primary-btn {
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .secondary-btn {
          background: var(--card-background);
          color: var(--text-color);
          border: 1px solid var(--border-color);

          &:hover {
            background: rgba(0, 0, 0, 0.05);
          }
        }

        .primary-btn {
          background: var(--primary-color);
          color: white;

          &:hover {
            background: var(--secondary-color);
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .tools-view {
    .tools-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;

      .header-actions {
        width: 100%;
        flex-direction: column;
        gap: 12px;

        .search-box {
          width: 100%;

          .search-input {
            width: 100%;
          }
        }

        .action-btn {
          width: 100%;
          justify-content: center;
        }
      }
    }

    .categories {
      padding-bottom: 8px;
    }

    .tools-container {
      .tools-grid {
        grid-template-columns: 1fr;
      }
    }

    .tool-modal {
      .modal-content {
        .modal-body {
          .tool-info {
            grid-template-columns: 1fr;
          }
        }
      }
    }
  }
}
</style>
