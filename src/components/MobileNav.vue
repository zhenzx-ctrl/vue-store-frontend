<template>
  <div class="mobile-nav">
    <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
      <span class="nav-icon">🏠</span>
      <span class="nav-label">首页</span>
    </router-link>
    <router-link to="/products" class="nav-item" :class="{ active: $route.path === '/products' }">
      <span class="nav-icon">📋</span>
      <span class="nav-label">分类</span>
    </router-link>
    <router-link to="/cart" class="nav-item cart-item" :class="{ active: $route.path === '/cart' }">
      <span class="nav-icon">🛒</span>
      <span v-if="cartCount > 0" class="nav-badge">{{ cartCount }}</span>
      <span class="nav-label">购物车</span>
    </router-link>
    <router-link to="/orders" class="nav-item" :class="{ active: $route.path === '/orders' }">
      <span class="nav-icon">📦</span>
      <span class="nav-label">订单</span>
    </router-link>
    <router-link to="/user" class="nav-item" :class="{ active: $route.path.startsWith('/user') }">
      <span class="nav-icon">👤</span>
      <span class="nav-label">我的</span>
    </router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const cartCount = computed(() => cartStore.totalCount)
</script>

<style scoped>
.mobile-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  z-index: 200;
  padding-bottom: env(safe-area-inset-bottom);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #999;
  font-size: 11px;
  gap: 2px;
  position: relative;
  transition: color 0.2s;
}

.nav-item.active {
  color: #e4393c;
}

.nav-icon {
  font-size: 22px;
  line-height: 1;
}

.nav-label {
  font-size: 11px;
}

.nav-badge {
  position: absolute;
  top: 2px;
  right: 50%;
  margin-right: -22px;
  background: #e4393c;
  color: #fff;
  font-size: 10px;
  min-width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  border-radius: 8px;
  padding: 0 4px;
}

.mobile-nav {
  display: none;
}

@media (max-width: 768px) {
  .mobile-nav {
    display: flex;
  }
}
</style>
