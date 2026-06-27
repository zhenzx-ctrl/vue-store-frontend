<template>
  <div class="cart-page">
    <h2 class="page-title">🛒 我的购物车</h2>

    <!-- 有商品 -->
    <template v-if="cartStore.items.length">
      <div class="cart-header">
        <label class="select-all" @click="cartStore.toggleSelectAll()">
          <span class="checkbox" :class="{ checked: cartStore.isAllSelected }">✓</span>
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
            <span class="checkbox" :class="{ checked: item.selected }">✓</span>
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
            <button @click="cartStore.updateQuantity(item.skuKey, item.productId, item.quantity - 1)">−</button>
            <span>{{ item.quantity }}</span>
            <button @click="cartStore.updateQuantity(item.skuKey, item.productId, item.quantity + 1)">+</button>
          </div>
          <span class="item-total">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
          <button class="item-remove" @click="cartStore.removeItem(item.skuKey, item.productId)">删除</button>
        </div>
      </div>

      <!-- 失效商品 -->
      <div v-if="cartStore.invalidItems.length" class="invalid-section">
        <div class="invalid-header">
          <span class="invalid-title">失效商品</span>
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
        <div class="footer-left">
          <label class="select-all" @click="cartStore.toggleSelectAll()">
            <span class="checkbox" :class="{ checked: cartStore.isAllSelected }">✓</span>
            全选
          </label>
          <button v-if="cartStore.selectedItems.length" class="btn-remove-selected" @click="cartStore.clearSelected()">
            删除选中 ({{ cartStore.selectedItems.length }})
          </button>
        </div>
        <div class="footer-right">
          <div class="total-info">
            已选 <strong>{{ cartStore.selectedItems.length }}</strong> 件，合计：
            <span class="total-price">¥{{ selectedTotal.toFixed(2) }}</span>
          </div>
          <button class="btn-checkout" :disabled="cartStore.selectedItems.length === 0" @click="openCheckout">
            结算
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

const selectedTotal = computed(() =>
  cartStore.selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

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
  margin: 0 0 24px;
  color: #333;
}

.cart-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px 8px 0 0;
  font-size: 13px;
  color: #999;
  border-bottom: 1px solid #f0f0f0;
}

.select-all {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  color: #333;
  min-width: 80px;
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: transparent;
  transition: all 0.2s;
  flex-shrink: 0;
}

.checkbox.checked {
  background: #e4393c;
  border-color: #e4393c;
  color: #fff;
}

.col-name { flex: 1; padding-left: 16px; }
.col-price { width: 100px; text-align: center; }
.col-qty { width: 120px; text-align: center; }
.col-total { width: 100px; text-align: center; }
.col-action { width: 60px; text-align: center; }

.cart-list { background: #fff; }

.cart-item {
  display: flex;
  align-items: center;
  padding: 20px 16px;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.2s;
}

.cart-item:hover { background: #fafafa; }
.cart-item:last-child { border-bottom: none; }
.cart-item.invalid { opacity: 0.5; background: #fafafa; }

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
}

.item-img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
  flex-shrink: 0;
}

.item-text {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  text-decoration: none;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-name:hover { color: #e4393c; }
.item-name.disabled { color: #999; text-decoration: line-through; }

.item-sku {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

.item-price {
  width: 100px;
  text-align: center;
  font-size: 15px;
  color: #333;
}

.item-price.disabled { text-decoration: line-through; color: #999; }

.item-qty-text {
  width: 120px;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.item-qty {
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}

.item-qty button {
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f5;
  font-size: 16px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-qty button:hover { background: #eee; }

.item-qty span {
  width: 40px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
}

.item-total {
  width: 100px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #e4393c;
}

.item-total.disabled { color: #999; text-decoration: line-through; }

.item-remove {
  width: 60px;
  text-align: center;
  background: none;
  border: none;
  color: #999;
  font-size: 14px;
}

.item-remove:hover { color: #e4393c; }

.invalid-section {
  margin-top: 12px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.invalid-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.invalid-title { font-size: 14px; color: #999; font-weight: 500; }

.invalid-tag {
  background: #f5f5f5;
  color: #999;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  min-width: 48px;
  text-align: center;
}

.btn-clear-invalid {
  border: none;
  background: none;
  color: #e4393c;
  font-size: 13px;
  cursor: pointer;
}

.btn-clear-invalid:hover { text-decoration: underline; }

.cart-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #fff;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);
  position: sticky;
  bottom: 0;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.btn-remove-selected {
  padding: 6px 16px;
  border: 1px solid #ddd;
  border-radius: 16px;
  background: #fff;
  font-size: 13px;
  color: #999;
}

.btn-remove-selected:hover {
  border-color: #e4393c;
  color: #e4393c;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.total-info { font-size: 14px; color: #666; }

.total-price {
  font-size: 22px;
  font-weight: 700;
  color: #e4393c;
  margin-left: 4px;
}

.btn-checkout {
  padding: 10px 40px;
  border: none;
  border-radius: 24px;
  background: #e4393c;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-checkout:hover:not(:disabled) { background: #c1272d; }
.btn-checkout:disabled { opacity: 0.4; cursor: not-allowed; }

@media (max-width: 768px) {
  .cart-header { display: none; }
  .cart-item { flex-wrap: wrap; gap: 10px; }
}
</style>
