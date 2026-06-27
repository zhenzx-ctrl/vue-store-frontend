<template>
  <div class="favorites-page">
    <h3 class="page-title">我的收藏</h3>
    <div v-if="favoriteStore.items.length" class="favorites-list">
      <div v-for="item in favoriteStore.items" :key="item.id" class="favorite-item">
        <ProductCard :product="item" />
        <button class="btn-unfav" @click="favoriteStore.removeFavorite(item.id)">取消收藏</button>
      </div>
    </div>
    <Empty v-else icon="❤️" text="暂无收藏" action-text="去逛逛" action-link="/products" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useFavoriteStore } from '@/stores/favorite'
import ProductCard from '@/components/ProductCard.vue'
import Empty from '@/components/Empty.vue'

const favoriteStore = useFavoriteStore()

onMounted(() => {
  favoriteStore.loadFavorites()
})
</script>

<style scoped>
.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 24px;
}

.favorites-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.favorite-item {
  position: relative;
}

.btn-unfav {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 12px;
  border: none;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 10;
}

.favorite-item:hover .btn-unfav {
  opacity: 1;
}

.btn-unfav:hover {
  background: #e4393c;
}

@media (max-width: 768px) {
  .favorites-list {
    grid-template-columns: repeat(2, 1fr);
  }
  .btn-unfav {
    opacity: 1;
  }
}
</style>
