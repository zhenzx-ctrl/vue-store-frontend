<template>
  <div class="order-page">
    <h2 class="page-title">📋 我的订单</h2>

    <!-- Tab 切换 -->
    <div class="order-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >{{ tab.label }}</button>
    </div>

    <!-- 有订单 -->
    <div v-if="filteredOrders.length" class="order-list">
      <div v-for="order in filteredOrders" :key="order.id" class="order-card">
        <!-- 订单头部 -->
        <div class="order-header">
          <div class="order-meta">
            <span class="order-id">订单号：{{ order.id }}</span>
            <span class="order-time">{{ formatTime(order.createTime) }}</span>
          </div>
          <span class="order-status" :class="statusClass(order.status)">{{ order.status }}</span>
        </div>

        <!-- 商品列表 -->
        <div class="order-items">
          <div v-for="(item, i) in order.items" :key="i" class="order-item">
            <div class="item-img">
              <ImageLazy :src="item.image" :fallback-text="item.name.slice(0, 2)" />
            </div>
            <div class="item-text">
              <span class="item-name">{{ item.name }}</span>
              <span v-if="item.sku" class="item-sku">
                {{ item.sku.color || '' }}{{ item.sku.color && item.sku.size ? ' / ' : '' }}{{ item.sku.size || '' }}
              </span>
            </div>
            <span class="item-price">¥{{ item.price.toFixed(2) }}</span>
            <span class="item-qty">×{{ item.quantity }}</span>
            <span class="item-total">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>

        <!-- 地址信息 -->
        <div v-if="order.address" class="order-address">
          📍 {{ order.address.name }} {{ order.address.phone }} {{ order.address.province }}{{ order.address.city }}{{ order.address.district }}{{ order.address.detail }}
        </div>

        <!-- 订单底部 -->
        <div class="order-footer">
          <div class="order-total">
            共 <strong>{{ order.items.reduce((s, i) => s + i.quantity, 0) }}</strong> 件商品，
            合计：<span class="total-price">¥{{ order.totalPrice.toFixed(2) }}</span>
          </div>
          <div class="order-actions">
            <button
              v-if="order.status === '待付款'"
              class="btn-cancel"
              @click="orderStore.cancelOrder(order.id)"
            >取消订单</button>
            <button
              v-if="order.status === '待付款'"
              class="btn-pay"
              @click="orderStore.payOrder(order.id)"
            >去付款</button>
            <button
              v-if="order.status === '待收货'"
              class="btn-confirm"
              @click="orderStore.confirmReceive(order.id)"
            >确认收货</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 无订单 -->
    <div v-else class="order-empty">
      <p>📦 暂无{{ activeTab === '全部' ? '' : activeTab }}订单</p>
      <router-link to="/products">
        <button class="btn-go-shop">去逛逛</button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrderStore } from '@/stores/order'
import { useUserStore } from '@/stores/user'
import { formatTime } from '@/utils'
import ImageLazy from '@/components/ImageLazy.vue'

const orderStore = useOrderStore()
const userStore = useUserStore()

const activeTab = ref('全部')

const tabs = [
  { key: '全部', label: '全部' },
  { key: '待付款', label: '待付款' },
  { key: '待发货', label: '待发货' },
  { key: '待收货', label: '待收货' },
  { key: '已完成', label: '已完成' },
]

// 按当前用户过滤 + 按Tab过滤
const filteredOrders = computed(() => {
  let list = orderStore.orders
  // 按用户过滤
  if (userStore.userInfo?.id) {
    list = list.filter(o => o.userId === userStore.userInfo.id)
  }
  // 按Tab过滤
  if (activeTab.value !== '全部') {
    list = list.filter(o => o.status === activeTab.value)
  }
  return list
})

function statusClass(status) {
  const map = {
    '待付款': 'status-pending',
    '待发货': 'status-shipping',
    '待收货': 'status-delivering',
    '已完成': 'status-done',
    '已取消': 'status-cancel',
  }
  return map[status] || ''
}

onMounted(() => {
  orderStore.loadOrders()
})
</script>

<style scoped>
.page-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 24px;
  color: #333;
}

/* Tab 切换 */
.order-tabs {
  display: flex;
  gap: 0;
  background: #fff;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.order-tabs button {
  flex: 1;
  padding: 10px 0;
  border: none;
  background: none;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.order-tabs button:hover {
  color: #e4393c;
}

.order-tabs button.active {
  background: #e4393c;
  color: #fff;
  font-weight: 500;
}

/* 订单卡片 */
.order-card {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.order-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.order-id {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.order-time {
  font-size: 13px;
  color: #999;
}

.order-status {
  font-size: 14px;
  font-weight: 600;
  padding: 4px 14px;
  border-radius: 12px;
}

.status-pending {
  color: #e6a23c;
  background: #fdf6ec;
}

.status-shipping {
  color: #409eff;
  background: #ecf5ff;
}

.status-delivering {
  color: #67c23a;
  background: #f0f9eb;
}

.status-done {
  color: #999;
  background: #f5f5f5;
}

.status-cancel {
  color: #f56c6c;
  background: #fef0f0;
}

/* 商品列表 */
.order-items {
  padding: 12px 20px;
}

.order-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.order-item:last-child {
  border-bottom: none;
}

.item-img {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
  flex-shrink: 0;
}

.item-text {
  flex: 1;
  margin-left: 12px;
  min-width: 0;
}

.item-name {
  font-size: 14px;
  color: #333;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-sku {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.item-price {
  width: 80px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.item-qty {
  width: 40px;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.item-total {
  width: 100px;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: #e4393c;
}

/* 地址信息 */
.order-address {
  padding: 10px 20px;
  font-size: 13px;
  color: #666;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
}

/* 订单底部 */
.order-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
}

.order-total {
  font-size: 14px;
  color: #666;
}

.total-price {
  font-size: 18px;
  font-weight: 700;
  color: #e4393c;
  margin-left: 4px;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.btn-cancel {
  padding: 6px 20px;
  border: 1px solid #ddd;
  border-radius: 18px;
  background: #fff;
  color: #999;
  font-size: 14px;
}

.btn-cancel:hover {
  border-color: #f56c6c;
  color: #f56c6c;
}

.btn-pay {
  padding: 6px 20px;
  border: none;
  border-radius: 18px;
  background: #e4393c;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

.btn-pay:hover {
  background: #c1272d;
}

.btn-confirm {
  padding: 6px 20px;
  border: none;
  border-radius: 18px;
  background: #67c23a;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

.btn-confirm:hover {
  background: #529b2e;
}

/* 空状态 */
.order-empty {
  text-align: center;
  padding: 80px 20px;
  background: #fff;
  border-radius: 12px;
}

.order-empty p {
  font-size: 18px;
  color: #999;
  margin-bottom: 20px;
}

.btn-go-shop {
  padding: 10px 32px;
  border: 2px solid #e4393c;
  border-radius: 24px;
  background: #fff;
  color: #e4393c;
  font-size: 15px;
  font-weight: 500;
}

.btn-go-shop:hover {
  background: #fff0f0;
}

/* 响应式 */
@media (max-width: 768px) {
  .order-tabs {
    overflow-x: auto;
  }
  .order-tabs button {
    font-size: 13px;
    padding: 8px 12px;
    white-space: nowrap;
  }
}
</style>
