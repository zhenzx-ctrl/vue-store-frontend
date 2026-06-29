import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/components/Layout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页' },
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/views/product/list.vue'),
        meta: { title: '商品列表' },
      },
      {
        path: 'product/:id',
        name: 'ProductDetail',
        component: () => import('@/views/product/detail.vue'),
        meta: { title: '商品详情' },
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('@/views/cart/index.vue'),
        meta: { title: '购物车', requiresAuth: true },
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/views/order/index.vue'),
        meta: { title: '我的订单', requiresAuth: true },
      },
      {
        path: 'user',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '个人中心', requiresAuth: true },
        children: [
          {
            path: '',
            name: 'UserProfile',
            component: () => import('@/views/user/Profile.vue'),
            meta: { title: '个人资料' },
          },
          {
            path: 'orders',
            name: 'UserOrders',
            component: () => import('@/views/order/index.vue'),
            meta: { title: '我的订单' },
          },
          {
            path: 'favorites',
            name: 'UserFavorites',
            component: () => import('@/views/user/Favorites.vue'),
            meta: { title: '我的收藏' },
          },
          {
            path: 'history',
            name: 'UserHistory',
            component: () => import('@/views/user/BrowseHistory.vue'),
            meta: { title: '浏览足迹' },
          },
          {
            path: 'addresses',
            name: 'UserAddresses',
            component: () => import('@/views/user/AddressList.vue'),
            meta: { title: '地址管理' },
          },
          {
            path: 'coupons',
            name: 'UserCoupons',
            component: () => import('@/views/user/Coupons.vue'),
            meta: { title: '优惠券' },
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/login/register.vue'),
    meta: { title: '注册' },
  },
]

/**
 * 滚动位置缓存 —— 返回上一页时恢复滚动位置
 * 通过 key（路由名称 + 查询参数）保存每个页面的 scrolY
 */
const scrollCache = new Map()

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 1) 手动导航返回（如从详情页点回首页）→ 从缓存恢复
    const cacheKey = to.name
    if (cacheKey && scrollCache.has(cacheKey)) {
      const pos = scrollCache.get(cacheKey)
      scrollCache.delete(cacheKey)
      return pos
    }
    // 2) 浏览器原生返回/前进 → 使用原生保存的位置
    if (savedPosition) {
      return savedPosition
    }
    // 3) 新页面 → 滚动到顶部
    return { top: 0 }
  },
})

// 禁止浏览器原生滚动恢复，使用自定义缓存
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual'
}

// 路由守卫：保存滚动位置 + 标题 + 鉴权
router.beforeEach((to, from) => {
  // 离开前保存滚动位置
  if (from.name) {
    scrollCache.set(from.name, { top: window.scrollY })
  }
  // 设置页面标题
  document.title = `${to.meta.title || '优选商城'} - 优选商城`
  // 需要登录的页面跳转到登录页
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      return { path: '/login', query: { redirect: to.fullPath } }
    }
  }
  // 已登录用户访问登录/注册页 → 跳首页
  if ((to.path === '/login' || to.path === '/register') && localStorage.getItem('token')) {
    return '/'
  }
})

export default router