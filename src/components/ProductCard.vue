<template>
  <router-link :to="`/product/${product.id}`" class="product-card">
    <div class="product-img">
      <ImageLazy :src="product.image" :fallback-text="product.name.slice(0, 2)" />
    </div>
    <div class="product-info">
      <h4 class="product-name">{{ product.name }}</h4>
      <p class="product-desc">{{ product.description }}</p>
      <div class="product-meta">
        <span v-if="product.sales" class="product-sales">已售 {{ product.sales > 999 ? (product.sales/1000).toFixed(1) + 'k' : product.sales }}</span>
      </div>
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
  background: var(--color-white, #fff);
  border-radius: var(--radius-md, 10px);
  overflow: hidden;
  text-decoration: none;
  color: var(--color-text, #1F2937);
  transition: transform var(--transition-slow, 0.3s), box-shadow var(--transition-slow, 0.3s);
  box-shadow: var(--shadow-card, 0 2px 12px rgba(0, 0, 0, 0.04));
  border: 1px solid var(--color-border-light, #f3f4f6);
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover, 0 8px 28px rgba(0, 0, 0, 0.10));
}

.product-img {
  width: 100%;
  aspect-ratio: 1;
  background: var(--gray-100, #f7f8fa);
  overflow: hidden;
}

.product-img :deep(img) {
  transition: transform 0.4s ease;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-card:hover .product-img :deep(img) {
  transform: scale(1.08);
}

.product-info {
  padding: var(--space-4, 16px);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: var(--text-base, 14px);
  font-weight: var(--weight-semibold, 600);
  margin: 0 0 var(--space-1, 4px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--gray-900, #1F2937);
}

.product-desc {
  font-size: var(--text-xs, 12px);
  color: var(--gray-500, #8B909A);
  margin: 0 0 var(--space-2, 8px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.product-meta {
  margin-bottom: var(--space-2, 8px);
}

.product-sales {
  font-size: var(--text-xs, 12px);
  color: var(--gray-400, #b0b5bd);
}

.product-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: var(--space-2, 8px);
  border-top: 1px solid var(--gray-100, #f7f8fa);
}

.product-price {
  font-size: var(--text-lg, 16px);
  font-weight: var(--weight-bold, 700);
  color: var(--color-primary, #FF6B35);
}

.product-category {
  font-size: var(--text-xs, 12px);
  color: var(--gray-400, #b0b5bd);
  background: var(--gray-100, #f7f8fa);
  padding: 2px 8px;
  border-radius: 4px;
}
</style>
