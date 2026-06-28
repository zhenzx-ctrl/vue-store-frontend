<template>
  <div class="layout">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="header-inner">
        <!-- 汉堡菜单（移动端） -->
        <button class="hamburger-btn hide-desktop" @click="showHamburger = true">☰</button>

        <router-link to="/" class="logo">
          <span class="logo-icon">◆</span>
          优选商城
        </router-link>
        <nav class="nav hide-mobile">
          <router-link to="/" :class="{ active: $route.path === '/' }">首页</router-link>
          <router-link to="/products" :class="{ active: $route.path === '/products' }">全部商品</router-link>
          <router-link v-if="userStore.isLoggedIn" to="/orders" :class="{ active: $route.path === '/orders' }">我的订单</router-link>
        </nav>
        <div class="header-right">
          <!-- 搜索框（桌面端） -->
          <div class="header-search hide-mobile">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索商品..."
              @keyup.enter="doSearch"
            />
            <button class="search-btn" @click="doSearch">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </div>

          <router-link to="/cart" class="cart-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span v-if="cartStore.totalCount > 0" class="cart-badge">{{ cartStore.totalCount > 99 ? '99+' : cartStore.totalCount }}</span>
          </router-link>

          <!-- 已登录（桌面端） -->
          <div v-if="userStore.isLoggedIn" class="user-area hide-mobile">
            <div class="user-info" @click="showDropdown = !showDropdown">
              <span class="user-avatar">{{ (userStore.username || 'U').charAt(0).toUpperCase() }}</span>
              <span class="user-name">{{ userStore.username }}</span>
              <svg class="dropdown-arrow" :class="{ open: showDropdown }" width="10" height="6" viewBox="0 0 10 6" fill="currentColor"><path d="M0 0l5 6 5-6H0z"/></svg>
            </div>
            <Transition name="dropdown">
              <div v-if="showDropdown" class="user-dropdown">
                <router-link to="/user" class="dropdown-item" @click="showDropdown = false">👤 个人中心</router-link>
                <router-link to="/orders" class="dropdown-item" @click="showDropdown = false">📦 我的订单</router-link>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item logout" @click="handleLogout">退出登录</button>
              </div>
            </Transition>
          </div>

          <!-- 未登录（桌面端） -->
          <div v-else class="auth-links hide-mobile">
            <router-link to="/login" class="auth-link">登录</router-link>
            <router-link to="/register" class="auth-link register">注册</router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="main">
      <router-view />
    </main>

    <!-- 底部 -->
    <footer class="footer hide-mobile">
      <div class="footer-inner">
        <div class="footer-brand">
          <h3><span class="logo-icon">◆</span> 优选商城</h3>
          <p>品质生活，优选好物</p>
        </div>
        <div class="footer-links">
          <div class="footer-col">
            <h4>购物指南</h4>
            <a href="javascript:;">购物流程</a>
            <a href="javascript:;">会员介绍</a>
            <a href="javascript:;">常见问题</a>
          </div>
          <div class="footer-col">
            <h4>配送方式</h4>
            <a href="javascript:;">上门自提</a>
            <a href="javascript:;">快递运输</a>
            <a href="javascript:;">特快专递</a>
          </div>
          <div class="footer-col">
            <h4>售后服务</h4>
            <a href="javascript:;">退换货政策</a>
            <a href="javascript:;">价格保护</a>
            <a href="javascript:;">退款说明</a>
          </div>
          <div class="footer-col">
            <h4>关于我们</h4>
            <a href="javascript:;">公司简介</a>
            <a href="javascript:;">联系我们</a>
            <a href="javascript:;">招贤纳士</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2025 优选商城 - 品质生活，优选好物</p>
        </div>
      </div>
    </footer>

    <!-- 点击空白处关闭下拉菜单 -->
    <div v-if="showDropdown" class="overlay-mask" @click="showDropdown = false"></div>

    <!-- 移动端底部导航 -->
    <MobileNav />

    <!-- 汉堡菜单 -->
    <HamburgerMenu :visible="showHamburger" @close="showHamburger = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import MobileNav from '@/components/MobileNav.vue'
import HamburgerMenu from '@/components/HamburgerMenu.vue'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const searchKeyword = ref('')
const showDropdown = ref(false)
const showHamburger = ref(false)

// 初始化
cartStore.loadCart()
userStore.checkAuth()

function doSearch() {
  const keyword = searchKeyword.value.trim()
  if (keyword) {
    router.push({ path: '/products', query: { keyword } })
    searchKeyword.value = ''
  }
}

function handleLogout() {
  showDropdown.value = false
  userStore.logout()
  router.push('/')
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ===== 顶部导航 ===== */
.header {
  background: var(--color-white, #fff);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hamburger-btn {
  border: none;
  background: none;
  font-size: 22px;
  color: var(--gray-800, #374151);
  padding: 4px 8px;
  cursor: pointer;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  color: var(--gray-900, #1F2937);
  text-decoration: none;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
}

.logo-icon {
  color: var(--color-primary, #FF6B35);
  font-size: 22px;
}

.nav {
  display: flex;
  gap: 32px;
}

.nav a {
  text-decoration: none;
  color: var(--gray-600, #6B7280);
  font-size: 15px;
  padding: 4px 0;
  transition: color var(--transition-fast, 0.15s);
  position: relative;
  font-weight: var(--weight-medium, 500);
}

.nav a:hover {
  color: var(--color-primary, #FF6B35);
}

.nav a.active {
  color: var(--color-primary, #FF6B35);
  font-weight: var(--weight-semibold, 600);
}

.nav a.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2.5px;
  background: var(--color-primary, #FF6B35);
  border-radius: 2px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 搜索框 */
.header-search {
  display: flex;
  align-items: center;
  border: 2px solid var(--color-primary, #FF6B35);
  border-radius: 20px;
  overflow: hidden;
  height: 36px;
  transition: box-shadow var(--transition-fast, 0.15s);
}

.header-search:focus-within {
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.15);
}

.header-search input {
  border: none;
  outline: none;
  padding: 0 14px;
  font-size: 13px;
  width: 170px;
  height: 100%;
  background: transparent;
}

.header-search input::placeholder {
  color: var(--gray-400, #b0b5bd);
}

.search-btn {
  border: none;
  background: var(--color-primary, #FF6B35);
  color: var(--color-white, #fff);
  width: 44px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background var(--transition-fast, 0.15s);
}

.search-btn:hover {
  background: var(--color-primary-dark, #E55A2B);
}

/* 购物车按钮 */
.cart-btn {
  text-decoration: none;
  color: var(--gray-600, #6B7280);
  font-size: 15px;
  position: relative;
  padding: 8px 12px;
  border-radius: 20px;
  transition: all var(--transition-fast, 0.15s);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
}

.cart-btn:hover {
  color: var(--color-primary, #FF6B35);
  background: var(--color-primary-lighter, #FFF0E8);
}

.cart-badge {
  position: absolute;
  top: 0;
  right: 2px;
  background: var(--color-primary, #FF6B35);
  color: var(--color-white, #fff);
  font-size: 11px;
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  border-radius: 9px;
  padding: 0 4px;
  font-weight: var(--weight-bold, 700);
}

/* 用户区域 */
.user-area {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 20px;
  transition: background var(--transition-fast, 0.15s);
}

.user-info:hover {
  background: var(--gray-100, #f7f8fa);
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-primary, #FF6B35);
  color: var(--color-white, #fff);
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-name {
  font-size: 14px;
  color: var(--gray-800, #374151);
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-arrow {
  color: var(--gray-400, #b0b5bd);
  transition: transform var(--transition-fast, 0.15s);
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: var(--color-white, #fff);
  border-radius: var(--radius-sm, 6px);
  box-shadow: var(--shadow-lg, 0 10px 40px rgba(0, 0, 0, 0.08));
  min-width: 150px;
  overflow: hidden;
  z-index: 200;
  border: 1px solid var(--gray-200, #edeef2);
}

.dropdown-item {
  display: block;
  padding: 10px 16px;
  font-size: 14px;
  color: var(--gray-700, #4B5563);
  text-decoration: none;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  transition: background var(--transition-fast, 0.15s);
}

.dropdown-item:hover {
  background: var(--gray-100, #f7f8fa);
}

.dropdown-item.logout {
  color: var(--color-danger, #EF4444);
}

.dropdown-divider {
  height: 1px;
  background: var(--gray-200, #edeef2);
  margin: 4px 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* 登录/注册链接 */
.auth-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.auth-link {
  font-size: 14px;
  color: var(--gray-600, #6B7280);
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 16px;
  transition: all var(--transition-fast, 0.15s);
  font-weight: var(--weight-medium, 500);
}

.auth-link:hover {
  color: var(--color-primary, #FF6B35);
}

.auth-link.register {
  border: 1.5px solid var(--color-primary, #FF6B35);
  color: var(--color-primary, #FF6B35);
  background: var(--color-primary-lighter, #FFF0E8);
}

.auth-link.register:hover {
  background: var(--color-primary-lighter, #FFF0E8);
  opacity: 0.9;
}

.overlay-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 90;
}

.main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

/* ===== 底部 ===== */
.footer {
  background: var(--gray-900, #1F2937);
  color: var(--gray-400, #b0b5bd);
  margin-top: 60px;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 20px 24px;
}

.footer-brand {
  text-align: center;
  margin-bottom: 32px;
}

.footer-brand h3 {
  font-size: 22px;
  color: var(--color-white, #fff);
  margin: 0 0 6px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.footer-brand p {
  font-size: 14px;
  color: var(--gray-500, #8B909A);
  margin: 0;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.footer-col h4 {
  font-size: 14px;
  color: var(--color-white, #fff);
  margin: 0 0 12px;
  font-weight: 600;
}

.footer-col a {
  display: block;
  font-size: 13px;
  color: var(--gray-400, #b0b5bd);
  text-decoration: none;
  margin-bottom: 8px;
  transition: color var(--transition-fast, 0.15s);
}

.footer-col a:hover {
  color: var(--color-primary, #FF6B35);
}

.footer-bottom {
  border-top: 1px solid var(--gray-800, #374151);
  padding-top: 20px;
  text-align: center;
  font-size: 13px;
  color: var(--gray-500, #8B909A);
}

.footer-bottom p {
  margin: 0;
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .header-inner {
    padding: 0 12px;
    gap: 8px;
  }
  .cart-btn {
    padding: 8px;
  }
  .main {
    padding: 12px;
  }
  .footer-links {
    gap: 30px;
  }
  .footer-col {
    width: 40%;
    margin-bottom: 16px;
  }
}
</style>
