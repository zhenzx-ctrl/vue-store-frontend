<template>
  <div class="home">
    <!-- 搜索栏 -->
    <SearchBar class="home-search" />

    <!-- ===== 轮播图 + 分类侧边栏 ===== -->
    <div class="banner-area">
      <CategorySidebar class="home-sidebar" />
      <section class="banner">
        <div class="banner-track" :style="{ transform: `translateX(-${currentBanner * 100}%)` }">
          <div
            v-for="banner in banners"
            :key="banner.id"
            class="banner-slide"
            :style="{ background: banner.bgColor }"
          >
            <div class="banner-content">
              <span class="banner-tag">HOT</span>
              <h2>{{ banner.title }}</h2>
              <p>{{ banner.subtitle }}</p>
              <router-link to="/products" class="banner-btn">
                立即查看
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </router-link>
            </div>
            <!-- 装饰性图形 -->
            <div class="banner-deco">
              <div class="deco-circle"></div>
              <div class="deco-dots"></div>
            </div>
          </div>
        </div>
        <!-- 指示器 -->
        <div class="banner-dots">
          <span
            v-for="(banner, i) in banners"
            :key="banner.id"
            :class="{ active: currentBanner === i }"
            @click="throttledSwitch(i)"
          ></span>
        </div>
        <!-- 左右箭头 -->
        <button class="banner-arrow left" @click="throttledPrev">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button class="banner-arrow right" @click="throttledNext">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </section>
    </div>

    <!-- ===== 分类图标快捷入口 ===== -->
    <section class="category-grid-section">
      <div class="section-header">
        <h3 class="section-title">分类选购</h3>
        <router-link to="/products" class="section-more">查看全部 →</router-link>
      </div>
      <div class="category-grid">
        <router-link
          v-for="cat in categories"
          :key="cat.id"
          :to="`/products?category=${cat.name}`"
          class="category-grid-item"
        >
          <div class="category-grid-icon">
            <span class="cat-emoji">{{ cat.icon }}</span>
          </div>
          <span class="category-grid-name">{{ cat.name }}</span>
        </router-link>
      </div>
    </section>

    <!-- ===== 限时秒杀 ===== -->
    <FlashSale class="home-section" />

    <!-- ===== 活动横幅 ===== -->
    <div class="promotion-banners">
      <div
        v-for="promo in promotions"
        :key="promo.id"
        class="promo-item"
        :style="{ background: promo.bgColor }"
      >
        <div class="promo-content">
          <h4 :style="{ color: promo.textColor }">{{ promo.title }}</h4>
          <p :style="{ color: promo.textColor }">{{ promo.subtitle }}</p>
        </div>
        <div class="promo-icon">{{ promo.id === 1 ? '🏷️' : '🎁' }}</div>
      </div>
    </div>

    <!-- ===== 热门推荐 ===== -->
    <section class="home-section">
      <div class="section-header">
        <h3 class="section-title">🔥 热门推荐</h3>
        <router-link to="/products" class="section-more">查看更多 →</router-link>
      </div>
      <div class="product-grid">
        <ProductCard v-for="product in hotProducts" :key="product.id" :product="product" />
      </div>
    </section>

    <!-- ===== 新品专区 ===== -->
    <NewArrivals class="home-section" />
  </div>
</template>

<script>
export default { name: 'HomePage' }
</script>

<script setup>
import { ref, onMounted, onBeforeUnmount, onActivated, onDeactivated } from 'vue'
import { BANNERS, PROMOTION_BANNERS, CATEGORIES, getProducts } from '@/api/product'
import { throttle } from '@/utils'
import SearchBar from './SearchBar.vue'
import CategorySidebar from './CategorySidebar.vue'
import FlashSale from './FlashSale.vue'
import NewArrivals from './NewArrivals.vue'
import ProductCard from '@/components/ProductCard.vue'

const banners = BANNERS
const promotions = PROMOTION_BANNERS
const categories = CATEGORIES
const currentBanner = ref(0)
const hotProducts = ref([])

let autoPlayTimer = null

function nextBanner() {
  currentBanner.value = (currentBanner.value + 1) % banners.length
}

function prevBanner() {
  currentBanner.value = (currentBanner.value - 1 + banners.length) % banners.length
}

const throttledNext = throttle(nextBanner, 500)
const throttledPrev = throttle(prevBanner, 500)
const throttledSwitch = throttle((i) => { currentBanner.value = i }, 500)

function startAutoPlay() {
  autoPlayTimer = setInterval(nextBanner, 4000)
}

function stopAutoPlay() {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

onMounted(() => {
  hotProducts.value = getProducts().slice(0, 8)
  startAutoPlay()
})

onActivated(() => {
  startAutoPlay()
})

onDeactivated(() => {
  stopAutoPlay()
})

onBeforeUnmount(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: var(--space-6, 24px);
}

.home-search {
  margin-bottom: 4px;
}

/* ===== 轮播图区域 ===== */
.banner-area {
  display: flex;
  gap: 16px;
}

.home-sidebar {
  width: 220px;
  flex-shrink: 0;
}

.banner {
  flex: 1;
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md, 10px);
  height: 360px;
  min-width: 0;
}

.banner-track {
  display: flex;
  height: 100%;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.banner-slide {
  min-width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.banner-content {
  text-align: center;
  color: #fff;
  position: relative;
  z-index: 2;
  padding: 40px;
}

.banner-tag {
  display: inline-block;
  padding: 4px 16px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 16px;
  backdrop-filter: blur(4px);
}

.banner-content h2 {
  font-size: 38px;
  margin: 0 0 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.banner-content p {
  font-size: 16px;
  margin: 0 0 28px;
  opacity: 0.9;
  font-weight: 400;
}

.banner-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 36px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  text-decoration: none;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s;
  backdrop-filter: blur(4px);
}

.banner-btn:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

/* 装饰性元素 */
.banner-deco {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.deco-circle {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.08);
  top: -100px;
  right: -100px;
}

.deco-dots {
  position: absolute;
  width: 100px;
  height: 100px;
  bottom: 20px;
  right: 40px;
  background-image: radial-gradient(circle, rgba(255,255,255,0.1) 2px, transparent 2px);
  background-size: 16px 16px;
}

.banner-dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 5;
}

.banner-dots span {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.35);
  cursor: pointer;
  transition: all 0.3s;
}

.banner-dots span.active {
  width: 28px;
  background: var(--color-white, #fff);
}

.banner-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  cursor: pointer;
  border-radius: 50%;
  backdrop-filter: blur(4px);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  opacity: 0;
}

.banner:hover .banner-arrow {
  opacity: 1;
}

.banner-arrow:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-50%) scale(1.05);
}

.banner-arrow.left { left: 16px; }
.banner-arrow.right { right: 16px; }

/* ===== 分类图标快捷入口 ===== */
.category-grid-section {
  background: var(--color-white, #fff);
  border-radius: var(--radius-md, 10px);
  padding: var(--space-6, 24px);
  box-shadow: var(--shadow-card, 0 2px 12px rgba(0, 0, 0, 0.04));
  border: 1px solid var(--color-border-light, #f3f4f6);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--space-4, 16px);
  margin-top: var(--space-4, 16px);
}

.category-grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2, 8px);
  text-decoration: none;
  color: var(--gray-700, #4B5563);
  padding: var(--space-4, 16px) var(--space-2, 8px);
  border-radius: var(--radius-sm, 6px);
  transition: all var(--transition-base, 0.2s);
}

.category-grid-item:hover {
  background: var(--color-primary-lighter, #FFF0E8);
  transform: translateY(-3px);
}

.category-grid-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--gray-100, #f7f8fa);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base, 0.2s);
}

.category-grid-item:hover .category-grid-icon {
  background: var(--color-primary-lighter, #FFF0E8);
  transform: scale(1.1);
}

.cat-emoji {
  font-size: 28px;
  line-height: 1;
}

.category-grid-name {
  font-size: var(--text-sm, 13px);
  font-weight: var(--weight-medium, 500);
}

/* ===== 活动横幅 ===== */
.promotion-banners {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.promo-item {
  padding: 24px 28px;
  border-radius: var(--radius-md, 10px);
  transition: all var(--transition-base, 0.2s);
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  position: relative;
}

.promo-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md, 0 4px 16px rgba(0, 0, 0, 0.06));
}

.promo-content {
  position: relative;
  z-index: 1;
}

.promo-content h4 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 6px;
}

.promo-content p {
  font-size: 14px;
  margin: 0;
  opacity: 0.85;
}

.promo-icon {
  font-size: 40px;
  opacity: 0.3;
  flex-shrink: 0;
}

/* ===== 通用 ===== */
.home-section {
  margin-top: 4px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-5, 20px);
}

.section-title {
  font-size: 20px;
  font-weight: var(--weight-semibold, 600);
  color: var(--gray-900, #1F2937);
  margin: 0;
  padding-left: 14px;
  border-left: 4px solid var(--color-primary, #FF6B35);
  line-height: 1.2;
}

.section-more {
  font-size: var(--text-sm, 13px);
  color: var(--gray-500, #8B909A);
  text-decoration: none;
  transition: color var(--transition-fast, 0.15s);
}

.section-more:hover {
  color: var(--color-primary, #FF6B35);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

/* ===== 响应式 ===== */
@media (max-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .category-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .home {
    gap: 16px;
  }
  .banner-area {
    flex-direction: column;
  }
  .home-sidebar {
    width: 100%;
  }
  .banner {
    height: 220px;
  }
  .banner-content h2 {
    font-size: 24px;
  }
  .banner-content p {
    font-size: 14px;
  }
  .banner-tag {
    font-size: 10px;
    margin-bottom: 10px;
  }
  .banner-btn {
    padding: 8px 24px;
    font-size: 13px;
  }
  .banner-arrow {
    opacity: 1;
    width: 32px;
    height: 32px;
  }
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  .promotion-banners {
    grid-template-columns: 1fr;
  }
  .category-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  .category-grid-icon {
    width: 48px;
    height: 48px;
  }
  .cat-emoji {
    font-size: 22px;
  }
  .section-title {
    font-size: 17px;
    padding-left: 10px;
  }
  .section-header {
    margin-bottom: 14px;
  }
  .category-grid-section {
    padding: 16px 12px;
  }
}
</style>
