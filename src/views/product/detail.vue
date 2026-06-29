<template>
  <div class="detail-page" v-if="product">
    <!-- 返回按钮 -->
    <button class="back-btn" @click="goBack">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      返回
    </button>
    <div class="detail-layout">
      <!-- 左：商品图片（放大预览） -->
      <div class="detail-img">
        <ImageZoom :images="productImages" :fallback-text="product.name.slice(0, 2)" />
      </div>

      <!-- 右：商品信息 -->
      <div class="detail-info">
        <div class="detail-header">
          <div class="detail-tags">
            <span class="tag tag-hot">热卖</span>
            <span v-if="product.sales" class="tag tag-sales">已售 {{ product.sales > 999 ? (product.sales/1000).toFixed(1) + 'k' : product.sales }}</span>
          </div>
          <h1 class="detail-name">{{ product.name }}</h1>
          <p class="detail-desc">{{ product.description }}</p>
        </div>

        <div class="detail-price">
          <span class="price-symbol">¥</span>
          <span class="price-value">{{ product.price.toFixed(2) }}</span>
          <span class="price-original" v-if="product.originalPrice">¥{{ product.originalPrice.toFixed(2) }}</span>
        </div>

        <!-- SKU 规格选择 -->
        <div class="detail-skus">
          <div v-if="skuGroups.color" class="sku-section">
            <h4>颜色 <span v-if="selectedColor">: {{ selectedColor }}</span></h4>
            <div class="sku-options">
              <button
                v-for="color in skuGroups.color"
                :key="color"
                :class="{ active: selectedColor === color }"
                @click="selectedColor = color"
              >
                <span class="sku-swatch" :style="{ background: colorToHex(color) }"></span>
                {{ color }}
              </button>
            </div>
          </div>

          <div v-if="skuGroups.size" class="sku-section">
            <h4>规格 <span v-if="selectedSize">: {{ selectedSize }}</span></h4>
            <div class="sku-options">
              <button
                v-for="size in skuGroups.size"
                :key="size"
                :class="{ active: selectedSize === size }"
                @click="selectedSize = size"
              >{{ size }}</button>
            </div>
          </div>
        </div>

        <!-- 数量选择 -->
        <div class="quantity-section">
          <h4>数量</h4>
          <div class="quantity-ctrl">
            <button @click="quantity > 1 && quantity--" :disabled="quantity <= 1">−</button>
            <input type="text" :value="quantity" @input="onQtyInput" />
            <button @click="quantity < 99 && quantity++" :disabled="quantity >= 99">+</button>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-bar">
          <button class="btn-cart" @click="addToCart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            加入购物车
          </button>
          <button class="btn-buy" @click="buyNow">立即购买</button>
          <button :class="['btn-favorite', { active: isFavorited }]" @click="toggleFavorite">
            {{ isFavorited ? '❤️' : '🤍' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 评价列表 -->
    <Reviews :product-id="product.id" />

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="showToast" class="toast">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        已加入购物车
      </div>
    </Transition>

    <!-- 未登录提示弹窗 -->
    <Modal :visible="showLoginModal" title="提示" width="360px" @close="showLoginModal = false">
      <p style="text-align:center;font-size:15px;color:var(--gray-600);">请先登录后再操作</p>
      <template #footer>
        <button class="btn-cancel" @click="showLoginModal = false">取消</button>
        <button class="btn-confirm" @click="goLogin">去登录</button>
      </template>
    </Modal>
  </div>

  <!-- 商品不存在 -->
  <div v-else class="empty">
    <div class="empty-icon">😕</div>
    <p>商品不存在或已下架</p>
    <router-link to="/products">
      <button class="btn-back">返回商品列表</button>
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

// 商品图片列表
const productImages = computed(() => {
  if (!product.value) return []
  const imgs = product.value.images || []
  if (imgs.length === 0 && product.value.image) return [product.value.image]
  if (imgs.length === 0) return []
  return imgs
})

// 是否已收藏
const isFavorited = computed(() => {
  if (!product.value) return false
  return favoriteStore.items.some(f => f.id === product.value.id)
})

// 从 SKU 中提取颜色和规格分组
const skuGroups = computed(() => {
  if (!product.value?.skus?.length) return {}
  const colors = [...new Set(product.value.skus.map(s => s.color).filter(Boolean))]
  const sizes = [...new Set(product.value.skus.map(s => s.size).filter(Boolean))]
  return { color: colors.length ? colors : null, size: sizes.length ? sizes : null }
})

// 颜色名称转十六进制（简化映射）
function colorToHex(color) {
  const map = {
    '深空黑': '#1a1a1a', '银色': '#c0c0c0', '午夜色': '#1e2235', '星光色': '#f5e9d8',
    '原色钛金属': '#c8beb4', '白色钛金属': '#e8e4df', '钛灰': '#8a8a8a', '钛紫': '#7d6a8a',
    '黑色': '#333333', '白色': '#ffffff', '灰色': '#808080', '蓝色': '#4A90D9',
    '红色': '#EF4444', '金色': '#D4AF37', '棕色': '#8B6914', '米白': '#F5F0E6',
    '墨绿': '#2d5a27', '浅蓝': '#ADD8E6', '铂金银': '#e5e4e2', '石墨黑': '#2c2c2c',
    '曜石黑': '#0d0d0d', '陶瓷白': '#f0f0f0', '罗兰紫': '#7B2D8E', '羽砂黑': '#2f2f2f',
    '海阔天空': '#4A90D9', '大漠银月': '#D4C5A9', '日蚀灰': '#3a3a3a', '月光银': '#d8d8d8',
    '香槟金': '#F7E7CE', '灰色': '#808080', '黑白': '#2f2f2f', '白蓝': '#e8f0fe',
    '全黑': '#000000', '绿色': '#22C55E',
  }
  return map[color] || '#ddd'
}

// 数量输入处理
function onQtyInput(e) {
  const val = parseInt(e.target.value)
  if (!isNaN(val) && val >= 1 && val <= 99) {
    quantity.value = val
  }
}

function loadProduct() {
  const id = route.params.id
  product.value = getProductById(id)
  if (product.value) {
    selectedColor.value = skuGroups.value.color?.[0] || ''
    selectedSize.value = skuGroups.value.size?.[0] || ''
    quantity.value = 1
    favoriteStore.loadFavorites()
    recordBrowseHistory()
  }
}

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

function toggleFavorite() {
  if (!userStore.isLoggedIn) { showLoginModal.value = true; return }
  favoriteStore.toggleFavorite(product.value)
}

function addToCart() {
  if (!product.value) return
  if (!userStore.isLoggedIn) { showLoginModal.value = true; return }
  cartStore.addItem(product.value, { color: selectedColor.value, size: selectedSize.value }, quantity.value)
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 1500)
}

function buyNow() {
  if (!product.value) return
  if (!userStore.isLoggedIn) { showLoginModal.value = true; return }
  cartStore.addItem(product.value, { color: selectedColor.value, size: selectedSize.value }, quantity.value)
  router.push('/cart')
}

function goBack() {
  router.back()
}

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

/* ===== 返回按钮 ===== */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  margin-bottom: 12px;
  border: 1.5px solid var(--gray-200, #edeef2);
  border-radius: 20px;
  background: var(--color-white, #fff);
  color: var(--gray-600, #6B7280);
  font-size: 13px;
  cursor: pointer;
  transition: all var(--transition-fast, 0.15s);
  font-family: inherit;
}
.back-btn:hover {
  border-color: var(--color-primary, #FF6B35);
  color: var(--color-primary, #FF6B35);
}
.back-btn svg {
  width: 16px;
  height: 16px;
}

/* ===== 主布局 ===== */
.detail-layout {
  display: flex;
  gap: 40px;
  background: var(--color-white, #fff);
  border-radius: var(--radius-md, 10px);
  padding: var(--space-8, 32px);
  box-shadow: var(--shadow-card, 0 2px 12px rgba(0,0,0,0.04));
  border: 1px solid var(--color-border-light, #f3f4f6);
}

.detail-img {
  width: 420px;
  min-width: 420px;
  flex-shrink: 0;
}

.detail-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* ===== 标题区 ===== */
.detail-header {
  margin-bottom: var(--space-5, 20px);
}

.detail-tags {
  display: flex;
  gap: 8px;
  margin-bottom: var(--space-3, 12px);
}

.tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.tag-hot {
  background: var(--color-primary-lighter, #FFF0E8);
  color: var(--color-primary, #FF6B35);
}

.tag-sales {
  background: var(--gray-100, #f7f8fa);
  color: var(--gray-500, #8B909A);
}

.detail-name {
  font-size: 22px;
  font-weight: var(--weight-semibold, 600);
  color: var(--gray-900, #1F2937);
  margin: 0 0 var(--space-2, 8px);
  line-height: 1.3;
}

.detail-desc {
  font-size: 14px;
  color: var(--gray-500, #8B909A);
  margin: 0;
  line-height: 1.6;
}

/* ===== 价格 ===== */
.detail-price {
  background: var(--color-primary-lighter, #FFF0E8);
  padding: 16px 20px;
  border-radius: var(--radius-sm, 6px);
  margin-bottom: var(--space-6, 24px);
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.price-symbol {
  font-size: 18px;
  color: var(--color-primary, #FF6B35);
  font-weight: 500;
}

.price-value {
  font-size: 32px;
  color: var(--color-primary, #FF6B35);
  font-weight: 700;
  letter-spacing: -1px;
}

.price-original {
  font-size: 15px;
  color: var(--gray-400, #b0b5bd);
  text-decoration: line-through;
  margin-left: 8px;
}

/* ===== SKU ===== */
.detail-skus {
  margin-bottom: var(--space-5, 20px);
}

.sku-section {
  margin-bottom: var(--space-4, 16px);
}

.sku-section h4 {
  font-size: 14px;
  color: var(--gray-600, #6B7280);
  margin: 0 0 var(--space-3, 12px);
  font-weight: 500;
}

.sku-section h4 span {
  color: var(--gray-900, #1F2937);
  font-weight: 600;
}

.sku-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.sku-options button {
  padding: 8px 18px;
  border: 1.5px solid var(--gray-200, #edeef2);
  border-radius: var(--radius-sm, 6px);
  background: var(--color-white, #fff);
  font-size: 14px;
  color: var(--gray-700, #4B5563);
  transition: all var(--transition-fast, 0.15s);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: inherit;
}

.sku-options button:hover {
  border-color: var(--color-primary, #FF6B35);
  color: var(--color-primary, #FF6B35);
  background: var(--color-primary-lighter, #FFF0E8);
}

.sku-options button.active {
  border-color: var(--color-primary, #FF6B35);
  color: var(--color-primary, #FF6B35);
  background: var(--color-primary-lighter, #FFF0E8);
  box-shadow: 0 0 0 1px var(--color-primary, #FF6B35);
}

.sku-swatch {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.1);
  flex-shrink: 0;
}

/* ===== 数量 ===== */
.quantity-section {
  margin-bottom: var(--space-6, 24px);
}

.quantity-section h4 {
  font-size: 14px;
  color: var(--gray-600, #6B7280);
  margin: 0 0 var(--space-3, 12px);
  font-weight: 500;
}

.quantity-ctrl {
  display: inline-flex;
  align-items: center;
  border: 1.5px solid var(--gray-200, #edeef2);
  border-radius: var(--radius-sm, 6px);
  overflow: hidden;
}

.quantity-ctrl button {
  width: 38px;
  height: 38px;
  border: none;
  background: var(--gray-100, #f7f8fa);
  font-size: 18px;
  color: var(--gray-700, #4B5563);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast, 0.15s);
  font-family: inherit;
}

.quantity-ctrl button:hover:not(:disabled) {
  background: var(--gray-200, #edeef2);
}

.quantity-ctrl button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.quantity-ctrl input {
  width: 56px;
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  border: none;
  outline: none;
  color: var(--gray-900, #1F2937);
  font-family: inherit;
}

/* ===== 操作按钮 ===== */
.action-bar {
  display: flex;
  gap: 12px;
}

.btn-cart {
  flex: 1;
  height: 50px;
  border: 2px solid var(--color-primary, #FF6B35);
  border-radius: 25px;
  background: var(--color-white, #fff);
  color: var(--color-primary, #FF6B35);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base, 0.2s);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
}

.btn-cart:hover {
  background: var(--color-primary-lighter, #FFF0E8);
  transform: translateY(-1px);
}

.btn-buy {
  flex: 1;
  height: 50px;
  border: none;
  border-radius: 25px;
  background: var(--color-primary, #FF6B35);
  color: var(--color-white, #fff);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base, 0.2s);
  box-shadow: 0 4px 14px rgba(255, 107, 53, 0.35);
  font-family: inherit;
}

.btn-buy:hover {
  background: var(--color-primary-dark, #E55A2B);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.45);
}

.btn-favorite {
  width: 50px;
  height: 50px;
  border: 1.5px solid var(--gray-200, #edeef2);
  border-radius: 50%;
  background: var(--color-white, #fff);
  font-size: 20px;
  cursor: pointer;
  transition: all var(--transition-fast, 0.15s);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.btn-favorite:hover {
  border-color: var(--color-primary, #FF6B35);
  background: var(--color-primary-lighter, #FFF0E8);
}

.btn-favorite.active {
  border-color: var(--color-primary, #FF6B35);
  background: var(--color-primary-lighter, #FFF0E8);
}

/* ===== Toast ===== */
.toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--gray-900, #1F2937);
  color: var(--color-white, #fff);
  padding: 12px 28px;
  border-radius: var(--radius-sm, 6px);
  font-size: 15px;
  z-index: 999;
  box-shadow: var(--shadow-lg, 0 10px 40px rgba(0,0,0,0.08));
  display: flex;
  align-items: center;
  gap: 8px;
}

.toast svg {
  color: var(--color-success, #22C55E);
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

/* ===== Modal 按钮 ===== */
.btn-cancel {
  padding: 8px 24px;
  border: 1px solid var(--gray-200, #edeef2);
  border-radius: 20px;
  background: var(--color-white, #fff);
  color: var(--gray-600, #6B7280);
  font-size: 14px;
  cursor: pointer;
  font-family: inherit;
  transition: all var(--transition-fast, 0.15s);
}

.btn-cancel:hover {
  border-color: var(--gray-300, #d0d5dd);
}

.btn-confirm {
  padding: 8px 24px;
  border: none;
  border-radius: 20px;
  background: var(--color-primary, #FF6B35);
  color: var(--color-white, #fff);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
  font-family: inherit;
}

.btn-confirm:hover {
  background: var(--color-primary-dark, #E55A2B);
}

/* ===== 空状态 ===== */
.empty {
  text-align: center;
  padding: 80px 20px;
  color: var(--gray-500, #8B909A);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty p {
  font-size: 16px;
  margin-bottom: 20px;
}

.btn-back {
  padding: 10px 28px;
  border: 1.5px solid var(--gray-300, #d0d5dd);
  border-radius: 24px;
  background: var(--color-white, #fff);
  color: var(--gray-700, #4B5563);
  font-size: 15px;
  cursor: pointer;
  font-family: inherit;
  transition: all var(--transition-fast, 0.15s);
}

.btn-back:hover {
  border-color: var(--color-primary, #FF6B35);
  color: var(--color-primary, #FF6B35);
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .detail-layout {
    flex-direction: column;
    padding: var(--space-5, 20px);
    gap: 20px;
  }
  .detail-img {
    width: 100%;
    min-width: auto;
  }
  .detail-name {
    font-size: 18px;
  }
  .action-bar {
    position: fixed;
    bottom: 56px;
    left: 0;
    right: 0;
    padding: 12px 16px;
    background: var(--color-white, #fff);
    box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
    z-index: 50;
    gap: 10px;
  }
  .btn-cart, .btn-buy {
    height: 44px;
    font-size: 14px;
  }
  .btn-favorite {
    width: 44px;
    height: 44px;
  }
}
</style>
