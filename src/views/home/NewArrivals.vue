<template>
  <section class="new-arrivals">
    <div class="section-header">
      <h3 class="section-title">🆕 新品专区</h3>
      <router-link to="/products?sort=newest" class="view-more">查看更多 →</router-link>
    </div>
    <div class="product-grid">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
  </section>
</template>

<script setup>
import { getProducts } from '@/api/product'
import ProductCard from '@/components/ProductCard.vue'

// 取最新8个商品（按id倒序）
const products = getProducts()
  .slice()
  .sort((a, b) => b.id - a.id)
  .slice(0, 8)
</script>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--gray-900, #1F2937);
  margin: 0;
  padding-left: 14px;
  border-left: 4px solid var(--color-primary, #FF6B35);
}

.view-more {
  font-size: 14px;
  color: var(--gray-500, #8B909A);
  text-decoration: none;
  transition: color var(--transition-fast, 0.15s);
}

.view-more:hover {
  color: var(--color-primary, #FF6B35);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
