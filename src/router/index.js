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

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// 路由守卫（新写法，无 next() 警告）
router.beforeEach((to, from) => {
  document.title = `${to.meta.title || '优选商城'} - 优选商城`

  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      return { path: '/login', query: { redirect: to.fullPath } }
    }
  }

  if ((to.path === '/login' || to.path === '/register') && localStorage.getItem('token')) {
    return '/'
  }
})

export default router