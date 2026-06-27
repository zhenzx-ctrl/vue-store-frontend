<template>
  <router-link :to="`/product/${product.id}`" class="product-card">
    <div class="product-img">
      <ImageLazy :src="product.image" :fallback-text="product.name.slice(0, 2)" />
    </div>
    <div class="product-info">
      <h4 class="product-name">{{ product.name }}</h4>
      <p class="product-desc">{{ product.description }}</p>
      <div class="product-bottom">
        <span class="product-price">¥{{ product.price.toFixed(2) }}</span>
        <span class="product-category">{{ product.category }}</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import ImageLazy from '@/components/ImageLazy.vue'

defineProps({
  product: { type: Object, required: true },
})
</script>

<style scoped>
.product-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: #333;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.product-img {
  width: 100%;
  height: 180px;
  background: #f5f5f5;
  overflow: hidden;
}

.product-info {
  padding: 14px;
}

.product-name {
  font-size: 15px;
  font-weight: 500;
  margin: 0 0 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-desc {
  font-size: 13px;
  color: #999;
  margin: 0 0 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-price {
  font-size: 18px;
  font-weight: 700;
  color: #e4393c;
}

.product-category {
  font-size: 12px;
  color: #999;
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 4px;
}
</style>
