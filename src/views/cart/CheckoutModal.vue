<template>
  <Modal :visible="visible" title="确认订单" width="600px" @close="$emit('close')">
    <div class="checkout">
      <!-- 收货地址 -->
      <div class="checkout-section">
        <h4>收货地址</h4>
        <div v-if="selectedAddress" class="selected-address">
          <p><strong>{{ selectedAddress.name }}</strong> {{ selectedAddress.phone }}</p>
          <p>{{ selectedAddress.province }}{{ selectedAddress.city }}{{ selectedAddress.district }}{{ selectedAddress.detail }}</p>
          <button class="btn-change-addr" @click="showAddressPicker = true">更换地址</button>
        </div>
        <div v-else>
          <button class="btn-add-addr" @click="showAddressPicker = true">+ 添加收货地址</button>
        </div>

        <!-- 地址选择弹窗 -->
        <Modal :visible="showAddressPicker" title="选择收货地址" width="480px" @close="showAddressPicker = false">
          <AddressPicker v-model="addressForm" />
          <template #footer>
            <button class="btn-cancel" @click="showAddressPicker = false">取消</button>
            <button class="btn-confirm" @click="confirmAddress">确定</button>
          </template>
        </Modal>
      </div>

      <!-- 优惠券 -->
      <div class="checkout-section">
        <h4>优惠券</h4>
        <select v-model="selectedCouponId" class="coupon-select">
          <option value="">不使用优惠券</option>
          <option
            v-for="coupon in availableCoupons"
            :key="coupon.id"
            :value="coupon.id"
          >{{ coupon.name }} - 满{{ coupon.minSpend }}减{{ coupon.discount }}</option>
        </select>
      </div>

      <!-- 商品清单 -->
      <div class="checkout-section">
        <h4>商品清单</h4>
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

      <!-- 合计 -->
      <div class="checkout-total">
        <div v-if="discountAmount > 0" class="discount-row">
          <span>优惠券抵扣</span>
          <span class="discount-amount">-¥{{ discountAmount.toFixed(2) }}</span>
        </div>
        <div class="total-row">
          <span>合计</span>
          <span class="total-price">¥{{ finalPrice.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <button class="btn-cancel" @click="$emit('close')">取消</button>
      <button class="btn-confirm" @click="confirmOrder" :disabled="!selectedAddress">提交订单</button>
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
})

const emit = defineEmits(['close', 'confirm'])

const showAddressPicker = ref(false)
const addressForm = ref({})
const selectedAddress = ref(null)
const selectedCouponId = ref('')

// 获取可用优惠券
const availableCoupons = computed(() => {
  const coupons = getCoupons()
  return coupons.filter(c => !c.used && props.totalPrice >= c.minSpend)
})

// 优惠金额
const discountAmount = computed(() => {
  if (!selectedCouponId.value) return 0
  const coupon = availableCoupons.value.find(c => c.id === Number(selectedCouponId.value))
  return coupon ? coupon.discount : 0
})

// 最终价格
const finalPrice = computed(() => Math.max(0, props.totalPrice - discountAmount.value))

// 确认地址
function confirmAddress() {
  if (!addressForm.value.province || !addressForm.value.name || !addressForm.value.phone) {
    alert('请填写完整的收货信息')
    return
  }
  selectedAddress.value = { ...addressForm.value }
  showAddressPicker.value = false
}

// 提交订单
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

.checkout-section h4 {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px;
}

/* 地址 */
.selected-address {
  background: #f5f5f5;
  padding: 12px 16px;
  border-radius: 8px;
  position: relative;
}

.selected-address p {
  margin: 0 0 4px;
  font-size: 14px;
  color: #333;
}

.btn-change-addr {
  position: absolute;
  top: 12px;
  right: 12px;
  border: none;
  background: none;
  color: #e4393c;
  font-size: 13px;
  cursor: pointer;
}

.btn-add-addr {
  padding: 10px 20px;
  border: 1px dashed #ddd;
  border-radius: 8px;
  background: #fafafa;
  color: #999;
  font-size: 14px;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-addr:hover {
  border-color: #e4393c;
  color: #e4393c;
}

/* 优惠券 */
.coupon-select {
  width: 100%;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  color: #333;
  outline: none;
}

.coupon-select:focus {
  border-color: #e4393c;
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
  border-bottom: 1px solid #f5f5f5;
}

.checkout-item:last-child {
  border-bottom: none;
}

.item-img {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  overflow: hidden;
  background: #f5f5f5;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  margin-left: 10px;
  min-width: 0;
}

.item-name {
  font-size: 14px;
  color: #333;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-sku {
  font-size: 12px;
  color: #999;
}

.item-qty {
  width: 40px;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.item-price {
  width: 80px;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: #e4393c;
}

/* 合计 */
.checkout-total {
  background: #fafafa;
  padding: 16px;
  border-radius: 8px;
}

.discount-row,
.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
}

.discount-row {
  margin-bottom: 8px;
}

.discount-amount {
  color: #67c23a;
}

.total-price {
  font-size: 22px;
  font-weight: 700;
  color: #e4393c;
}

/* 按钮 */
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

.btn-confirm:hover:not(:disabled) {
  background: #c1272d;
}

.btn-confirm:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
