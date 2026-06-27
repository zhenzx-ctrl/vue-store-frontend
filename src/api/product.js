/**
 * 商品数据接口
 * 数据源与后台管理系统共享 localStorage
 */
import { getAdminData, setAdminData, getStorage, setStorage } from '@/utils/storage'
import { generateId } from '@/utils'

// 商品分类
export const CATEGORIES = [
  { id: 1, name: '电子产品', icon: '💻' },
  { id: 2, name: '服装', icon: '👕' },
  { id: 3, name: '食品', icon: '🍜' },
  { id: 4, name: '其他', icon: '📦' },
]

// 默认商品数据（如果后台未录入数据则使用）
const DEFAULT_PRODUCTS = [
  { id: 1, name: 'MacBook Pro 14"', price: 14999, category: '电子产品', description: 'Apple M3 芯片，14英寸Liquid Retina XDR显示屏', status: 1, image: 'https://picsum.photos/seed/macbook/400/400', images: ['https://picsum.photos/seed/macbook-1/800/800', 'https://picsum.photos/seed/macbook-2/800/800', 'https://picsum.photos/seed/macbook-3/800/800'], skus: [{ color: '深空黑', size: '512GB' }, { color: '银色', size: '1TB' }], sales: 328 },
  { id: 2, name: 'iPhone 15 Pro', price: 8999, category: '电子产品', description: 'A17 Pro芯片，钛金属设计', status: 1, image: 'https://picsum.photos/seed/iphone15/400/400', images: ['https://picsum.photos/seed/iphone15-1/800/800', 'https://picsum.photos/seed/iphone15-2/800/800'], skus: [{ color: '原色钛金属', size: '256GB' }, { color: '蓝色钛金属', size: '512GB' }], sales: 1256 },
  { id: 3, name: 'AirPods Pro 2', price: 1899, category: '电子产品', description: '自适应降噪，USB-C充电', status: 1, image: 'https://picsum.photos/seed/airpods/400/400', images: ['https://picsum.photos/seed/airpods-1/800/800', 'https://picsum.photos/seed/airpods-2/800/800'], skus: [{ color: '白色', size: '标准' }], sales: 897 },
  { id: 4, name: '经典商务衬衫', price: 299, category: '服装', description: '100%纯棉，免烫工艺', status: 1, image: 'https://picsum.photos/seed/shirt/400/400', images: ['https://picsum.photos/seed/shirt-1/800/800', 'https://picsum.photos/seed/shirt-2/800/800'], skus: [{ color: '白色', size: 'M' }, { color: '浅蓝', size: 'L' }, { color: '浅蓝', size: 'XL' }], sales: 562 },
  { id: 5, name: '休闲卫衣', price: 459, category: '服装', description: '加绒加厚，冬季必备', status: 1, image: 'https://picsum.photos/seed/hoodie/400/400', images: ['https://picsum.photos/seed/hoodie-1/800/800', 'https://picsum.photos/seed/hoodie-2/800/800'], skus: [{ color: '灰色', size: 'M' }, { color: '黑色', size: 'L' }, { color: '黑色', size: 'XL' }], sales: 743 },
  { id: 6, name: '运动跑鞋', price: 699, category: '服装', description: '轻量缓震，透气网面', status: 1, image: 'https://picsum.photos/seed/sneakers/400/400', images: ['https://picsum.photos/seed/sneakers-1/800/800', 'https://picsum.photos/seed/sneakers-2/800/800'], skus: [{ color: '黑白', size: '42' }, { color: '全黑', size: '43' }], sales: 1024 },
  { id: 7, name: '有机坚果礼盒', price: 168, category: '食品', description: '6种坚果混合装，健康美味', status: 1, image: 'https://picsum.photos/seed/nuts/400/400', images: ['https://picsum.photos/seed/nuts-1/800/800', 'https://picsum.photos/seed/nuts-2/800/800'], skus: [{ color: '默认', size: '500g' }], sales: 456 },
  { id: 8, name: '精选咖啡豆', price: 89, category: '食品', description: '哥伦比亚产区，中深烘焙', status: 1, image: 'https://picsum.photos/seed/coffee/400/400', images: ['https://picsum.photos/seed/coffee-1/800/800', 'https://picsum.photos/seed/coffee-2/800/800'], skus: [{ color: '默认', size: '250g' }, { color: '默认', size: '500g' }], sales: 289 },
  { id: 9, name: '进口牛排套餐', price: 258, category: '食品', description: '澳洲安格斯，谷饲200天', status: 1, image: 'https://picsum.photos/seed/steak/400/400', images: ['https://picsum.photos/seed/steak-1/800/800', 'https://picsum.photos/seed/steak-2/800/800'], skus: [{ color: '默认', size: '2片装' }, { color: '默认', size: '4片装' }], sales: 678 },
  { id: 10, name: '创意马克杯', price: 59, category: '其他', description: '陶瓷材质，创意造型', status: 1, image: 'https://picsum.photos/seed/mug/400/400', images: ['https://picsum.photos/seed/mug-1/800/800', 'https://picsum.photos/seed/mug-2/800/800'], skus: [{ color: '白色', size: '标准' }, { color: '黑色', size: '标准' }], sales: 234 },
  { id: 11, name: '蓝牙音箱', price: 399, category: '电子产品', description: '360°环绕立体声，防水设计', status: 1, image: 'https://picsum.photos/seed/speaker/400/400', images: ['https://picsum.photos/seed/speaker-1/800/800', 'https://picsum.photos/seed/speaker-2/800/800'], skus: [{ color: '黑色', size: '标准' }, { color: '红色', size: '标准' }], sales: 567 },
  { id: 12, name: '真皮钱包', price: 349, category: '其他', description: '头层牛皮，简约商务风', status: 1, image: 'https://picsum.photos/seed/wallet/400/400', images: ['https://picsum.photos/seed/wallet-1/800/800', 'https://picsum.photos/seed/wallet-2/800/800'], skus: [{ color: '棕色', size: '标准' }, { color: '黑色', size: '标准' }], sales: 345 },
]

// 轮播图数据
export const BANNERS = [
  { id: 1, title: '新品首发', subtitle: 'MacBook Pro M3 全新登场', bgColor: '#1a1a2e' },
  { id: 2, title: '冬季特惠', subtitle: '全场服装低至5折', bgColor: '#16213e' },
  { id: 3, title: '美食嘉年华', subtitle: '精选食品满199减50', bgColor: '#0f3460' },
  { id: 4, title: '数码好物', subtitle: '电子产品限时直降', bgColor: '#533483' },
]

// 限时秒杀数据
export const FLASH_SALE_PRODUCTS = [
  { id: 101, name: '智能手表 Pro', price: 599, originalPrice: 1299, category: '电子产品', description: '健康监测，超长续航', status: 1, image: 'https://picsum.photos/seed/smartwatch/400/400', images: ['https://picsum.photos/seed/smartwatch-1/800/800', 'https://picsum.photos/seed/smartwatch-2/800/800'], skus: [{ color: '黑色', size: '标准' }], sales: 999 },
  { id: 102, name: '羽绒服', price: 299, originalPrice: 899, category: '服装', description: '白鹅绒填充，轻薄保暖', status: 1, image: 'https://picsum.photos/seed/downcoat/400/400', images: ['https://picsum.photos/seed/downcoat-1/800/800', 'https://picsum.photos/seed/downcoat-2/800/800'], skus: [{ color: '黑色', size: 'L' }, { color: '白色', size: 'M' }], sales: 1567 },
  { id: 103, name: '进口红酒', price: 68, originalPrice: 198, category: '食品', description: '法国波尔多，干红葡萄酒', status: 1, image: 'https://picsum.photos/seed/redwine/400/400', images: ['https://picsum.photos/seed/redwine-1/800/800', 'https://picsum.photos/seed/redwine-2/800/800'], skus: [{ color: '默认', size: '750ml' }], sales: 876 },
  { id: 104, name: '蓝牙耳机', price: 49, originalPrice: 159, category: '电子产品', description: '真无线，主动降噪', status: 1, image: 'https://picsum.photos/seed/earbuds/400/400', images: ['https://picsum.photos/seed/earbuds-1/800/800', 'https://picsum.photos/seed/earbuds-2/800/800'], skus: [{ color: '白色', size: '标准' }], sales: 2345 },
]

// 秒杀结束时间（当前时间 + 24小时）
export function getFlashSaleEnd() {
  const end = new Date()
  end.setHours(end.getHours() + 24)
  return end.toISOString()
}

// 活动横幅数据
export const PROMOTION_BANNERS = [
  { id: 1, title: '满减活动', subtitle: '满299减50，满599减120', bgColor: '#fff0f0', textColor: '#e4393c' },
  { id: 2, title: '新人专享', subtitle: '新用户首单立减30元', bgColor: '#f0f5ff', textColor: '#409eff' },
]

// 默认评价数据
const DEFAULT_REVIEWS = [
  { id: 1, productId: 1, username: '科技达人', rating: 5, content: '性能强劲，屏幕素质一流，非常满意！', images: [], time: '2024-12-15 14:30' },
  { id: 2, productId: 1, username: '设计师小王', rating: 4, content: '色准很好，就是价格有点贵。', images: [], time: '2024-12-10 09:15' },
  { id: 3, productId: 2, username: '果粉', rating: 5, content: '钛金属手感太好了，拍照也提升了！', images: [], time: '2024-12-20 18:45' },
  { id: 4, productId: 2, username: '摄影爱好者', rating: 4, content: '相机升级明显，电池也更耐用了。', images: [], time: '2024-12-18 10:20' },
  { id: 5, productId: 4, username: '职场精英', rating: 5, content: '面料很舒服，免烫确实方便，回购第三件了。', images: [], time: '2024-12-22 16:00' },
  { id: 6, productId: 5, username: '运动青年', rating: 4, content: '加绒很暖和，就是偏大一码。', images: [], time: '2024-12-19 11:30' },
  { id: 7, productId: 6, username: '跑步爱好者', rating: 5, content: '轻量缓震效果很好，跑了10公里脚不累。', images: [], time: '2024-12-21 07:45' },
  { id: 8, productId: 9, username: '美食家', rating: 5, content: '牛排品质很好，煎出来非常嫩！', images: [], time: '2024-12-17 20:10' },
]

// 优惠券数据
export const DEFAULT_COUPONS = [
  { id: 1, name: '新人券', discount: 30, minSpend: 99, expiry: '2025-06-30', used: false },
  { id: 2, name: '满减券', discount: 50, minSpend: 299, expiry: '2025-06-30', used: false },
  { id: 3, name: '大额券', discount: 120, minSpend: 599, expiry: '2025-07-31', used: false },
  { id: 4, name: '运费券', discount: 10, minSpend: 0, expiry: '2025-06-30', used: true },
]

/**
 * 获取商品列表（优先读取后台数据，否则使用默认数据）
 */
export function getProducts() {
  const adminProducts = getAdminData('products')
  if (adminProducts && adminProducts.length > 0) {
    // 旧数据可能缺少图片，用新默认数据补充图片 URL
    const defaultMap = {}
    DEFAULT_PRODUCTS.forEach(p => { defaultMap[p.id] = p })
    adminProducts.forEach(p => {
      if (!p.image && defaultMap[p.id]) {
        p.image = defaultMap[p.id].image
        p.images = defaultMap[p.id].images
      }
    })
    setAdminData('products', adminProducts)
    return adminProducts.filter(p => p.status === 1)
  }
  // 首次使用，初始化默认数据（含图片）
  const defaults = DEFAULT_PRODUCTS
  setAdminData('products', defaults)
  return defaults.filter(p => p.status === 1)
}

/**
 * 获取商品详情
 */
export function getProductById(id) {
  const products = getProducts()
  return products.find(p => p.id === Number(id)) || null
}

/**
 * 搜索商品（增强版，支持排序和价格区间）
 */
export function searchProducts({ keyword = '', category = '', page = 1, pageSize = 8, sortBy = '', priceMin = 0, priceMax = 0 }) {
  let list = getProducts()

  if (keyword) {
    const kw = keyword.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(kw) || p.description.toLowerCase().includes(kw))
  }
  if (category) {
    list = list.filter(p => p.category === category)
  }
  if (priceMin > 0) {
    list = list.filter(p => p.price >= priceMin)
  }
  if (priceMax > 0) {
    list = list.filter(p => p.price <= priceMax)
  }

  // 排序
  if (sortBy === 'priceAsc') {
    list.sort((a, b) => a.price - b.price)
  } else if (sortBy === 'priceDesc') {
    list.sort((a, b) => b.price - a.price)
  } else if (sortBy === 'sales') {
    list.sort((a, b) => (b.sales || 0) - (a.sales || 0))
  } else if (sortBy === 'newest') {
    list.sort((a, b) => b.id - a.id)
  }

  const total = list.length
  const start = (page - 1) * pageSize
  const items = list.slice(start, start + pageSize)

  return { items, total, page, pageSize }
}

/**
 * 获取购物车
 */
export function getCart() {
  return getStorage('cart', [])
}

/**
 * 保存购物车
 */
export function saveCart(cart) {
  return setStorage('cart', cart)
}

/**
 * 获取订单列表
 */
export function getOrders() {
  return getStorage('orders', [])
}

/**
 * 保存订单
 */
export function saveOrder(order) {
  const orders = getOrders()
  order.id = generateId()
  order.createTime = new Date().toISOString()
  orders.unshift(order)
  setStorage('orders', orders)
  return order
}

/**
 * 获取商品评价
 */
export function getReviews(productId) {
  const reviews = getStorage('reviews', null)
  if (reviews === null) {
    // 首次加载，初始化默认评价
    setStorage('reviews', DEFAULT_REVIEWS)
    return DEFAULT_REVIEWS.filter(r => r.productId === Number(productId))
  }
  return reviews.filter(r => r.productId === Number(productId))
}

/**
 * 保存评价
 */
export function saveReview(review) {
  const reviews = getStorage('reviews', [])
  review.id = generateId()
  review.time = new Date().toLocaleString('zh-CN')
  reviews.unshift(review)
  setStorage('reviews', reviews)
  return review
}

/**
 * 获取优惠券列表
 */
export function getCoupons() {
  const coupons = getStorage('coupons', null)
  if (coupons === null) {
    setStorage('coupons', DEFAULT_COUPONS)
    return DEFAULT_COUPONS
  }
  return coupons
}
