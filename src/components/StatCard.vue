<template>
  <div class="stat-card">
    <h3>{{ title }}</h3>
    <p>{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  }
})
</script>

<style scoped>
.stat-card {
  background: var(--card-background, white);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);

  h3 {
    margin: 0 0 10px 0;
    color: var(--text-secondary-color, #666);
    font-size: 14px;
  }

  p {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
    color: var(--text-color);
  }
}
</style>