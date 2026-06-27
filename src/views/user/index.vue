<template>
  <div class="user-center">
    <div class="user-sidebar">
      <div class="user-card">
        <span class="user-avatar">{{ userStore.username.charAt(0).toUpperCase() }}</span>
        <h3 class="user-name">{{ userStore.username }}</h3>
        <p class="user-email">{{ userStore.userInfo?.email || '暂无邮箱' }}</p>
      </div>
      <nav class="user-nav">
        <router-link to="/user" :class="{ active: $route.path === '/user' }">👤 个人资料</router-link>
        <router-link to="/user/orders" :class="{ active: $route.path === '/user/orders' }">📦 我的订单</router-link>
        <router-link to="/user/favorites" :class="{ active: $route.path === '/user/favorites' }">❤️ 我的收藏</router-link>
        <router-link to="/user/history" :class="{ active: $route.path === '/user/history' }">👀 浏览足迹</router-link>
        <router-link to="/user/addresses" :class="{ active: $route.path === '/user/addresses' }">📍 地址管理</router-link>
        <router-link to="/user/coupons" :class="{ active: $route.path === '/user/coupons' }">🎫 优惠券</router-link>
      </nav>
    </div>
    <div class="user-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<style scoped>
.user-center {
  display: flex;
  gap: 24px;
}

.user-sidebar {
  width: 220px;
  flex-shrink: 0;
}

.user-card {
  background: linear-gradient(135deg, #e4393c, #ff6b6b);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  color: #fff;
  margin-bottom: 12px;
}

.user-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px;
}

.user-email {
  font-size: 13px;
  opacity: 0.8;
  margin: 0;
}

.user-nav {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.user-nav a {
  display: block;
  padding: 14px 20px;
  font-size: 14px;
  color: #666;
  text-decoration: none;
  transition: all 0.2s;
  border-bottom: 1px solid #f5f5f5;
}

.user-nav a:last-child {
  border-bottom: none;
}

.user-nav a:hover {
  background: #fafafa;
  color: #e4393c;
}

.user-nav a.active {
  color: #e4393c;
  background: #fff0f0;
  font-weight: 500;
}

.user-content {
  flex: 1;
  min-width: 0;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

@media (max-width: 768px) {
  .user-center {
    flex-direction: column;
  }
  .user-sidebar {
    width: 100%;
  }
  .user-card {
    display: flex;
    align-items: center;
    gap: 16px;
    text-align: left;
    padding: 16px;
  }
  .user-avatar {
    margin-bottom: 0;
  }
  .user-nav {
    display: flex;
    overflow-x: auto;
    border-radius: 8px;
  }
  .user-nav a {
    white-space: nowrap;
    border-bottom: none;
    border-right: 1px solid #f5f5f5;
    padding: 10px 16px;
    font-size: 13px;
  }
}
</style>
