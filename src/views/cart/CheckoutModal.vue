<template>
  <Modal :visible="visible" title="确认订单" width="640px" @close="$emit('close')">
    <div class="checkout">
      <!-- 收货地址 -->
      <div class="checkout-section">
        <div class="section-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          收货地址
        </div>
        <div v-if="selectedAddress" class="selected-address">
          <div class="address-info">
            <p class="address-name"><strong>{{ selectedAddress.name }}</strong> <span>{{ selectedAddress.phone }}</span></p>
            <p class="address-detail">{{ selectedAddress.province }}{{ selectedAddress.city }}{{ selectedAddress.district }}{{ selectedAddress.detail }}</p>
          </div>
          <button class="btn-change-addr" @click="showAddressPicker = true">更换</button>
        </div>
        <div v-else>
          <button class="btn-add-addr" @click="showAddressPicker = true">+ 添加收货地址</button>
        </div>
      </div>

      <!-- 优惠券 -->
      <div class="checkout-section">
        <div class="section-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg>
          优惠券
        </div>
        <div class="coupon-selector">
          <select v-model="selectedCouponId" class="coupon-select">
            <option value="">不使用优惠券</option>
            <option
              v-for="coupon in availableCoupons"
              :key="coupon.id"
              :value="coupon.id"
            >{{ coupon.name }} - 满{{ coupon.minSpend }}减{{ coupon.discount }}</option>
          </select>
        </div>
      </div>

      <!-- 商品清单 -->
      <div class="checkout-section">
        <div class="section-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>
          商品清单
        </div>
        <div class="checkout-items">
          <div v-for="item in items" :key="item.productId + '-' + item.skuKey" class="checkout-item">
            <div class="item-img">
              <ImageLazy :src="item.image" :fallback-text="item.name.slice(0, 2)" />
            </div>
            <div class="item-info">
              <span class="item-name">{{ item.name }}</span>
              <span v-if="item.sku" class="item-sku">
                {{ item.sku.color || '' }}{{ item.sku.color && item.sku.size ? ' / ' : '' }}{{ item.sku.size || '' }}
              </span>
            </div>
            <span class="item-qty">×{{ item.quantity }}</span>
            <span class="item-price">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- 金额明细 -->
      <div class="checkout-total">
        <div class="total-row">
          <span>商品金额</span>
          <span>¥{{ totalPrice.toFixed(2) }}</span>
        </div>
        <div class="total-row">
          <span>运费</span>
          <span>{{ shippingFee > 0 ? '¥' + shippingFee.toFixed(2) : '免运费' }}</span>
        </div>
        <div v-if="discountAmount > 0" class="total-row discount">
          <span>优惠券抵扣</span>
          <span class="discount-amount">-¥{{ discountAmount.toFixed(2) }}</span>
        </div>
        <div class="total-divider"></div>
        <div class="total-row grand">
          <span>合计</span>
          <span class="grand-price">¥{{ finalPrice.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <button class="btn-cancel" @click="$emit('close')">取消</button>
      <button class="btn-confirm" @click="confirmOrder" :disabled="!selectedAddress">
        提交订单
      </button>
    </template>
  </Modal>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getCoupons } from '@/api/product'
import { getStorage } from '@/utils/storage'
import Modal from '@/components/Modal.vue'
import AddressPicker from '@/components/AddressPicker.vue'
import ImageLazy from '@/components/ImageLazy.vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  items: { type: Array, default: () => [] },
  totalPrice: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
})

const emit = defineEmits(['close', 'confirm'])

const showAddressPicker = ref(false)
const addressForm = ref({})
const selectedAddress = ref(null)
const selectedCouponId = ref('')

const availableCoupons = computed(() => {
  const coupons = getCoupons()
  return coupons.filter(c => !c.used && props.totalPrice >= c.minSpend)
})

const discountAmount = computed(() => {
  if (!selectedCouponId.value) return 0
  const coupon = availableCoupons.value.find(c => c.id === Number(selectedCouponId.value))
  return coupon ? coupon.discount : 0
})

const finalPrice = computed(() => Math.max(0, props.totalPrice + props.shippingFee - discountAmount.value))

function confirmAddress() {
  if (!addressForm.value.province || !addressForm.value.name || !addressForm.value.phone) {
    alert('请填写完整的收货信息')
    return
  }
  selectedAddress.value = { ...addressForm.value }
  showAddressPicker.value = false
}

function confirmOrder() {
  if (!selectedAddress.value) {
    alert('请选择收货地址')
    return
  }
  emit('confirm', {
    address: selectedAddress.value,
    couponId: selectedCouponId.value ? Number(selectedCouponId.value) : null,
    discount: discountAmount.value,
    finalPrice: finalPrice.value,
  })
}
</script>

<style scoped>
.checkout {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.checkout-section {
  border: 1px solid var(--gray-200, #edeef2);
  border-radius: var(--radius-sm, 6px);
  padding: var(--space-4, 16px);
}

.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-900, #1F2937);
  margin-bottom: 12px;
}

.section-label svg {
  color: var(--color-primary, #FF6B35);
}

/* 地址 */
.selected-address {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.address-info {
  flex: 1;
}

.address-name {
  margin: 0 0 4px;
  font-size: 14px;
  color: var(--gray-800, #374151);
}

.address-name span {
  font-weight: 400;
  color: var(--gray-500, #8B909A);
  margin-left: 8px;
}

.address-detail {
  margin: 0;
  font-size: 13px;
  color: var(--gray-500, #8B909A);
}

.btn-change-addr {
  border: none;
  background: none;
  color: var(--color-primary, #FF6B35);
  font-size: 13px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  flex-shrink: 0;
  transition: background var(--transition-fast, 0.15s);
  font-family: inherit;
}

.btn-change-addr:hover {
  background: var(--color-primary-lighter, #FFF0E8);
}

.btn-add-addr {
  padding: 10px 20px;
  border: 1.5px dashed var(--gray-300, #d0d5dd);
  border-radius: var(--radius-sm, 6px);
  background: var(--gray-100, #f7f8fa);
  color: var(--gray-500, #8B909A);
  font-size: 14px;
  width: 100%;
  cursor: pointer;
  transition: all var(--transition-fast, 0.15s);
  font-family: inherit;
}

.btn-add-addr:hover {
  border-color: var(--color-primary, #FF6B35);
  color: var(--color-primary, #FF6B35);
  background: var(--color-primary-lighter, #FFF0E8);
}

/* 优惠券 */
.coupon-selector {
  width: 100%;
}

.coupon-select {
  width: 100%;
  height: 40px;
  border: 1.5px solid var(--gray-200, #edeef2);
  border-radius: var(--radius-sm, 6px);
  padding: 0 12px;
  font-size: 14px;
  color: var(--gray-800, #374151);
  outline: none;
  background: var(--color-white, #fff);
  font-family: inherit;
  cursor: pointer;
  transition: border-color var(--transition-fast, 0.15s);
}

.coupon-select:focus {
  border-color: var(--color-primary, #FF6B35);
}

/* 商品清单 */
.checkout-items {
  max-height: 200px;
  overflow-y: auto;
}

.checkout-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--gray-100, #f7f8fa);
  gap: 12px;
}

.checkout-item:last-child {
  border-bottom: none;
}

.item-img {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm, 6px);
  overflow: hidden;
  background: var(--gray-100, #f7f8fa);
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 14px;
  color: var(--gray-800, #374151);
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-sku {
  font-size: 12px;
  color: var(--gray-400, #b0b5bd);
}

.item-qty {
  width: 40px;
  text-align: center;
  font-size: 14px;
  color: var(--gray-500, #8B909A);
}

.item-price {
  width: 80px;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary, #FF6B35);
}

/* 合计 */
.checkout-total {
  background: var(--gray-100, #f7f8fa);
  padding: var(--space-4, 16px);
  border-radius: var(--radius-sm, 6px);
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: var(--gray-600, #6B7280);
  padding: 4px 0;
}

.total-row.discount {
  color: var(--color-success, #22C55E);
}

.discount-amount {
  font-weight: 500;
}

.total-divider {
  height: 1px;
  background: var(--gray-300, #d0d5dd);
  margin: 10px 0;
}

.total-row.grand {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-900, #1F2937);
}

.grand-price {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-primary, #FF6B35);
}

/* 按钮 */
.btn-cancel {
  padding: 8px 24px;
  border: 1.5px solid var(--gray-200, #edeef2);
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
  transition: all var(--transition-fast, 0.15s);
  font-family: inherit;
}

.btn-confirm:hover:not(:disabled) {
  background: var(--color-primary-dark, #E55A2B);
  transform: translateY(-1px);
}

.btn-confirm:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
