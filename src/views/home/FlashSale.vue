<template>
  <section class="flash-sale">
    <div class="flash-header">
      <h3 class="flash-title">⚡ 限时秒杀</h3>
      <Countdown :target-time="endTime" @finished="onFinished" />
    </div>
    <div class="flash-list">
      <router-link
        v-for="item in products"
        :key="item.id"
        :to="`/product/${item.id}`"
        class="flash-item"
      >
        <div class="flash-img">
          <ImageLazy :src="item.image" :fallback-text="item.name.slice(0, 2)" />
        </div>
        <div class="flash-info">
          <h4 class="flash-name">{{ item.name }}</h4>
          <div class="flash-prices">
            <span class="flash-sale-price">¥{{ item.price }}</span>
            <span class="flash-original-price">¥{{ item.originalPrice }}</span>
          </div>
          <div class="flash-progress">
            <div class="flash-progress-bar" :style="{ width: progressPercent(item) + '%' }"></div>
          </div>
          <span class="flash-tag">已抢{{ progressPercent(item) }}%</span>
        </div>
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { FLASH_SALE_PRODUCTS, getFlashSaleEnd } from '@/api/product'
import Countdown from '@/components/Countdown.vue'
import ImageLazy from '@/components/ImageLazy.vue'

const products = FLASH_SALE_PRODUCTS
const endTime = getFlashSaleEnd()

function progressPercent(item) {
  const total = item.sales || 100
  const sold = Math.min(Math.floor(total * 0.85), total)
  return Math.round((sold / total) * 100)
}

function onFinished() {
  // 秒杀结束，可以展示已结束状态
}
</script>

<style scoped>
.flash-sale {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.flash-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.flash-title {
  font-size: 20px;
  font-weight: 600;
  color: #e4393c;
  margin: 0;
}

.flash-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.flash-item {
  text-decoration: none;
  color: #333;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
}

.flash-item:hover {
  transform: translateY(-4px);
}

.flash-img {
  width: 100%;
  height: 140px;
  background: #f5f5f5;
  overflow: hidden;
  border-radius: 8px;
}

.flash-info {
  padding: 10px 0 0;
}

.flash-name {
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.flash-prices {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
}

.flash-sale-price {
  font-size: 20px;
  font-weight: 700;
  color: #e4393c;
}

.flash-original-price {
  font-size: 13px;
  color: #999;
  text-decoration: line-through;
}

.flash-progress {
  height: 6px;
  background: #f5f5f5;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.flash-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #e4393c, #ff6b6b);
  border-radius: 3px;
  transition: width 0.3s;
}

.flash-tag {
  font-size: 12px;
  color: #e4393c;
}

@media (max-width: 768px) {
  .flash-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .flash-img {
    height: 100px;
  }
}
</style>
