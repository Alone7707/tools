<template>
    <div class="button-demo">
        <h2>按钮组件演示</h2>

        <!-- 基础用法 -->
        <section class="demo-section">
            <h3>基础用法</h3>
            <div class="button-group">
                <BaseButton>默认按钮</BaseButton>
                <BaseButton type="primary">主要按钮</BaseButton>
                <BaseButton type="secondary">次要按钮</BaseButton>
                <BaseButton type="success">成功按钮</BaseButton>
                <BaseButton type="warning">警告按钮</BaseButton>
                <BaseButton type="danger">危险按钮</BaseButton>
                <BaseButton type="info">信息按钮</BaseButton>
            </div>
        </section>

        <!-- 朴素按钮 -->
        <section class="demo-section">
            <h3>朴素按钮</h3>
            <div class="button-group">
                <BaseButton plain>朴素按钮</BaseButton>
                <BaseButton type="primary" plain>主要按钮</BaseButton>
                <BaseButton type="secondary" plain>次要按钮</BaseButton>
                <BaseButton type="success" plain>成功按钮</BaseButton>
                <BaseButton type="warning" plain>警告按钮</BaseButton>
                <BaseButton type="danger" plain>危险按钮</BaseButton>
                <BaseButton type="info" plain>信息按钮</BaseButton>
            </div>
        </section>

        <!-- 文字按钮 -->
        <section class="demo-section">
            <h3>文字按钮</h3>
            <div class="button-group">
                <BaseButton type="text">文字按钮</BaseButton>
                <BaseButton type="link">链接按钮</BaseButton>
                <BaseButton type="text" disabled>禁用文字按钮</BaseButton>
            </div>
        </section>

        <!-- 不同尺寸 -->
        <section class="demo-section">
            <h3>不同尺寸</h3>
            <div class="button-group">
                <BaseButton type="primary" size="mini">迷你按钮</BaseButton>
                <BaseButton type="primary" size="small">小型按钮</BaseButton>
                <BaseButton type="primary" size="medium">中等按钮</BaseButton>
                <BaseButton type="primary" size="large">大型按钮</BaseButton>
            </div>
        </section>

        <!-- 特殊形状 -->
        <section class="demo-section">
            <h3>特殊形状</h3>
            <div class="button-group">
                <BaseButton type="primary" round>圆角按钮</BaseButton>
                <BaseButton type="primary" circle icon="⚙">圆形按钮</BaseButton>
                <BaseButton type="primary" circle icon="+" size="small"></BaseButton>
                <BaseButton type="danger" circle icon="×" size="mini"></BaseButton>
            </div>
        </section>

        <!-- 图标按钮 -->
        <section class="demo-section">
            <h3>图标按钮</h3>
            <div class="button-group">
                <BaseButton type="primary" icon="📝">编辑</BaseButton>
                <BaseButton type="danger" icon="🗑">删除</BaseButton>
                <BaseButton type="success" icon="✓">确定</BaseButton>
                <BaseButton type="warning" icon="⚠">警告</BaseButton>
                <BaseButton type="primary" icon="📁" icon-position="right">文件夹</BaseButton>
                <BaseButton type="primary" icon="⚙" circle></BaseButton>
            </div>
        </section>

        <!-- 加载状态 -->
        <section class="demo-section">
            <h3>加载状态</h3>
            <div class="button-group">
                <BaseButton type="primary" :loading="loading1" @click="handleLoad1">
                    {{ loading1 ? '加载中...' : '点击加载' }}
                </BaseButton>
                <BaseButton type="success" :loading="loading2" icon="💾" @click="handleLoad2">
                    {{ loading2 ? '保存中...' : '保存' }}
                </BaseButton>
                <BaseButton type="primary" :loading="true" circle></BaseButton>
            </div>
        </section>

        <!-- 禁用状态 -->
        <section class="demo-section">
            <h3>禁用状态</h3>
            <div class="button-group">
                <BaseButton disabled>默认按钮</BaseButton>
                <BaseButton type="primary" disabled>主要按钮</BaseButton>
                <BaseButton type="success" disabled plain>朴素按钮</BaseButton>
                <BaseButton type="text" disabled>文字按钮</BaseButton>
            </div>
        </section>

        <!-- 块级按钮 -->
        <section class="demo-section">
            <h3>块级按钮</h3>
            <div class="block-demo">
                <BaseButton type="primary" block>块级按钮</BaseButton>
                <BaseButton type="success" block icon="✓">确认提交</BaseButton>
            </div>
        </section>

        <!-- 按钮组 -->
        <section class="demo-section">
            <h3>按钮组</h3>
            <div class="button-group">
                <BaseButton type="primary">上一页</BaseButton>
                <BaseButton type="primary">下一页</BaseButton>
            </div>
            <br><br>
            <div class="button-group">
                <BaseButton type="primary" icon="⬅">后退</BaseButton>
                <BaseButton type="primary" icon="⬆">上传</BaseButton>
                <BaseButton type="primary" icon="➡">前进</BaseButton>
            </div>
        </section>

        <!-- 实际应用场景 -->
        <section class="demo-section">
            <h3>实际应用场景</h3>

            <!-- 表单操作 -->
            <div class="use-case">
                <h4>表单操作</h4>
                <div class="button-group">
                    <BaseButton type="primary" @click="handleSubmit">提交</BaseButton>
                    <BaseButton @click="handleReset">重置</BaseButton>
                    <BaseButton type="text" @click="handleCancel">取消</BaseButton>
                </div>
            </div>

            <!-- 数据操作 -->
            <div class="use-case">
                <h4>数据操作</h4>
                <div class="button-group">
                    <BaseButton type="primary" icon="+" size="small" @click="handleAdd">新增</BaseButton>
                    <BaseButton type="warning" icon="📝" size="small" @click="handleEdit">编辑</BaseButton>
                    <BaseButton type="danger" icon="🗑" size="small" @click="handleDelete">删除</BaseButton>
                    <BaseButton type="info" icon="👁" size="small" @click="handleView">查看</BaseButton>
                </div>
            </div>

            <!-- 页面导航 -->
            <div class="use-case">
                <h4>页面导航</h4>
                <div class="button-group">
                    <BaseButton type="text" icon="🏠" @click="handleHome">首页</BaseButton>
                    <BaseButton type="text" icon="⬅" @click="handleBack">返回</BaseButton>
                    <BaseButton type="primary" icon="💾" @click="handleSaveAndNext">保存并下一步</BaseButton>
                </div>
            </div>

            <!-- 工具栏 -->
            <div class="use-case">
                <h4>工具栏</h4>
                <div class="toolbar">
                    <BaseButton type="primary" size="small" icon="📁">打开</BaseButton>
                    <BaseButton size="small" icon="💾">保存</BaseButton>
                    <BaseButton size="small" icon="📋">复制</BaseButton>
                    <BaseButton size="small" icon="📄">粘贴</BaseButton>
                    <div class="divider"></div>
                    <BaseButton size="small" icon="↶">撤销</BaseButton>
                    <BaseButton size="small" icon="↷">重做</BaseButton>
                    <div class="divider"></div>
                    <BaseButton type="danger" size="small" icon="🗑">删除</BaseButton>
                </div>
            </div>
        </section>

        <!-- 事件测试 -->
        <section class="demo-section">
            <h3>事件测试</h3>
            <div class="button-group">
                <BaseButton type="primary" @click="showMessage('按钮被点击了！')">点击测试</BaseButton>
                <BaseButton type="success" @click="showMessage('成功按钮被点击！')">成功测试</BaseButton>
                <BaseButton type="warning" @click="showMessage('警告按钮被点击！')">警告测试</BaseButton>
            </div>
            <p v-if="message" class="message">{{ message }}</p>
        </section>

        <!-- Toast组件演示 -->
        <section class="demo-section">
            <h3>Toast组件演示</h3>
            
            <!-- 基本用法 -->
            <div class="toast-subsection">
                <h4>基本用法</h4>
                <div class="button-group">
                    <BaseButton type="success" @click="showSuccessToast">成功提示</BaseButton>
                    <BaseButton type="warning" @click="showWarningToast">警告提示</BaseButton>
                    <BaseButton type="danger" @click="showErrorToast">错误提示</BaseButton>
                    <BaseButton type="info" @click="showInfoToast">信息提示</BaseButton>
                </div>
            </div>
            

            
            <!-- 自定义选项 -->
            <div class="toast-subsection">
                <h4>自定义选项</h4>
                <div class="button-group">
                    <BaseButton @click="showCustomDurationToast">自定义时长</BaseButton>
                </div>
            </div>
            
            <!-- 队列测试 -->
            <div class="toast-subsection">
                <h4>队列测试</h4>
                <div class="button-group">
                    <BaseButton @click="showMultipleToasts">显示多个Toast</BaseButton>
                    <BaseButton @click="showSixToasts">测试超过5条限制</BaseButton>
                    <BaseButton @click="showTimedToasts">定时显示Toast</BaseButton>
                </div>
            </div>
            
            <!-- 编程式调用 -->
            <div class="toast-subsection">
                <h4>编程式调用</h4>
                <div class="code-example">
                    <pre><code>// 在组件中使用
import { getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

// 显示成功提示
proxy.$toast.success('操作成功')

// 显示错误提示
proxy.$toast.error('操作失败', {
  duration: 5000,
  position: 'bottom'
})

// 显示自定义提示
proxy.$toast.show('自定义消息', {
  type: 'warning',
  duration: 0, // 不自动关闭
  closeable: true,
  showIcon: true,
  position: 'middle'
})</code></pre>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const { proxy } = getCurrentInstance()

// 加载状态
const loading1 = ref(false)
const loading2 = ref(false)
const message = ref('')

// 加载测试
const handleLoad1 = () => {
    loading1.value = true
    setTimeout(() => {
        loading1.value = false
    }, 2000)
}

const handleLoad2 = () => {
    loading2.value = true
    setTimeout(() => {
        loading2.value = false
    }, 3000)
}

// 表单操作
const handleSubmit = () => {
    showMessage('表单提交成功！')
}

const handleReset = () => {
    showMessage('表单已重置')
}

const handleCancel = () => {
    showMessage('操作已取消')
}

// 数据操作
const handleAdd = () => {
    showMessage('新增操作')
}

const handleEdit = () => {
    showMessage('编辑操作')
}

const handleDelete = () => {
    if (confirm('确定要删除吗？')) {
        showMessage('删除成功')
    }
}

const handleView = () => {
    showMessage('查看详情')
}

// 导航操作
const handleHome = () => {
    showMessage('回到首页')
}

const handleBack = () => {
    showMessage('返回上一页')
}

const handleSaveAndNext = () => {
    showMessage('保存成功，即将跳转到下一步')
}

// 消息显示
const showMessage = (msg) => {
    message.value = msg
    setTimeout(() => {
        message.value = ''
    }, 3000)
}

// Toast演示方法
const showSuccessToast = () => {
  proxy.$toast.success('操作成功！')
}

const showWarningToast = () => {
  proxy.$toast.warning('请注意，这是一个警告信息')
}

const showErrorToast = () => {
  proxy.$toast.error('操作失败，请重试')
}

const showInfoToast = () => {
  proxy.$toast.info('这是一条普通信息')
}



// 自定义选项
const showCustomDurationToast = () => {
  proxy.$toast.success('5秒后自动关闭', { duration: 5000 })
}



// 队列测试方法
const showMultipleToasts = () => {
  proxy.$toast.success('第一条消息：操作成功！')
  setTimeout(() => {
    proxy.$toast.warning('第二条消息：请注意警告')
  }, 500)
  setTimeout(() => {
    proxy.$toast.error('第三条消息：发生错误')
  }, 1000)
  setTimeout(() => {
    proxy.$toast.info('第四条消息：这是一条信息')
  }, 1500)
}

const showSixToasts = () => {
  // 显示6条Toast，测试超过5条限制
  for (let i = 1; i <= 6; i++) {
    setTimeout(() => {
      const types = ['success', 'warning', 'error', 'info']
      const type = types[(i - 1) % types.length]
      proxy.$toast[type](`第${i}条消息：测试超过5条限制`)
    }, i * 300)
  }
}

const showTimedToasts = () => {
  // 显示不同时长的Toast，测试消失后其他Toast向上补位
  proxy.$toast.success('1秒后消失', { duration: 1000 })
  setTimeout(() => {
    proxy.$toast.warning('3秒后消失', { duration: 3000 })
  }, 500)
  setTimeout(() => {
    proxy.$toast.error('5秒后消失', { duration: 5000 })
  }, 1000)
  setTimeout(() => {
    proxy.$toast.info('2秒后消失', { duration: 2000 })
  }, 1500)
}
</script>

<style lang="scss" scoped>
.button-demo {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;

    h2 {
        color: var(--text-color);
        margin-bottom: 30px;
        text-align: center;
    }

    .demo-section {
        margin-bottom: 40px;
        padding: 24px;
        background: var(--card-background);
        border-radius: 8px;
        border: 1px solid var(--border-color);

        h3 {
            color: var(--text-color);
            margin-bottom: 24px;
            font-size: 18px;
            font-weight: 600;
            border-bottom: 2px solid var(--primary-color);
            padding-bottom: 8px;
        }

        h4 {
            color: var(--text-color);
            margin-bottom: 12px;
            font-size: 16px;
            font-weight: 500;
        }
    }

    .button-group {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;

        .base-button {
            margin: 0;
        }
    }

    .block-demo {
        .base-button {
            margin-bottom: 12px;

            &:last-child {
                margin-bottom: 0;
            }
        }
    }

    .use-case {
        margin-bottom: 24px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .toolbar {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        background: var(--input-background);
        border: 1px solid var(--border-color);
        border-radius: 4px;

        .divider {
            width: 1px;
            height: 20px;
            background: var(--border-color);
            margin: 0 4px;
        }

        .base-button {
            margin: 0;
        }
    }

    .message {
        margin-top: 16px;
        padding: 12px;
        background: rgba(var(--primary-color-rgb), 0.1);
        border-left: 4px solid var(--primary-color);
        color: var(--text-color);
        border-radius: 4px;
    }
    
    .toast-subsection {
        margin-bottom: 24px;
        
        &:last-child {
            margin-bottom: 0;
        }
        
        h4 {
            color: var(--text-color);
            margin-bottom: 16px;
            font-size: 16px;
            font-weight: 500;
        }
        
        .code-example {
            margin-top: 16px;
            padding: 16px;
            background-color: #f5f5f5;
            border-radius: 4px;
            overflow-x: auto;
            
            pre {
                margin: 0;
                font-family: 'Consolas', 'Monaco', monospace;
                font-size: 14px;
                line-height: 1.5;
                color: #333;
            }
            
            code {
                font-family: inherit;
            }
        }
    }
}

// 响应式设计
@media (max-width: 768px) {
    .button-demo {
        padding: 16px;

        .demo-section {
            padding: 16px;
        }

        .button-group {
            gap: 8px;
        }

        .toolbar {
            flex-wrap: wrap;
            gap: 6px;
        }
        
        .code-example {
            background-color: #2d2d2d;
            
            pre {
                color: #f1f1f1;
            }
        }
    }
}
</style>