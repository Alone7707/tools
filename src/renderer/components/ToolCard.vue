<template>
  <div class="tool-card">
    <div class="tool-icon">{{ tool.icon }}</div>
    <h3>{{ tool.name }}</h3>
    <p>{{ tool.description }}</p>
    <button class="btn-primary" @click="$emit('use-tool', tool)">
      开始使用
    </button>
  </div>
</template>

<script setup>
defineProps({
  tool: {
    type: Object,
    required: true
  }
})

defineEmits(['use-tool'])
</script>

<style scoped>
.tool-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.tool-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.tool-card h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.tool-card p {
  margin: 0 0 15px 0;
  color: #666;
}

.btn-primary {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background: #5a6fd8;
}
</style>