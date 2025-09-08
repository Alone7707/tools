<template>
  <div class="loading-demo">
    <h2>Loading 组件演示</h2>

    <div class="demo-section">
      <h3>1. 组件方式使用</h3>
      <div class="demo-box">
        <Loading text="组件方式加载中..." size="medium" color="#409eff" />
      </div>
    </div>

    <div class="demo-section">
      <h3>2. 全局方法使用</h3>
      <div class="demo-controls">
        <button @click="showGlobalLoading">显示 Loading</button>
        <button @click="hideGlobalLoading">隐藏 Loading</button>
      </div>
    </div>

    <div class="demo-section">
      <h3>3. 不同尺寸</h3>
      <div class="demo-box">
        <Loading text="小尺寸" size="small" color="#67c23a" />
      </div>
      <div class="demo-box">
        <Loading text="中尺寸" size="medium" color="#409eff" />
      </div>
      <div class="demo-box">
        <Loading text="大尺寸" size="large" color="#e6a23c" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
import Loading from '@/components/Loading.vue'

const { proxy } = getCurrentInstance()

// 显示全局loading
const showGlobalLoading = () => {
  proxy.$loading.show('全局方法调用中...')
  setTimeout(() => {
    proxy.$loading.hide()
  }, 3000);
}

// 隐藏全局loading
const hideGlobalLoading = () => {
  proxy.$loading.hide()
}
</script>

<style lang="scss" scoped>
.loading-demo {
  padding: 20px;

  h2 {
    margin-bottom: 20px;
    color: #333;
  }

  h3 {
    margin-bottom: 15px;
    color: #666;
    font-size: 16px;
  }

  .demo-section {
    margin-bottom: 30px;
  }

  .demo-box {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 150px;
    border: 1px dashed #ddd;
    border-radius: 4px;
    margin-bottom: 15px;
    position: relative;
  }

  .demo-controls {
    display: flex;
    gap: 10px;

    button {
      padding: 8px 16px;
      background-color: #409eff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #66b1ff;
      }

      &:last-child {
        background-color: #f56c6c;

        &:hover {
          background-color: #f78989;
        }
      }
    }
  }
}
</style>
