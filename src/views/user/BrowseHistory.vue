<template>
  <div class="history-page">
    <div class="history-header">
      <h3 class="page-title">浏览足迹</h3>
      <button v-if="history.length" class="btn-clear" @click="clearHistory">清空足迹</button>
    </div>
    <div v-if="history.length" class="history-list">
      <ProductCard v-for="item in history" :key="item.id" :product="item" />
    </div>
    <Empty v-else icon="👀" text="暂无浏览记录" action-text="去逛逛" action-link="/products" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getStorage, setStorage } from '@/utils/storage'
import ProductCard from '@/components/ProductCard.vue'
import Empty from '@/components/Empty.vue'

const history = ref([])

onMounted(() => {
  history.value = getStorage('browseHistory', [])
})

function clearHistory() {
  setStorage('browseHistory', [])
  history.value = []
}
</script>

<style scoped>
.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.btn-clear {
  padding: 6px 16px;
  border: 1px solid #ddd;
  border-radius: 16px;
  background: #fff;
  color: #999;
  font-size: 13px;
  cursor: pointer;
}

.btn-clear:hover {
  border-color: #e4393c;
  color: #e4393c;
}

.history-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 768px) {
  .history-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
