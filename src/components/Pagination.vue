<template>
  <div v-if="totalPages > 1" class="pagination">
    <button :disabled="modelValue <= 1" @click="changePage(modelValue - 1)">上一页</button>
    <span
      v-for="p in pageNumbers"
      :key="p"
      :class="{ active: p === modelValue, ellipsis: p === '...' }"
      @click="p !== '...' && changePage(p)"
    >{{ p }}</span>
    <button :disabled="modelValue >= totalPages" @click="changePage(modelValue + 1)">下一页</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  total: { type: Number, default: 0 },
  modelValue: { type: Number, default: 1 },
  pageSize: { type: Number, default: 8 },
})

const emit = defineEmits(['update:modelValue'])

const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

const pageNumbers = computed(() => {
  const total = totalPages.value
  const current = props.modelValue
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = []
  pages.push(1)
  if (current > 3) pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i)
  }
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

function changePage(p) {
  if (p < 1 || p > totalPages.value) return
  emit('update:modelValue', p)
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
}

.pagination button {
  padding: 6px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination button:hover:not(:disabled) {
  border-color: #e4393c;
  color: #e4393c;
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  border-radius: 6px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination span:hover:not(.ellipsis) {
  background: #fff0f0;
  color: #e4393c;
}

.pagination span.active {
  background: #e4393c;
  color: #fff;
}

.pagination span.ellipsis {
  cursor: default;
  color: #ccc;
}
</style>
