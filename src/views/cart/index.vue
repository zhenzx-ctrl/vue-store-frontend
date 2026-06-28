<template>
  <div class="cart-page">
    <h2 class="page-title">🛒 我的购物车</h2>

    <!-- 有商品 -->
    <template v-if="cartStore.items.length">
      <div class="cart-header">
        <label class="select-all" @click="cartStore.toggleSelectAll()">
          <span class="checkbox" :class="{ checked: cartStore.isAllSelected }">
            <svg v-if="cartStore.isAllSelected" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
          全选
        </label>
        <span class="col-name">商品信息</span>
        <span class="col-price">单价</span>
        <span class="col-qty">数量</span>
        <span class="col-total">小计</span>
        <span class="col-action">操作</span>
      </div>

      <!-- 有效商品 -->
      <div class="cart-list">
        <div
          v-for="item in cartStore.validItems"
          :key="item.productId + '-' + item.skuKey"
          class="cart-item"
        >
          <label class="item-select" @click="cartStore.toggleSelect(item.skuKey, item.productId)">
            <span class="checkbox" :class="{ checked: item.selected }">
              <svg v-if="item.selected" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
          </label>
          <div class="item-info">
            <div class="item-img">
              <ImageLazy :src="item.image" :fallback-text="item.name.slice(0, 2)" />
            </div>
            <div class="item-text">
              <router-link :to="`/product/${item.productId}`" class="item-name">{{ item.name }}</router-link>
              <p v-if="item.sku" class="item-sku">
                <span v-if="item.sku.color">{{ item.sku.color }}</span>
                <span v-if="item.sku.size"> / {{ item.sku.size }}</span>
              </p>
            </div>
          </div>
          <span class="item-price">¥{{ item.price.toFixed(2) }}</span>
          <div class="item-qty">
            <button @click="cartStore.updateQuantity(item.skuKey, item.productId, item.quantity - 1)" :disabled="item.quantity <= 1">−</button>
            <span>{{ item.quantity }}</span>
            <button @click="cartStore.updateQuantity(item.skuKey, item.productId, item.quantity + 1)" :disabled="item.quantity >= 99">+</button>
          </div>
          <span class="item-total">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
          <button class="item-remove" @click="cartStore.removeItem(item.skuKey, item.productId)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>

      <!-- 失效商品 -->
      <div v-if="cartStore.invalidItems.length" class="invalid-section">
        <div class="invalid-header">
          <span class="invalid-title">⚠️ 失效商品（{{ cartStore.invalidItems.length }} 件）</span>
          <button class="btn-clear-invalid" @click="cartStore.removeInvalidItems()">清空失效商品</button>
        </div>
        <div
          v-for="item in cartStore.invalidItems"
          :key="'inv-' + item.productId + '-' + item.skuKey"
          class="cart-item invalid"
        >
          <span class="invalid-tag">已失效</span>
          <div class="item-info">
            <div class="item-img"><ImageLazy :src="item.image" :fallback-text="item.name.slice(0, 2)" /></div>
            <div class="item-text">
              <span class="item-name disabled">{{ item.name }}</span>
            </div>
          </div>
          <span class="item-price disabled">¥{{ item.price.toFixed(2) }}</span>
          <span class="item-qty-text">×{{ item.quantity }}</span>
          <span class="item-total disabled">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
          <button class="item-remove" @click="cartStore.removeItem(item.skuKey, item.productId)">删除</button>
        </div>
      </div>

      <!-- 底部结算栏 -->
      <div class="cart-footer">
        <div class="footer-summary">
          <div class="summary-amount">
            <span>合计</span>
            <span class="total-price">¥{{ (selectedTotal + shippingFee).toFixed(2) }}</span>
          </div>
          <button class="btn-checkout" :disabled="cartStore.selectedItems.length === 0" @click="openCheckout">
            去结算 <span v-if="cartStore.selectedItems.length">({{ cartStore.selectedItems.length }})</span>
          </button>
        </div>
      </div>
    </template>

    <!-- 空购物车 -->
    <Empty v-else icon="🛒" text="购物车还是空的" action-text="去逛逛" action-link="/products" />

    <!-- 结算弹窗 -->
    <CheckoutModal
      :visible="showCheckout"
      :items="cartStore.selectedItems"
      :total-price="selectedTotal"
      :shipping-fee="shippingFee"
      @close="showCheckout = false"
      @confirm="handleCheckout"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'
import { useUserStore } from '@/stores/user'
import ImageLazy from '@/components/ImageLazy.vue'
import Empty from '@/components/Empty.vue'
import CheckoutModal from './CheckoutModal.vue'

const router = useRouter()
const cartStore = useCartStore()
const orderStore = useOrderStore()
const userStore = useUserStore()

const showCheckout = ref(false)
const FREE_SHIPPING_THRESHOLD = 299 // 满299免运费
const SHIPPING_FEE = 15 // 默认运费15元

const selectedTotal = computed(() =>
  cartStore.selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

const shippingFee = computed(() => {
  const total = selectedTotal.value
  if (total === 0) return 0
  return total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
})

function openCheckout() {
  if (!cartStore.selectedItems.length) return
  if (!userStore.isLoggedIn) {
    router.push({ path: '/login', query: { redirect: '/cart' } })
    return
  }
  showCheckout.value = true
}

function handleCheckout({ address, couponId, discount, finalPrice }) {
  const items = cartStore.selectedItems.map(item => ({ ...item }))
  orderStore.createOrder(items, finalPrice, address, userStore.userInfo?.id)
  cartStore.clearSelected()
  showCheckout.value = false
  router.push('/orders')
}
</script>

<style scoped>
.page-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 var(--space-6, 24px);
  color: var(--gray-900, #1F2937);
}

/* ===== 表头 ===== */
.cart-header {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  background: var(--color-white, #fff);
  border-radius: var(--radius-sm, 6px) var(--radius-sm, 6px) 0 0;
  font-size: 13px;
  color: var(--gray-500, #8B909A);
  border-bottom: 1px solid var(--gray-200, #edeef2);
  font-weight: 500;
}

.select-all {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  color: var(--gray-700, #4B5563);
  min-width: 80px;
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--gray-300, #d0d5dd);
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.checkbox.checked {
  background: var(--color-primary, #FF6B35);
  border-color: var(--color-primary, #FF6B35);
}

.col-name { flex: 1; padding-left: 16px; }
.col-price { display: none; }
.col-qty { width: 110px; text-align: center; }
.col-total { width: 90px; text-align: center; }
.col-action { width: 40px; text-align: center; }

/* ===== 商品列表 ===== */
.cart-list {
  background: var(--color-white, #fff);
  border-radius: 0 0 var(--radius-sm, 6px) var(--radius-sm, 6px);
  overflow: hidden;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--gray-100, #f7f8fa);
  transition: background 0.2s;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item:hover {
  background: var(--gray-100, #f7f8fa);
}

.cart-item.invalid {
  opacity: 0.55;
  background: var(--gray-100, #f7f8fa);
}

.item-select {
  cursor: pointer;
  min-width: 48px;
  display: flex;
  justify-content: center;
}

.item-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  padding-left: 16px;
  min-width: 0;
}

.item-img {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-sm, 6px);
  overflow: hidden;
  background: var(--gray-100, #f7f8fa);
  flex-shrink: 0;
}

.item-text {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--gray-800, #374151);
  text-decoration: none;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color var(--transition-fast, 0.15s);
}

.item-name:hover {
  color: var(--color-primary, #FF6B35);
}

.item-name.disabled {
  color: var(--gray-400, #b0b5bd);
  text-decoration: line-through;
}

.item-sku {
  font-size: 13px;
  color: var(--gray-400, #b0b5bd);
  margin-top: 4px;
}

.item-price {
  display: none;
}

.item-price.disabled {
  text-decoration: line-through;
  color: var(--gray-400, #b0b5bd);
}

.item-qty-text {
  width: 130px;
  text-align: center;
  font-size: 14px;
  color: var(--gray-500, #8B909A);
}

.item-qty {
  width: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--gray-200, #edeef2);
  border-radius: var(--radius-sm, 6px);
  overflow: hidden;
}

.item-qty button {
  width: 34px;
  height: 34px;
  border: none;
  background: var(--gray-100, #f7f8fa);
  font-size: 16px;
  color: var(--gray-700, #4B5563);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background var(--transition-fast, 0.15s);
  font-family: inherit;
}

.item-qty button:hover:not(:disabled) {
  background: var(--gray-200, #edeef2);
}

.item-qty button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.item-qty span {
  width: 42px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-900, #1F2937);
}

.item-total {
  width: 90px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary, #FF6B35);
}

.item-total.disabled {
  color: var(--gray-400, #b0b5bd);
  text-decoration: line-through;
}

.item-remove {
  width: 50px;
  text-align: center;
  background: none;
  border: none;
  color: var(--gray-400, #b0b5bd);
  font-size: 14px;
  cursor: pointer;
  transition: color var(--transition-fast, 0.15s);
  padding: 4px;
}

.item-remove:hover {
  color: var(--color-danger, #EF4444);
}

/* ===== 失效商品 ===== */
.invalid-section {
  margin-top: 12px;
  background: var(--color-white, #fff);
  border-radius: var(--radius-sm, 6px);
  overflow: hidden;
  box-shadow: var(--shadow-card, 0 2px 12px rgba(0,0,0,0.04));
}

.invalid-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: var(--gray-100, #f7f8fa);
  border-bottom: 1px solid var(--gray-200, #edeef2);
}

.invalid-title {
  font-size: 14px;
  color: var(--gray-600, #6B7280);
  font-weight: 500;
}

.invalid-tag {
  background: var(--gray-200, #edeef2);
  color: var(--gray-500, #8B909A);
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  min-width: 48px;
  text-align: center;
}

.btn-clear-invalid {
  border: none;
  background: none;
  color: var(--color-primary, #FF6B35);
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background var(--transition-fast, 0.15s);
}

.btn-clear-invalid:hover {
  background: var(--color-primary-lighter, #FFF0E8);
}

/* ===== 底部结算栏 ===== */
.cart-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  background: var(--color-white, #fff);
  border-radius: var(--radius-sm, 6px);
  box-shadow: var(--shadow-md, 0 4px 16px rgba(0,0,0,0.06));
  margin-top: 16px;
}

.footer-summary {
  display: flex;
  align-items: center;
  gap: 24px;
}

.summary-amount {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 14px;
  color: var(--gray-900, #1F2937);
  font-weight: 600;
  white-space: nowrap;
}

.total-price {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary, #FF6B35);
}

.btn-checkout {
  padding: 12px 48px;
  border: none;
  border-radius: 25px;
  background: var(--color-primary, #FF6B35);
  color: var(--color-white, #fff);
  font-size: 16px;
  font-weight: 600;
  transition: all var(--transition-base, 0.2s);
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(255, 107, 53, 0.3);
  font-family: inherit;
  white-space: nowrap;
}

.btn-checkout:hover:not(:disabled) {
  background: var(--color-primary-dark, #E55A2B);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
}

.btn-checkout:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .cart-header {
    display: none;
  }
  .cart-item {
    padding: 12px 12px 12px 48px;
    position: relative;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
  }
  .item-select {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    min-width: auto;
    width: 24px;
  }
  .item-select .checkbox {
    width: 18px;
    height: 18px;
  }
  .item-info {
    padding-left: 0;
    gap: 10px;
    flex: none;
    width: calc(100% - 76px);
    min-width: 0;
  }
  .item-img {
    width: 56px;
    height: 56px;
  }
  .item-name {
    font-size: 13px;
  }
  .item-text {
    min-width: 0;
  }
  .item-sku {
    font-size: 11px;
  }
  .item-price {
    display: none;
  }
  .item-total {
    order: 2;
    width: auto;
    font-size: 14px;
    padding-right: 0;
    white-space: nowrap;
    text-align: right;
    flex-shrink: 0;
  }
  .item-remove {
    order: 3;
    width: auto;
    padding: 4px 12px;
    font-size: 12px;
    margin-left: auto;
    color: var(--gray-400, #b0b5bd);
  }
  .item-qty {
    order: 4;
    width: auto;
    justify-content: center;
    border: 1px solid var(--gray-200, #edeef2);
    border-radius: 4px;
    gap: 0;
    overflow: hidden;
    flex-shrink: 0;
  }
  .item-qty button {
    width: 22px;
    height: 22px;
    font-size: 12px;
    border: none;
    background: var(--color-white, #fff);
    color: var(--gray-600, #6B7280);
  }
  .item-qty span {
    width: 26px;
    font-size: 12px;
    height: 22px;
    line-height: 22px;
    border-left: 1px solid var(--gray-200, #edeef2);
    border-right: 1px solid var(--gray-200, #edeef2);
  }
  .cart-footer {
    justify-content: center;
    padding: 12px 16px;
  }
  .footer-summary {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    gap: 12px;
  }
  .summary-amount {
    font-size: 13px;
    gap: 4px;
  }
  .total-price {
    font-size: 18px;
  }
  .btn-checkout {
    padding: 10px 20px;
    font-size: 14px;
    width: auto;
  }
}
</style>
