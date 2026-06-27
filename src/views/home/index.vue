<template>
  <div class="home">
    <!-- 搜索栏 -->
    <SearchBar class="home-search" />

    <!-- 轮播图 + 分类侧边栏 -->
    <div class="banner-area">
      <CategorySidebar class="home-sidebar" />
      <section class="banner">
        <div class="banner-track" :style="{ transform: `translateX(-${currentBanner * 100}%)` }">
          <div
            v-for="banner in banners"
            :key="banner.id"
            class="banner-slide"
            :style="{ backgroundColor: banner.bgColor }"
          >
            <div class="banner-content">
              <h2>{{ banner.title }}</h2>
              <p>{{ banner.subtitle }}</p>
              <router-link to="/products" class="banner-btn">立即查看 →</router-link>
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
        <button class="banner-arrow left" @click="throttledPrev">‹</button>
        <button class="banner-arrow right" @click="throttledNext">›</button>
      </section>
    </div>

    <!-- 限时秒杀 -->
    <FlashSale class="home-section" />

    <!-- 活动横幅 -->
    <div class="promotion-banners">
      <div
        v-for="promo in promotions"
        :key="promo.id"
        class="promo-item"
        :style="{ background: promo.bgColor }"
      >
        <h4 :style="{ color: promo.textColor }">{{ promo.title }}</h4>
        <p :style="{ color: promo.textColor, opacity: 0.8 }">{{ promo.subtitle }}</p>
      </div>
    </div>

    <!-- 热门商品 -->
    <section class="home-section">
      <h3 class="section-title">🔥 热门推荐</h3>
      <div class="product-grid">
        <ProductCard v-for="product in hotProducts" :key="product.id" :product="product" />
      </div>
    </section>

    <!-- 新品专区 -->
    <NewArrivals class="home-section" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { BANNERS, PROMOTION_BANNERS, getProducts } from '@/api/product'
import { throttle } from '@/utils'
import SearchBar from './SearchBar.vue'
import CategorySidebar from './CategorySidebar.vue'
import FlashSale from './FlashSale.vue'
import NewArrivals from './NewArrivals.vue'
import ProductCard from '@/components/ProductCard.vue'

const banners = BANNERS
const promotions = PROMOTION_BANNERS
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

onBeforeUnmount(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.home-search {
  margin-bottom: 4px;
}

/* 轮播图区域 */
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
  border-radius: 12px;
  height: 340px;
  min-width: 0;
}

.banner-track {
  display: flex;
  height: 100%;
  transition: transform 0.5s ease;
}

.banner-slide {
  min-width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-content {
  text-align: center;
  color: #fff;
}

.banner-content h2 {
  font-size: 36px;
  margin: 0 0 12px;
  font-weight: 700;
  letter-spacing: 2px;
}

.banner-content p {
  font-size: 18px;
  margin: 0 0 24px;
  opacity: 0.9;
}

.banner-btn {
  display: inline-block;
  padding: 10px 32px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  text-decoration: none;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  font-size: 15px;
  transition: all 0.3s;
  backdrop-filter: blur(4px);
}

.banner-btn:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-1px);
}

.banner-dots {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.banner-dots span {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s;
}

.banner-dots span.active {
  width: 24px;
  background: #fff;
}

.banner-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 22px;
  cursor: pointer;
  border-radius: 50%;
  backdrop-filter: blur(4px);
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-arrow:hover {
  background: rgba(255, 255, 255, 0.3);
}

.banner-arrow.left { left: 16px; }
.banner-arrow.right { right: 16px; }

/* 活动横幅 */
.promotion-banners {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.promo-item {
  padding: 20px 24px;
  border-radius: 12px;
  transition: transform 0.2s;
}

.promo-item:hover {
  transform: translateY(-2px);
}

.promo-item h4 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 6px;
}

.promo-item p {
  font-size: 14px;
  margin: 0;
}

/* 通用 */
.home-section {
  margin-top: 8px;
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px;
  padding-left: 12px;
  border-left: 4px solid #e4393c;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

/* 响应式 */
@media (max-width: 768px) {
  .banner-area {
    flex-direction: column;
  }
  .home-sidebar {
    width: 100%;
  }
  .banner { height: 200px; }
  .banner-content h2 { font-size: 22px; }
  .banner-content p { font-size: 14px; }
  .product-grid { grid-template-columns: repeat(2, 1fr); }
  .promotion-banners { grid-template-columns: 1fr; }
}
</style>
