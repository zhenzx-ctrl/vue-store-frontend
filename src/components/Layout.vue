<template>
  <div class="layout">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="header-inner">
        <!-- 汉堡菜单（移动端） -->
        <button class="hamburger-btn hide-desktop" @click="showHamburger = true">☰</button>

        <router-link to="/" class="logo">🛒 优选商城</router-link>
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
            <button class="search-btn" @click="doSearch">🔍</button>
          </div>

          <router-link to="/cart" class="cart-btn">
            <span class="hide-mobile">购物车</span>
            <span v-if="cartStore.totalCount > 0" class="cart-badge">{{ cartStore.totalCount }}</span>
          </router-link>

          <!-- 已登录（桌面端） -->
          <div v-if="userStore.isLoggedIn" class="user-area hide-mobile">
            <div class="user-info" @click="showDropdown = !showDropdown">
              <span class="user-avatar">{{ userStore.username.charAt(0).toUpperCase() }}</span>
              <span class="user-name">{{ userStore.username }}</span>
              <span class="dropdown-arrow" :class="{ open: showDropdown }">▾</span>
            </div>
            <Transition name="dropdown">
              <div v-if="showDropdown" class="user-dropdown">
                <router-link to="/user" class="dropdown-item" @click="showDropdown = false"> 个人中心</router-link>
                <router-link to="/orders" class="dropdown-item" @click="showDropdown = false"> 我的订单</router-link>
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
          <p>© 2024 优选商城 - 品质生活，优选好物</p>
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

.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
  color: #333;
  padding: 4px 8px;
  cursor: pointer;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  text-decoration: none;
  white-space: nowrap;
}

.nav {
  display: flex;
  gap: 32px;
}

.nav a {
  text-decoration: none;
  color: #666;
  font-size: 15px;
  padding: 4px 0;
  transition: color 0.2s;
  position: relative;
}

.nav a:hover,
.nav a.active {
  color: #e4393c;
}

.nav a.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: #e4393c;
  border-radius: 1px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 搜索框 */
.header-search {
  display: flex;
  align-items: center;
  border: 2px solid #e4393c;
  border-radius: 20px;
  overflow: hidden;
  height: 36px;
}

.header-search input {
  border: none;
  outline: none;
  padding: 0 14px;
  font-size: 13px;
  width: 180px;
  height: 100%;
}

.header-search input::placeholder {
  color: #ccc;
}

.search-btn {
  border: none;
  background: #e4393c;
  color: #fff;
  width: 44px;
  height: 100%;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.search-btn:hover {
  background: #c1272d;
}

.cart-btn {
  text-decoration: none;
  color: #333;
  font-size: 15px;
  position: relative;
  padding: 6px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  transition: all 0.2s;
  white-space: nowrap;
}

.cart-btn:hover {
  border-color: #e4393c;
  color: #e4393c;
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #e4393c;
  color: #fff;
  font-size: 12px;
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  border-radius: 9px;
  padding: 0 4px;
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
  padding: 4px 8px;
  border-radius: 20px;
  transition: background 0.2s;
}

.user-info:hover {
  background: #f5f5f5;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e4393c;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-name {
  font-size: 14px;
  color: #333;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-arrow {
  font-size: 12px;
  color: #999;
  transition: transform 0.2s;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  min-width: 140px;
  overflow: hidden;
  z-index: 200;
}

.dropdown-item {
  display: block;
  padding: 10px 16px;
  font-size: 14px;
  color: #333;
  text-decoration: none;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.dropdown-item.logout {
  color: #e4393c;
}

.dropdown-divider {
  height: 1px;
  background: #f0f0f0;
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
  color: #666;
  text-decoration: none;
  padding: 4px 12px;
  border-radius: 16px;
  transition: all 0.2s;
}

.auth-link:hover {
  color: #e4393c;
}

.auth-link.register {
  border: 1px solid #e4393c;
  color: #e4393c;
}

.auth-link.register:hover {
  background: #fff0f0;
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

/* 底部 */
.footer {
  background: #333;
  color: #aaa;
  margin-top: 40px;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 20px;
}

.footer-links {
  display: flex;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 30px;
}

.footer-col h4 {
  font-size: 15px;
  color: #fff;
  margin: 0 0 12px;
  font-weight: 600;
}

.footer-col a {
  display: block;
  font-size: 13px;
  color: #aaa;
  text-decoration: none;
  margin-bottom: 8px;
  transition: color 0.2s;
}

.footer-col a:hover {
  color: #fff;
}

.footer-bottom {
  border-top: 1px solid #444;
  padding-top: 20px;
  text-align: center;
  font-size: 13px;
}

.footer-bottom p {
  margin: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .header-inner {
    padding: 0 12px;
    gap: 8px;
  }
  .cart-btn {
    padding: 6px 10px;
    font-size: 14px;
  }
  .main {
    padding: 12px;
  }
  .footer-links {
    flex-wrap: wrap;
    gap: 20px;
  }
  .footer-col {
    width: 45%;
    margin-bottom: 10px;
  }
}
</style>
