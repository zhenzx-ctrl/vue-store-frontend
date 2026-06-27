<template>
  <div class="detail-page" v-if="product">
    <div class="detail-layout">
      <!-- 左：商品图片（放大预览） -->
      <div class="detail-img">
        <ImageZoom :images="productImages" :fallback-text="product.name.slice(0, 2)" />
      </div>

      <!-- 右：商品信息 -->
      <div class="detail-info">
        <div class="detail-name-row">
          <h1 class="detail-name">{{ product.name }}</h1>
          <button :class="['btn-favorite', { active: isFavorited }]" @click="toggleFavorite">
            {{ isFavorited ? '❤️' : '🤍' }} {{ isFavorited ? '已收藏' : '收藏' }}
          </button>
        </div>
        <p class="detail-desc">{{ product.description }}</p>
        <div class="detail-price">
          <span class="price-symbol">¥</span>
          <span class="price-value">{{ product.price.toFixed(2) }}</span>
          <span v-if="product.sales" class="product-sales">已售 {{ product.sales }}+</span>
        </div>

        <!-- SKU 规格选择 -->
        <div v-if="skuGroups.color" class="sku-section">
          <h4>颜色</h4>
          <div class="sku-options">
            <button
              v-for="color in skuGroups.color"
              :key="color"
              :class="{ active: selectedColor === color }"
              @click="selectedColor = color"
            >{{ color }}</button>
          </div>
        </div>

        <div v-if="skuGroups.size" class="sku-section">
          <h4>规格</h4>
          <div class="sku-options">
            <button
              v-for="size in skuGroups.size"
              :key="size"
              :class="{ active: selectedSize === size }"
              @click="selectedSize = size"
            >{{ size }}</button>
          </div>
        </div>

        <!-- 数量选择 -->
        <div class="quantity-section">
          <h4>数量</h4>
          <div class="quantity-ctrl">
            <button @click="quantity > 1 && quantity--">−</button>
            <span>{{ quantity }}</span>
            <button @click="quantity++">+</button>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-bar">
          <button class="btn-cart" @click="addToCart">加入购物车</button>
          <button class="btn-buy" @click="buyNow">立即购买</button>
        </div>
      </div>
    </div>

    <!-- 评价列表 -->
    <Reviews :product-id="product.id" />

    <!-- 加入购物车成功提示 -->
    <Transition name="toast">
      <div v-if="showToast" class="toast">✓ 已加入购物车</div>
    </Transition>

    <!-- 未登录提示弹窗 -->
    <Modal :visible="showLoginModal" title="提示" width="360px" @close="showLoginModal = false">
      <p style="text-align:center;font-size:15px;color:#666;">请先登录后再操作</p>
      <template #footer>
        <button class="btn-cancel" @click="showLoginModal = false">取消</button>
        <button class="btn-confirm" @click="goLogin">去登录</button>
      </template>
    </Modal>
  </div>

  <!-- 商品不存在 -->
  <div v-else class="empty">
    <p>😕 商品不存在或已下架</p>
    <router-link to="/products">
      <button>返回商品列表</button>
    </router-link>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductById } from '@/api/product'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { useFavoriteStore } from '@/stores/favorite'
import { getStorage, setStorage } from '@/utils/storage'
import ImageZoom from './ImageZoom.vue'
import Reviews from './Reviews.vue'
import Modal from '@/components/Modal.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()
const favoriteStore = useFavoriteStore()

const product = ref(null)
const selectedColor = ref('')
const selectedSize = ref('')
const quantity = ref(1)
const showToast = ref(false)
const showLoginModal = ref(false)

// 商品图片列表（支持多图）
const productImages = computed(() => {
  if (!product.value) return []
  const imgs = product.value.images || []
  if (imgs.length === 0 && product.value.image) return [product.value.image]
  if (imgs.length === 0) return []
  return imgs
})

// 是否已收藏（使用响应式 Store）
const isFavorited = computed(() => {
  if (!product.value) return false
  return favoriteStore.items.some(f => f.id === product.value.id)
})

// 从 SKU 列表中提取颜色和规格分组
const skuGroups = computed(() => {
  if (!product.value?.skus?.length) return {}
  const colors = [...new Set(product.value.skus.map(s => s.color).filter(Boolean))]
  const sizes = [...new Set(product.value.skus.map(s => s.size).filter(Boolean))]
  return {
    color: colors.length ? colors : null,
    size: sizes.length ? sizes : null,
  }
})

// 当前选中的 SKU
const currentSku = computed(() => {
  if (!product.value?.skus?.length) return null
  return {
    color: selectedColor.value || '',
    size: selectedSize.value || '',
  }
})

// 加载商品
function loadProduct() {
  const id = route.params.id
  product.value = getProductById(id)
  if (product.value) {
    selectedColor.value = skuGroups.value.color?.[0] || ''
    selectedSize.value = skuGroups.value.size?.[0] || ''
    quantity.value = 1

    // 加载收藏状态
    favoriteStore.loadFavorites()

    // 记录浏览足迹
    recordBrowseHistory()
  }
}

// 记录浏览足迹
function recordBrowseHistory() {
  if (!product.value) return
  let history = getStorage('browseHistory', [])
  history = history.filter(h => h.id !== product.value.id)
  history.unshift({
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    image: product.value.image || '',
    category: product.value.category,
    browseTime: new Date().toISOString(),
  })
  if (history.length > 50) history = history.slice(0, 50)
  setStorage('browseHistory', history)
}

// 收藏/取消收藏（使用响应式 Store）
function toggleFavorite() {
  if (!userStore.isLoggedIn) {
    showLoginModal.value = true
    return
  }
  favoriteStore.toggleFavorite(product.value)
}

// 加入购物车
function addToCart() {
  if (!product.value) return
  if (!userStore.isLoggedIn) {
    showLoginModal.value = true
    return
  }
  cartStore.addItem(product.value, currentSku.value, quantity.value)
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 1500)
}

// 立即购买
function buyNow() {
  if (!product.value) return
  if (!userStore.isLoggedIn) {
    showLoginModal.value = true
    return
  }
  cartStore.addItem(product.value, currentSku.value, quantity.value)
  router.push('/cart')
}

// 跳转登录
function goLogin() {
  showLoginModal.value = false
  router.push({ path: '/login', query: { redirect: route.fullPath } })
}

watch(() => route.params.id, loadProduct, { immediate: true })
</script>

<style scoped>
.detail-page {
  position: relative;
}

.detail-layout {
  display: flex;
  gap: 40px;
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* 左侧图片 */
.detail-img {
  width: 420px;
  min-width: 420px;
  flex-shrink: 0;
}

/* 右侧信息 */
.detail-info {
  flex: 1;
}

.detail-name-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.detail-name {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.3;
  flex: 1;
}

.btn-favorite {
  flex-shrink: 0;
  padding: 6px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: #fff;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-favorite:hover {
  border-color: #e4393c;
  color: #e4393c;
}

.btn-favorite.active {
  border-color: #e4393c;
  color: #e4393c;
  background: #fff0f0;
}

.detail-desc {
  font-size: 14px;
  color: #999;
  margin: 10px 0 20px;
  line-height: 1.6;
}

.detail-price {
  background: #fff8f0;
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.price-symbol {
  font-size: 18px;
  color: #e4393c;
  font-weight: 500;
}

.price-value {
  font-size: 32px;
  color: #e4393c;
  font-weight: 700;
}

.product-sales {
  font-size: 13px;
  color: #999;
  margin-left: 12px;
}

/* SKU 选择 */
.sku-section {
  margin-bottom: 20px;
}

.sku-section h4 {
  font-size: 14px;
  color: #999;
  margin: 0 0 10px;
  font-weight: 500;
}

.sku-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.sku-options button {
  padding: 8px 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  font-size: 14px;
  color: #333;
  transition: all 0.2s;
}

.sku-options button:hover {
  border-color: #e4393c;
  color: #e4393c;
}

.sku-options button.active {
  border-color: #e4393c;
  color: #e4393c;
  background: #fff0f0;
}

/* 数量 */
.quantity-section {
  margin-bottom: 28px;
}

.quantity-section h4 {
  font-size: 14px;
  color: #999;
  margin: 0 0 10px;
  font-weight: 500;
}

.quantity-ctrl {
  display: inline-flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}

.quantity-ctrl button {
  width: 36px;
  height: 36px;
  border: none;
  background: #f5f5f5;
  font-size: 18px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-ctrl button:hover {
  background: #eee;
}

.quantity-ctrl span {
  width: 50px;
  text-align: center;
  font-size: 15px;
  font-weight: 500;
}

/* 操作按钮 */
.action-bar {
  display: flex;
  gap: 16px;
}

.btn-cart {
  flex: 1;
  height: 48px;
  border: 2px solid #e4393c;
  border-radius: 24px;
  background: #fff;
  color: #e4393c;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-cart:hover {
  background: #fff0f0;
}

.btn-buy {
  flex: 1;
  height: 48px;
  border: none;
  border-radius: 24px;
  background: #e4393c;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-buy:hover {
  background: #c1272d;
}

/* Toast 提示 */
.toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: #fff;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 15px;
  z-index: 999;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-16px);
}

/* Modal 按钮 */
.btn-cancel {
  padding: 8px 24px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: #fff;
  color: #666;
  font-size: 14px;
  cursor: pointer;
}

.btn-confirm {
  padding: 8px 24px;
  border: none;
  border-radius: 20px;
  background: #e4393c;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn-confirm:hover {
  background: #c1272d;
}

/* 空状态 */
.empty {
  text-align: center;
  padding: 80px 20px;
  color: #999;
}

.empty p {
  font-size: 16px;
  margin-bottom: 16px;
}

.empty button {
  padding: 10px 28px;
  border: 1px solid #ddd;
  border-radius: 24px;
  background: #fff;
  color: #666;
  font-size: 15px;
}

/* 响应式 */
@media (max-width: 768px) {
  .detail-layout {
    flex-direction: column;
    padding: 20px;
    gap: 20px;
  }
  .detail-img {
    width: 100%;
    min-width: auto;
  }
  .detail-name-row {
    flex-direction: column;
    gap: 8px;
  }
  .action-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12px 16px;
    background: #fff;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
    z-index: 50;
    gap: 12px;
  }
}
</style>
