<template>
  <div class="code-editor-container">
    <Loading v-if="loading" text="大尺寸" size="large" color="#e6a23c" />
    <div v-else ref="editorContainer" class="code-editor"></div>
  </div>
</template>

<script setup>
import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";
import { ref, computed, onMounted, getCurrentInstance, watchEffect, nextTick, onBeforeUnmount, watch } from 'vue'

let editor = null;
const { proxy } = getCurrentInstance()
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'json'
  },
  readonly: {
    type: Boolean,
    default: false
  },
  minimap: { // 右侧代码缩略图
    type: Boolean,
    default: false
  }
})

const loading = ref(false)

const editorContainer = ref(null)

const value = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
  }
})

const emit = defineEmits(['update:modelValue'])

loading.value = false

watch(() => value.value, (newVal) => {
  if (editor) {
    editor.setValue(newVal)
  }
})

onMounted(async () => {
  try {
    // 等待loading状态变为false且DOM更新完成
    await nextTick()
    initEditor()
  } catch (error) {
    console.log("🚀 ~ error:", error)
  }
})

// 初始化编辑器
const initEditor = () => {
  editor = monaco.editor.create(proxy.$refs.editorContainer, {
    value: value.value,
    readOnly: props.readonly,
    language: props.language,
    theme: "vs-dark",
    selectOnLineNumbers: true,
    automaticLayout: true,
    renderSideBySide: true,
    minimap: {
      enabled: props.minimap, // 或 false 以完全禁用
      size: 'fill'
    }
  });
  loading.value = false
}

// 组件卸载前清理编辑器
onBeforeUnmount(() => {
  if (editor) {
    editor.dispose();
    editor = null;
  }
})
</script>

<style lang="scss" scoped>
.code-editor-container {
  height: 100%;
  width: 100%;

  .code-editor {
    height: 100%;
    width: 100%;
  }
}
</style>
