<template>
  <div class="filter-bar">
    <!-- 排序 -->
    <div class="filter-sort">
      <button
        v-for="opt in sortOptions"
        :key="opt.value"
        :class="{ active: currentSort === opt.value }"
        @click="changeSort(opt.value)"
      >{{ opt.label }}</button>
    </div>

    <!-- 价格区间 -->
    <div class="filter-price">
      <input
        v-model.number="minPrice"
        type="number"
        placeholder="最低价"
        min="0"
        @change="emitChange"
      />
      <span class="price-sep">—</span>
      <input
        v-model.number="maxPrice"
        type="number"
        placeholder="最高价"
        min="0"
        @change="emitChange"
      />
      <button class="price-confirm" @click="emitChange">确定</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  sortBy: { type: String, default: '' },
  priceMin: { type: Number, default: 0 },
  priceMax: { type: Number, default: 0 },
})

const emit = defineEmits(['change'])

const currentSort = ref(props.sortBy)
const minPrice = ref(props.priceMin || '')
const maxPrice = ref(props.priceMax || '')

const sortOptions = [
  { label: '综合', value: '' },
  { label: '销量', value: 'sales' },
  { label: '价格↑', value: 'priceAsc' },
  { label: '价格↓', value: 'priceDesc' },
  { label: '最新', value: 'newest' },
]

function changeSort(value) {
  currentSort.value = value
  emitChange()
}

function emitChange() {
  emit('change', {
    sortBy: currentSort.value,
    priceMin: minPrice.value || 0,
    priceMax: maxPrice.value || 0,
  })
}

watch(() => props.sortBy, (v) => { currentSort.value = v })
watch(() => props.priceMin, (v) => { minPrice.value = v || '' })
watch(() => props.priceMax, (v) => { maxPrice.value = v || '' })
</script>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: var(--color-white, #fff);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  flex-wrap: wrap;
}

.filter-sort {
  display: flex;
  gap: 0;
}

.filter-sort button {
  padding: 6px 18px;
  border: 1px solid #eee;
  background: var(--color-white, #fff);
  font-size: 14px;
  color: var(--gray-600, #6B7280);
  cursor: pointer;
  transition: all 0.2s;
}

.filter-sort button:first-child {
  border-radius: 6px 0 0 6px;
}

.filter-sort button:last-child {
  border-radius: 0 6px 6px 0;
}

.filter-sort button:hover {
  color: var(--color-primary, #FF6B35);
}

.filter-sort button.active {
  background: var(--color-primary, #FF6B35);
  color: #fff;
  border-color: var(--color-primary, #FF6B35);
}

.filter-price {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-price input {
  width: 90px;
  height: 32px;
  border: 1px solid var(--gray-300, #d0d5dd);
  border-radius: 6px;
  padding: 0 10px;
  font-size: 13px;
  color: var(--gray-900, #1F2937);
  outline: none;
  text-align: center;
}

.filter-price input:focus {
  border-color: var(--color-primary, #FF6B35);
}

.filter-price input::placeholder {
  color: #ccc;
}

.price-sep {
  color: #ccc;
  font-size: 14px;
}

.price-confirm {
  padding: 6px 14px;
  border: 1px solid var(--color-primary, #FF6B35);
  border-radius: 6px;
  background: var(--color-white, #fff);
  color: var(--color-primary, #FF6B35);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.price-confirm:hover {
  background: var(--color-primary-lighter, #FFF0E8);
}

@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .filter-sort {
    overflow-x: auto;
  }
  .filter-sort button {
    white-space: nowrap;
    padding: 6px 12px;
    font-size: 13px;
  }
}
</style>
