<template>
  <div class="user-center">
    <div class="user-sidebar">
      <!-- 用户信息卡片 -->
      <div class="user-card">
        <div class="user-avatar-wrapper">
          <span class="user-avatar">{{ (userStore.username || 'U').charAt(0).toUpperCase() }}</span>
        </div>
        <h3 class="user-name">{{ userStore.username || '用户' }}</h3>
        <p class="user-email">{{ userStore.userInfo?.email || '暂无邮箱' }}</p>
        <span class="user-role-badge">{{ userStore.userInfo?.role === 'vip' ? 'VIP 会员' : '普通用户' }}</span>
      </div>

      <!-- 导航菜单 -->
      <nav class="user-nav">
        <router-link to="/user" :class="{ active: $route.path === '/user' }" class="nav-item">
          <span class="nav-icon">👤</span>
          <span class="nav-text">个人资料</span>
        </router-link>
        <router-link to="/user/orders" :class="{ active: $route.path === '/user/orders' }" class="nav-item">
          <span class="nav-icon">📦</span>
          <span class="nav-text">我的订单</span>
          <span class="nav-badge" v-if="orderCount">({{ orderCount }})</span>
        </router-link>
        <router-link to="/user/favorites" :class="{ active: $route.path === '/user/favorites' }" class="nav-item">
          <span class="nav-icon">❤️</span>
          <span class="nav-text">我的收藏</span>
        </router-link>
        <router-link to="/user/history" :class="{ active: $route.path === '/user/history' }" class="nav-item">
          <span class="nav-icon">👀</span>
          <span class="nav-text">浏览足迹</span>
        </router-link>
        <router-link to="/user/addresses" :class="{ active: $route.path === '/user/addresses' }" class="nav-item">
          <span class="nav-icon">📍</span>
          <span class="nav-text">地址管理</span>
        </router-link>
        <router-link to="/user/coupons" :class="{ active: $route.path === '/user/coupons' }" class="nav-item">
          <span class="nav-icon">🎫</span>
          <span class="nav-text">优惠券</span>
        </router-link>
      </nav>
    </div>
    <div class="user-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { getOrders } from '@/api/product'
import { computed } from 'vue'

const userStore = useUserStore()

const orderCount = computed(() => {
  try {
    const orders = getOrders()
    return orders.length || 0
  } catch {
    return 0
  }
})
</script>

<style scoped>
.user-center {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

/* ===== 侧边栏 ===== */
.user-sidebar {
  width: 240px;
  flex-shrink: 0;
  position: sticky;
  top: 80px;
}

/* 用户信息卡片 */
.user-card {
  background: var(--color-primary-gradient, linear-gradient(135deg, #FF6B35, #FF8A5C));
  border-radius: var(--radius-md, 10px);
  padding: var(--space-8, 32px) var(--space-6, 24px);
  text-align: center;
  color: var(--color-white, #fff);
  margin-bottom: var(--space-3, 12px);
  box-shadow: 0 4px 20px rgba(255, 107, 53, 0.3);
}

.user-avatar-wrapper {
  margin-bottom: 12px;
}

.user-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 4px;
}

.user-email {
  font-size: 13px;
  opacity: 0.85;
  margin: 0 0 12px;
}

.user-role-badge {
  display: inline-block;
  padding: 3px 14px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 导航菜单 */
.user-nav {
  background: var(--color-white, #fff);
  border-radius: var(--radius-md, 10px);
  overflow: hidden;
  box-shadow: var(--shadow-card, 0 2px 12px rgba(0,0,0,0.04));
  border: 1px solid var(--color-border-light, #f3f4f6);
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  font-size: 14px;
  color: var(--gray-700, #4B5563);
  text-decoration: none;
  transition: all var(--transition-fast, 0.15s);
  border-bottom: 1px solid var(--gray-100, #f7f8fa);
  gap: 10px;
  position: relative;
}

.nav-item:last-child {
  border-bottom: none;
}

.nav-item:hover {
  background: var(--gray-50, #fafafa);
  color: var(--color-primary, #FF6B35);
}

.nav-item.active {
  color: var(--color-primary, #FF6B35);
  background: var(--color-primary-lighter, #FFF0E8);
  font-weight: 500;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--color-primary, #FF6B35);
  border-radius: 0 2px 2px 0;
}

.nav-icon {
  font-size: 16px;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.nav-text {
  flex: 1;
}

.nav-badge {
  font-size: 12px;
  color: var(--gray-400, #b0b5bd);
}

/* ===== 主内容区 ===== */
.user-content {
  flex: 1;
  min-width: 0;
  background: var(--color-white, #fff);
  border-radius: var(--radius-md, 10px);
  padding: var(--space-6, 24px);
  box-shadow: var(--shadow-card, 0 2px 12px rgba(0,0,0,0.04));
  border: 1px solid var(--color-border-light, #f3f4f6);
  min-height: 400px;
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .user-center {
    flex-direction: column;
  }
  .user-sidebar {
    width: 100%;
    position: static;
  }
  .user-card {
    display: flex;
    align-items: center;
    gap: 16px;
    text-align: left;
    padding: var(--space-4, 16px);
  }
  .user-avatar-wrapper {
    margin-bottom: 0;
  }
  .user-avatar {
    width: 48px;
    height: 48px;
    font-size: 22px;
  }
  .user-name {
    font-size: 16px;
  }
  .user-email {
    margin-bottom: 0;
  }
  .user-role-badge {
    display: none;
  }
  .user-nav {
    display: flex;
    overflow-x: auto;
    border-radius: var(--radius-sm, 6px);
  }
  .nav-item {
    white-space: nowrap;
    border-bottom: none;
    border-right: 1px solid var(--gray-100, #f7f8fa);
    padding: 10px 12px;
    font-size: 13px;
    gap: 0;
    justify-content: center;
  }
  .nav-icon {
    display: none;
  }
  .nav-text {
    text-align: center;
  }
  .nav-badge {
    display: none;
  }
  .nav-item.active::before {
    display: none;
  }
  .nav-item.active {
    border-bottom: 2px solid var(--color-primary, #FF6B35);
  }
  .user-content {
    padding: var(--space-4, 16px);
  }
}
</style>
