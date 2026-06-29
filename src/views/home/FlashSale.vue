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
  background: var(--color-white, #fff);
  border-radius: var(--radius-md, 10px);
  padding: 20px;
  box-shadow: var(--shadow-card, 0 2px 12px rgba(0,0,0,0.04));
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
  color: var(--color-primary, #FF6B35);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.flash-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.flash-item {
  text-decoration: none;
  color: var(--color-text, #1F2937);
  border-radius: var(--radius-sm, 6px);
  overflow: hidden;
  transition: transform 0.3s;
}

.flash-item:hover {
  transform: translateY(-4px);
}

.flash-img {
  width: 100%;
  height: 140px;
  background: var(--gray-100, #f7f8fa);
  overflow: hidden;
  border-radius: var(--radius-sm, 6px);
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
  color: var(--color-primary, #FF6B35);
}

.flash-original-price {
  font-size: 13px;
  color: var(--gray-400, #b0b5bd);
  text-decoration: line-through;
}

.flash-progress {
  height: 6px;
  background: var(--gray-200, #edeef2);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.flash-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #FF6B35, #FF8A5C);
  border-radius: 3px;
  transition: width 0.3s;
}

.flash-tag {
  font-size: 12px;
  color: var(--color-primary, #FF6B35);
}

@media (max-width: 768px) {
  .flash-sale {
    padding: 12px;
  }
  .flash-header {
    margin-bottom: 10px;
  }
  .flash-title {
    font-size: 15px;
    color: #E55A2B;
    gap: 4px;
  }
  .flash-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  .flash-img {
    height: 100px;
  }
  .flash-name {
    font-size: 13px;
  }
  .flash-sale-price {
    font-size: 17px;
  }
}
</style>
