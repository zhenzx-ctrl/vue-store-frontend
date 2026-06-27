<template>
  <div class="category-sidebar">
    <h4 class="sidebar-title">商品分类</h4>
    <div class="category-list">
      <router-link
        v-for="cat in categories"
        :key="cat.id"
        :to="`/products?category=${cat.name}`"
        class="category-item"
      >
        <span class="cat-icon">{{ cat.icon }}</span>
        <span class="cat-name">{{ cat.name }}</span>
        <span class="cat-arrow">›</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { CATEGORIES } from '@/api/product'

const categories = CATEGORIES
</script>

<style scoped>
.category-sidebar {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  padding: 16px 20px 12px;
  border-bottom: 1px solid #f0f0f0;
}

.category-list {
  padding: 8px 0;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  text-decoration: none;
  color: #333;
  transition: all 0.2s;
}

.category-item:hover {
  background: #fff0f0;
  color: #e4393c;
}

.cat-icon {
  font-size: 20px;
  margin-right: 10px;
}

.cat-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.cat-arrow {
  font-size: 16px;
  color: #ccc;
}

.category-item:hover .cat-arrow {
  color: #e4393c;
}

@media (max-width: 768px) {
  .category-sidebar {
    border-radius: 0;
  }
  .sidebar-title {
    display: none;
  }
  .category-list {
    display: flex;
    overflow-x: auto;
    padding: 8px;
    gap: 8px;
    -webkit-overflow-scrolling: touch;
  }
  .category-item {
    flex-shrink: 0;
    padding: 8px 16px;
    background: #f5f5f5;
    border-radius: 20px;
  }
  .cat-arrow {
    display: none;
  }
}
</style>
