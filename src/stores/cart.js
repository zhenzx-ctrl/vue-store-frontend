import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCart, saveCart } from '@/api/product'
import { getProducts } from '@/api/product'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  // 购物车商品总数
  const totalCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

  // 购物车总价
  const totalPrice = computed(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0))

  // 是否全选
  const isAllSelected = computed(() => items.value.length > 0 && items.value.every(item => item.selected))

  // 已选商品
  const selectedItems = computed(() => items.value.filter(item => item.selected))

  // 失效商品（商品已下架或不存在）
  const invalidItems = computed(() => {
    const allProducts = getProducts()
    return items.value.filter(item => {
      const product = allProducts.find(p => p.id === item.productId)
      return !product || product.status !== 1
    })
  })

  // 有效商品
  const validItems = computed(() => {
    const invalidIds = invalidItems.value.map(i => `${i.productId}-${i.skuKey}`)
    return items.value.filter(item => !invalidIds.includes(`${item.productId}-${item.skuKey}`))
  })

  // 初始化购物车
  function loadCart() {
    items.value = getCart()
    // 用最新商品数据补充缺失的图片
    const products = getProducts()
    items.value.forEach(item => {
      if (!item.image && item.productId) {
        const product = products.find(p => p.id === item.productId)
        if (product && product.image) {
          item.image = product.image
        }
      }
    })
    saveCart(items.value)
  }

  // 添加商品（返回结果，由组件判断是否跳转登录）
  function addItem(product, sku = null, quantity = 1) {
    const skuKey = sku ? `${sku.color || ''}-${sku.size || ''}` : 'default'
    const exist = items.value.find(item => item.productId === product.id && item.skuKey === skuKey)

    if (exist) {
      exist.quantity += quantity
    } else {
      items.value.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image || '',
        sku: sku,
        skuKey,
        quantity,
        selected: true,
      })
    }
    saveCart(items.value)
  }

  // 移除商品
  function removeItem(skuKey, productId) {
    items.value = items.value.filter(item => !(item.productId === productId && item.skuKey === skuKey))
    saveCart(items.value)
  }

  // 更新数量
  function updateQuantity(skuKey, productId, quantity) {
    const item = items.value.find(item => item.productId === productId && item.skuKey === skuKey)
    if (item) {
      item.quantity = Math.max(1, quantity)
      saveCart(items.value)
    }
  }

  // 切换选中
  function toggleSelect(skuKey, productId) {
    const item = items.value.find(item => item.productId === productId && item.skuKey === skuKey)
    if (item) {
      item.selected = !item.selected
      saveCart(items.value)
    }
  }

  // 全选/取消全选
  function toggleSelectAll() {
    const select = !isAllSelected.value
    items.value.forEach(item => { item.selected = select })
    saveCart(items.value)
  }

  // 清除已选
  function clearSelected() {
    items.value = items.value.filter(item => !item.selected)
    saveCart(items.value)
  }

  // 清除失效商品
  function removeInvalidItems() {
    const invalidKeys = invalidItems.value.map(i => `${i.productId}-${i.skuKey}`)
    items.value = items.value.filter(item => !invalidKeys.includes(`${item.productId}-${item.skuKey}`))
    saveCart(items.value)
  }

  // 批量删除
  function batchRemove(skuKeys) {
    items.value = items.value.filter(item => !skuKeys.includes(`${item.productId}-${item.skuKey}`))
    saveCart(items.value)
  }

  return {
    items, totalCount, totalPrice, isAllSelected, selectedItems, invalidItems, validItems,
    loadCart, addItem, removeItem, updateQuantity, toggleSelect, toggleSelectAll, clearSelected, removeInvalidItems, batchRemove,
  }
})
