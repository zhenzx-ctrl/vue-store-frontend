<template>
  <div class="coupons-page">
    <h3 class="page-title">我的优惠券</h3>
    <div v-if="coupons.length" class="coupon-list">
      <div
        v-for="coupon in coupons"
        :key="coupon.id"
        :class="['coupon-card', { used: coupon.used }]"
      >
        <div class="coupon-left">
          <span class="coupon-symbol">¥</span>
          <span class="coupon-value">{{ coupon.discount }}</span>
        </div>
        <div class="coupon-right">
          <h4>{{ coupon.name }}</h4>
          <p>满{{ coupon.minSpend }}元可用</p>
          <span class="coupon-expiry">有效期至 {{ coupon.expiry }}</span>
        </div>
        <span v-if="coupon.used" class="coupon-used-tag">已使用</span>
      </div>
    </div>
    <Empty v-else icon="🎫" text="暂无优惠券" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCoupons } from '@/api/product'
import Empty from '@/components/Empty.vue'

const coupons = ref([])

onMounted(() => {
  coupons.value = getCoupons()
})
</script>

<style scoped>
.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-900, #1F2937);
  margin: 0 0 24px;
}

.coupon-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.coupon-card {
  display: flex;
  align-items: stretch;
  background: var(--color-white, #fff);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  border: 1px dashed var(--color-primary, #FF6B35);
  transition: opacity 0.2s;
}

.coupon-card.used {
  border-color: var(--gray-300, #d0d5dd);
  opacity: 0.5;
}

.coupon-left {
  width: 100px;
  background: linear-gradient(135deg, var(--color-primary, #FF6B35), #ff6b6b);
  color: var(--color-white, #fff);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 16px;
}

.coupon-card.used .coupon-left {
  background: #ccc;
}

.coupon-symbol {
  font-size: 16px;
  font-weight: 500;
  margin-right: 2px;
}

.coupon-value {
  font-size: 36px;
  font-weight: 700;
}

.coupon-right {
  flex: 1;
  padding: 16px 20px;
}

.coupon-right h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-900, #1F2937);
  margin: 0 0 4px;
}

.coupon-right p {
  font-size: 13px;
  color: var(--gray-400, #b0b5bd);
  margin: 0 0 6px;
}

.coupon-expiry {
  font-size: 12px;
  color: #bbb;
}

.coupon-used-tag {
  position: absolute;
  top: 12px;
  right: 16px;
  font-size: 12px;
  color: var(--gray-400, #b0b5bd);
  background: var(--gray-100, #f7f8fa);
  padding: 2px 10px;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .coupon-card {
    border-radius: 8px;
  }
  .coupon-left {
    width: 72px;
    padding: 12px 8px;
  }
  .coupon-value {
    font-size: 28px;
  }
  .coupon-symbol {
    font-size: 13px;
  }
  .coupon-right {
    padding: 12px 14px;
  }
  .coupon-right h4 {
    font-size: 14px;
  }
}
</style>
