/**
 * 商品数据接口
 * 数据源与后台管理系统共享 localStorage
 */
import { getAdminData, setAdminData, getStorage, setStorage } from '@/utils/storage'
import { generateId } from '@/utils'

// 图片 URL 生成辅助 — 只用 phone / laptop / audio / watch / appliance 五个前缀
const img = (seed) => `https://picsum.photos/seed/${seed}/400/400`
const imgs = (seed, count = 3) =>
  Array.from({ length: count }, (_, i) => `https://picsum.photos/seed/${seed}-${i + 1}/800/800`)

// 数据版本号 — 用于检测旧 localStorage 数据并自动重置
const STORE_DATA_VERSION = 'v2.0'

// 商品分类（6个，用于首页分类导航）
export const CATEGORIES = [
  { id: 1, name: '手机数码', icon: '📱' },
  { id: 2, name: '电脑办公', icon: '💻' },
  { id: 3, name: '音频设备', icon: '🎧' },
  { id: 4, name: '智能穿戴', icon: '⌚' },
  { id: 5, name: '家用电器', icon: '🏠' },
  { id: 6, name: '服饰鞋包', icon: '👟' },
]

// 默认商品数据（30 个精选商品，覆盖 5 大图片品类各 6 个）
const DEFAULT_PRODUCTS = [
  // ===== 手机 / phone (5) =====
  { id: 1, name: 'iPhone 15 Pro Max', price: 9999, category: '手机数码', description: 'A17 Pro 芯片，钛金属设计，4800万像素主摄', status: 1, image: img('phone-1'), images: imgs('phone-1'), skus: [{ color: '原色钛金属', size: '256GB' }, { color: '白色钛金属', size: '512GB' }], sales: 3286 },
  { id: 2, name: 'Samsung Galaxy S24 Ultra', price: 8999, category: '手机数码', description: '骁龙8 Gen3，AI 智能助手，S Pen 书写体验', status: 1, image: img('phone-2'), images: imgs('phone-2'), skus: [{ color: '钛灰', size: '256GB' }, { color: '钛紫', size: '512GB' }], sales: 2150 },
  { id: 3, name: 'Xiaomi 14 Pro', price: 4999, category: '手机数码', description: '徕卡光学镜头，骁龙8 Gen3，120W 超级快充', status: 1, image: img('phone-3'), images: imgs('phone-3'), skus: [{ color: '黑色', size: '256GB' }, { color: '白色', size: '512GB' }], sales: 4567 },
  { id: 4, name: 'OPPO Find X7 Ultra', price: 5999, category: '手机数码', description: '双潜望镜头，哈苏人像大师，潮汐架构', status: 1, image: img('phone-4'), images: imgs('phone-4'), skus: [{ color: '海阔天空', size: '256GB' }, { color: '大漠银月', size: '512GB' }], sales: 1832 },
  { id: 5, name: 'Huawei P70 Pro', price: 6999, category: '手机数码', description: 'XMAGE 影像，北斗卫星通信，超可靠昆仑玻璃', status: 1, image: img('phone-5'), images: imgs('phone-5'), skus: [{ color: '罗兰紫', size: '256GB' }, { color: '羽砂黑', size: '512GB' }], sales: 2910 },

  // ===== 电脑 / laptop (5) =====
  { id: 6, name: 'MacBook Pro 14"', price: 14999, category: '电脑办公', description: 'Apple M3 Pro 芯片，14英寸 Liquid Retina XDR 显示屏', status: 1, image: img('laptop-1'), images: imgs('laptop-1'), skus: [{ color: '深空黑', size: '512GB' }, { color: '银色', size: '1TB' }], sales: 3280 },
  { id: 7, name: 'MacBook Air M3', price: 8999, category: '电脑办公', description: 'M3 芯片，轻薄设计，18小时续航', status: 1, image: img('laptop-2'), images: imgs('laptop-2'), skus: [{ color: '午夜色', size: '256GB' }, { color: '星光色', size: '512GB' }], sales: 5640 },
  { id: 8, name: 'ThinkPad X1 Carbon Gen 12', price: 10999, category: '电脑办公', description: 'Intel Core Ultra，商务旗舰，军工级耐用', status: 1, image: img('laptop-3'), images: imgs('laptop-3'), skus: [{ color: '黑色', size: '512GB' }, { color: '黑色', size: '1TB' }], sales: 1290 },
  { id: 9, name: 'Dell XPS 16', price: 12999, category: '电脑办公', description: 'Intel Core Ultra 9，OLED 触控屏，极致轻薄', status: 1, image: img('laptop-4'), images: imgs('laptop-4'), skus: [{ color: '铂金银', size: '1TB' }, { color: '石墨黑', size: '2TB' }], sales: 870 },
  { id: 10, name: 'ASUS ROG Zephyrus G16', price: 13999, category: '电脑办公', description: 'RTX 4070 独显，16英寸 240Hz 电竞屏', status: 1, image: img('laptop-5'), images: imgs('laptop-5'), skus: [{ color: '月光银', size: '1TB' }, { color: '日蚀灰', size: '2TB' }], sales: 2150 },

  // ===== 音频 / audio (5) =====
  { id: 11, name: 'AirPods Pro 2', price: 1899, category: '音频设备', description: 'H2 芯片，自适应降噪，USB-C 充电，空间音频', status: 1, image: img('audio-1'), images: imgs('audio-1'), skus: [{ color: '白色', size: '标准' }], sales: 8970 },
  { id: 12, name: 'Sony WH-1000XM5', price: 2499, category: '音频设备', description: '行业顶级降噪，30小时续航，LDAC 高清编码', status: 1, image: img('audio-2'), images: imgs('audio-2'), skus: [{ color: '黑色', size: '标准' }, { color: '铂金银', size: '标准' }], sales: 3450 },
  { id: 13, name: 'JBL Charge 5', price: 1299, category: '音频设备', description: 'IP67 防水，20小时续航，强劲低音', status: 1, image: img('audio-3'), images: imgs('audio-3'), skus: [{ color: '黑色', size: '标准' }, { color: '蓝色', size: '标准' }, { color: '红色', size: '标准' }], sales: 5620 },
  { id: 14, name: 'Bose QuietComfort Ultra', price: 2299, category: '音频设备', description: '沉浸式空间音频，CustomTune 降噪技术', status: 1, image: img('audio-4'), images: imgs('audio-4'), skus: [{ color: '黑色', size: '标准' }, { color: '白色', size: '标准' }], sales: 1890 },
  { id: 15, name: 'Xiaomi Buds 4 Pro', price: 999, category: '音频设备', description: '三核降噪，Hi-Res 认证，38小时续航', status: 1, image: img('audio-5'), images: imgs('audio-5'), skus: [{ color: '曜石黑', size: '标准' }, { color: '陶瓷白', size: '标准' }], sales: 6780 },

  // ===== 手表 / watch (5) =====
  { id: 16, name: 'Apple Watch Series 9', price: 3199, category: '智能穿戴', description: 'S9 芯片，全天候视网膜屏，血氧检测', status: 1, image: img('watch-1'), images: imgs('watch-1'), skus: [{ color: '午夜色', size: '45mm' }, { color: '星光色', size: '41mm' }], sales: 4320 },
  { id: 17, name: 'Samsung Galaxy Watch 6', price: 2399, category: '智能穿戴', description: 'Wear OS，BioActive 传感器，体脂检测', status: 1, image: img('watch-2'), images: imgs('watch-2'), skus: [{ color: '石墨黑', size: '44mm' }, { color: '金色', size: '40mm' }], sales: 2150 },
  { id: 18, name: 'Huawei Watch GT 4', price: 1599, category: '智能穿戴', description: '14天续航，专业健康管理，高尔夫模式', status: 1, image: img('watch-3'), images: imgs('watch-3'), skus: [{ color: '黑色', size: '46mm' }, { color: '白色', size: '41mm' }], sales: 3890 },
  { id: 19, name: 'Garmin Forerunner 265', price: 3280, category: '智能穿戴', description: 'AMOLED 屏，多频多星定位，训练准备指数', status: 1, image: img('watch-4'), images: imgs('watch-4'), skus: [{ color: '黑色', size: '42mm' }, { color: '白色', size: '42mm' }], sales: 980 },
  { id: 20, name: 'Fitbit Charge 6', price: 1199, category: '智能穿戴', description: 'Google 生态整合，ECG 检测，压力管理', status: 1, image: img('watch-5'), images: imgs('watch-5'), skus: [{ color: '黑色', size: '标准' }, { color: '蓝色', size: '标准' }], sales: 2560 },

  // ===== 家电 / appliance (5) =====
  { id: 21, name: 'Dyson V15 Detect Vacuum', price: 4999, category: '家用电器', description: '激光探测，智能灰尘感应，强力吸除微尘', status: 1, image: img('appliance-1'), images: imgs('appliance-1'), skus: [{ color: '金色', size: '标准' }], sales: 1560 },
  { id: 22, name: '智能空气炸锅 6L', price: 599, category: '家用电器', description: '可视窗口，多功能菜单，无油健康烹饪', status: 1, image: img('appliance-2'), images: imgs('appliance-2'), skus: [{ color: '白色', size: '6L' }, { color: '黑色', size: '6L' }], sales: 8920 },
  { id: 23, name: 'IH 智能电饭煲', price: 899, category: '家用电器', description: 'IH 电磁加热，24小时预约，多种烹饪模式', status: 1, image: img('appliance-3'), images: imgs('appliance-3'), skus: [{ color: '白色', size: '4L' }, { color: '香槟金', size: '5L' }], sales: 5670 },
  { id: 24, name: '智能电热水壶 Pro', price: 299, category: '家用电器', description: '1.7L 大容量，5段控温，除氯沸腾，304不锈钢', status: 1, image: img('appliance-4'), images: imgs('appliance-4'), skus: [{ color: '白色', size: '1.7L' }, { color: '黑色', size: '1.7L' }], sales: 12340 },
  { id: 25, name: '空气净化器 4 Pro', price: 2599, category: '家用电器', description: 'CADR 500，HEPA H13 滤网，智能PM2.5显示', status: 1, image: img('appliance-5'), images: imgs('appliance-5'), skus: [{ color: '白色', size: '标准' }], sales: 2340 },

  // ===== 服饰鞋包 (用 phone-6 / laptop-6 / audio-6 / watch-6 / appliance-6 保持5前缀) =====
  { id: 26, name: '经典商务衬衫', price: 299, category: '服饰鞋包', description: '100% 长绒棉，免烫工艺，挺括有型', status: 1, image: img('phone-6'), images: imgs('phone-6'), skus: [{ color: '白色', size: 'M' }, { color: '浅蓝', size: 'L' }, { color: '白色', size: 'XL' }], sales: 5620 },
  { id: 27, name: '加绒休闲卫衣', price: 459, category: '服饰鞋包', description: '320g 加绒面料，复古版型，秋冬百搭', status: 1, image: img('laptop-6'), images: imgs('laptop-6'), skus: [{ color: '灰色', size: 'M' }, { color: '黑色', size: 'L' }, { color: '墨绿', size: 'XL' }], sales: 7430 },
  { id: 28, name: '轻量运动跑鞋', price: 699, category: '服饰鞋包', description: '超轻缓震中底，透气飞织鞋面，回弹出色', status: 1, image: img('audio-6'), images: imgs('audio-6'), skus: [{ color: '黑白', size: '42' }, { color: '全黑', size: '43' }, { color: '白蓝', size: '41' }], sales: 10240 },
  { id: 29, name: '真皮商务钱包', price: 349, category: '服饰鞋包', description: '头层牛皮，RFID 防盗刷，超薄多卡位', status: 1, image: img('watch-6'), images: imgs('watch-6'), skus: [{ color: '棕色', size: '标准' }, { color: '黑色', size: '标准' }], sales: 3450 },
  { id: 30, name: '设计师款帆布包', price: 199, category: '服饰鞋包', description: '加厚帆布，大容量，通勤购物两用', status: 1, image: img('appliance-6'), images: imgs('appliance-6'), skus: [{ color: '米白', size: '均码' }, { color: '黑色', size: '均码' }], sales: 6780 },
]

// 轮播图数据（增加图片字段）
export const BANNERS = [
  { id: 1, title: '新品首发 · 数码盛宴', subtitle: '最新旗舰手机/电脑，限时12期免息', bgColor: 'linear-gradient(135deg, #1a1a2e, #16213e)', image: 'https://picsum.photos/seed/banner-1/1200/400' },
  { id: 2, title: '夏日出清 · 服饰特惠', subtitle: '全场服饰低至 5 折，满 299 包邮', bgColor: 'linear-gradient(135deg, #16213e, #0f3460)', image: 'https://picsum.photos/seed/banner-2/1200/400' },
  { id: 3, title: '智能生活节', subtitle: '家电/穿戴设备限时直降，以旧换新', bgColor: 'linear-gradient(135deg, #0f3460, #533483)', image: 'https://picsum.photos/seed/banner-3/1200/400' },
  { id: 4, title: '音频盛典', subtitle: '降噪耳机/音箱全场 8 折起，品质好声音', bgColor: 'linear-gradient(135deg, #533483, #1a1a2e)', image: 'https://picsum.photos/seed/banner-4/1200/400' },
]

// 限时秒杀数据
export const FLASH_SALE_PRODUCTS = [
  { id: 101, name: '智能手表 Pro', price: 599, originalPrice: 1299, category: '智能穿戴', description: '健康监测，超长续航', status: 1, image: img('watch-1'), images: imgs('watch-1'), skus: [{ color: '黑色', size: '标准' }], sales: 9999 },
  { id: 102, name: '轻薄羽绒服', price: 299, originalPrice: 899, category: '服饰鞋包', description: '90% 白鹅绒，轻薄保暖，可收纳设计', status: 1, image: img('phone-7'), images: imgs('phone-7'), skus: [{ color: '黑色', size: 'L' }, { color: '白色', size: 'M' }], sales: 15670 },
  { id: 103, name: '真无线降噪耳机', price: 49, originalPrice: 159, category: '音频设备', description: '主动降噪，IPX5 防水，24小时续航', status: 1, image: img('audio-5'), images: imgs('audio-5'), skus: [{ color: '白色', size: '标准' }], sales: 23450 },
  { id: 104, name: '智能空气炸锅', price: 199, originalPrice: 499, category: '家用电器', description: '5.5L 大容量，可视窗口，APP 远程控制', status: 1, image: img('appliance-2'), images: imgs('appliance-2'), skus: [{ color: '白色', size: '5.5L' }, { color: '黑色', size: '5.5L' }], sales: 8760 },
]

// 秒杀结束时间（当前时间 + 24小时）
export function getFlashSaleEnd() {
  const end = new Date()
  end.setHours(end.getHours() + 24)
  return end.toISOString()
}

// 活动横幅数据
export const PROMOTION_BANNERS = [
  { id: 1, title: '满减优惠', subtitle: '满299减50，满599减120，上不封顶', bgColor: '#FFF0E8', textColor: '#FF6B35' },
  { id: 2, title: '新人专享', subtitle: '新用户注册即送 30 元无门槛优惠券', bgColor: '#E8F4FD', textColor: '#4A6CF7' },
]

// 默认评价数据
const DEFAULT_REVIEWS = [
  { id: 1, productId: 1, username: '科技达人', rating: 5, content: '性能强劲，钛金属手感一流，相机提升巨大！', images: [], time: '2025-06-15 14:30' },
  { id: 2, productId: 6, username: '设计师小王', rating: 5, content: '屏幕素质顶级，色准极佳，剪视频太爽了。', images: [], time: '2025-06-10 09:15' },
  { id: 3, productId: 11, username: '数码控', rating: 5, content: '降噪效果惊艳，比上一代提升很多，舒适度也好。', images: [], time: '2025-06-20 18:45' },
  { id: 4, productId: 2, username: '摄影爱好者', rating: 4, content: 'AI 功能很实用，就是电池还可以再优化。', images: [], time: '2025-06-18 10:20' },
  { id: 5, productId: 26, username: '职场精英', rating: 5, content: '面料很舒服，免烫确实方便，回购第三件了。', images: [], time: '2025-06-22 16:00' },
  { id: 6, productId: 27, username: '潮流达人', rating: 4, content: '加绒很暖和，配色很好看，就是偏大一码。', images: [], time: '2025-06-19 11:30' },
  { id: 7, productId: 28, username: '跑步爱好者', rating: 5, content: '轻量缓震效果很好，跑了10公里脚不累，透气性也好。', images: [], time: '2025-06-21 07:45' },
  { id: 8, productId: 22, rating: 5, username: '厨房小白', content: '操作简单，炸薯条不用油也很脆，清洗也方便！', images: [], time: '2025-06-17 20:10' },
  { id: 9, productId: 16, username: '健身达人', rating: 5, content: '运动数据精准，睡眠监测很准，续航满意。', images: [], time: '2025-06-23 08:30' },
  { id: 10, productId: 21, username: '家务能手', rating: 4, content: '吸力真的强，激光探测能看见微尘，就是价格略高。', images: [], time: '2025-06-16 15:45' },
]

// 优惠券数据
export const DEFAULT_COUPONS = [
  { id: 1, name: '新人专享券', discount: 30, minSpend: 99, expiry: '2026-07-31', used: false },
  { id: 2, name: '满减优惠券', discount: 50, minSpend: 299, expiry: '2026-07-31', used: false },
  { id: 3, name: '大额折扣券', discount: 120, minSpend: 599, expiry: '2026-08-31', used: false },
  { id: 4, name: '免运费券', discount: 10, minSpend: 0, expiry: '2026-07-31', used: true },
]

/**
 * 获取商品列表（优先读取后台数据，否则使用默认数据）
 * 检测旧版 localStorage 数据（版本号不匹配时自动重置）
 */
export function getProducts() {
  const adminProducts = getAdminData('products')
  const storedVersion = getStorage('store_data_version', '')

  // 检测数据是否需要刷新（版本不匹配或旧格式数据）
  const needsReset = storedVersion !== STORE_DATA_VERSION ||
    (adminProducts && adminProducts.length > 0 &&
      (adminProducts[0].category === '电子产品' || // 旧版分类名
       !adminProducts[0].image?.includes('/seed/phone-')))

  if (adminProducts && adminProducts.length > 0 && !needsReset) {
    // 新版数据，补充可能缺失的图片
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
  // 首次使用或旧数据 —— 写入新默认数据
  const defaults = DEFAULT_PRODUCTS
  setAdminData('products', defaults)
  setStorage('store_data_version', STORE_DATA_VERSION)
  return defaults.filter(p => p.status === 1)
}

/**
 * 获取商品详情
 */
export function getProductById(id) {
  const products = getProducts()
  const numId = Number(id)
  // 先查主商品列表
  const found = products.find(p => p.id === numId)
  if (found) return found
  // 再查限时秒杀商品（它们不在主列表里但详情页也要能访问）
  return FLASH_SALE_PRODUCTS.find(p => p.id === numId) || null
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
