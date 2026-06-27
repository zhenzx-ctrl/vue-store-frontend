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
  color: #333;
  margin: 0;
  padding-left: 12px;
  border-left: 4px solid #e4393c;
}

.view-more {
  font-size: 14px;
  color: #999;
  text-decoration: none;
  transition: color 0.2s;
}

.view-more:hover {
  color: #e4393c;
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
