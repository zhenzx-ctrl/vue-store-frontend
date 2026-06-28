<template>
  <div>
    <!-- 遮罩 -->
    <Transition name="fade">
      <div v-if="visible" class="menu-overlay" @click="$emit('close')"></div>
    </Transition>

    <!-- 侧边栏 -->
    <Transition name="slide">
      <div v-if="visible" class="hamburger-menu">
        <div class="menu-header">
          <div v-if="userStore.isLoggedIn" class="menu-user">
            <span class="menu-avatar">{{ userStore.username.charAt(0).toUpperCase() }}</span>
            <span class="menu-username">{{ userStore.username }}</span>
          </div>
          <div v-else class="menu-auth">
            <router-link to="/login" class="menu-login" @click="$emit('close')">登录</router-link>
            <router-link to="/register" class="menu-register" @click="$emit('close')">注册</router-link>
          </div>
          <button class="menu-close" @click="$emit('close')">✕</button>
        </div>

        <nav class="menu-nav">
          <router-link to="/" @click="$emit('close')">🏠 首页</router-link>
          <router-link to="/products" @click="$emit('close')">📋 全部商品</router-link>
          <router-link to="/cart" @click="$emit('close')">🛒 购物车</router-link>
          <router-link to="/orders" @click="$emit('close')">📦 我的订单</router-link>
          <router-link to="/user" @click="$emit('close')">👤 个人中心</router-link>
          <router-link to="/user/favorites" @click="$emit('close')">❤️ 我的收藏</router-link>
          <router-link to="/user/addresses" @click="$emit('close')">📍 地址管理</router-link>
        </nav>

        <div v-if="userStore.isLoggedIn" class="menu-footer">
          <button @click="handleLogout">退出登录</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

defineProps({
  visible: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

const router = useRouter()
const userStore = useUserStore()

function handleLogout() {
  emit('close')
  userStore.logout()
  router.push('/')
}
</script>

<style scoped>
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 300;
}

.hamburger-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 260px;
  height: 100%;
  background: var(--color-white, #fff);
  z-index: 400;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 16px rgba(0, 0, 0, 0.1);
}

.menu-header {
  background: linear-gradient(135deg, var(--color-primary, #FF6B35), #ff6b6b);
  padding: 32px 20px 20px;
  color: var(--color-white, #fff);
  position: relative;
}

.menu-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
}

.menu-username {
  font-size: 17px;
  font-weight: 600;
}

.menu-auth {
  display: flex;
  gap: 12px;
}

.menu-auth a {
  color: var(--color-white, #fff);
  text-decoration: none;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 14px;
}

.menu-login {
  background: rgba(255, 255, 255, 0.2);
}

.menu-register {
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.menu-close {
  position: absolute;
  top: 12px;
  right: 12px;
  border: none;
  background: none;
  color: var(--color-white, #fff);
  font-size: 20px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-close:hover {
  background: rgba(255, 255, 255, 0.15);
}

.menu-nav {
  flex: 1;
  padding: 8px 0;
  overflow-y: auto;
}

.menu-nav a {
  display: block;
  padding: 14px 24px;
  font-size: 15px;
  color: var(--gray-900, #1F2937);
  text-decoration: none;
  transition: all 0.2s;
}

.menu-nav a:hover {
  background: var(--gray-100, #f7f8fa);
  color: var(--color-primary, #FF6B35);
}

.menu-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--gray-200, #edeef2);
}

.menu-footer button {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--gray-300, #d0d5dd);
  border-radius: 20px;
  background: var(--color-white, #fff);
  color: var(--gray-400, #b0b5bd);
  font-size: 14px;
  cursor: pointer;
}

.menu-footer button:hover {
  border-color: var(--color-primary, #FF6B35);
  color: var(--color-primary, #FF6B35);
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
