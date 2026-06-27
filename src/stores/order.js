import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getOrders, saveOrder, getProducts } from '@/api/product'
import { setStorage } from '@/utils/storage'

export const useOrderStore = defineStore('order', () => {
  const orders = ref([])

  function loadOrders() {
    orders.value = getOrders()
    // 用最新商品数据补充缺失的图片
    const products = getProducts()
    orders.value.forEach(order => {
      order.items.forEach(item => {
        if (!item.image && item.productId) {
          const product = products.find(p => p.id === item.productId)
          if (product && product.image) {
            item.image = product.image
          }
        }
      })
    })
    setStorage('orders', orders.value)
  }

  function createOrder(cartItems, totalPrice, address = null, userId = null) {
    const order = {
      items: cartItems,
      totalPrice,
      status: '待付款',  // 待付款 / 待发货 / 待收货 / 已完成 / 已取消
      address,
      userId,
    }
    const saved = saveOrder(order)
    orders.value.unshift(saved)
    return saved
  }

  function cancelOrder(orderId) {
    const order = orders.value.find(o => o.id === orderId)
    if (order && order.status === '待付款') {
      order.status = '已取消'
      setStorage('orders', orders.value)
    }
  }

  function payOrder(orderId) {
    const order = orders.value.find(o => o.id === orderId)
    if (order && order.status === '待付款') {
      order.status = '待发货'
      setStorage('orders', orders.value)
      // 模拟：2秒后自动变为待收货
      setTimeout(() => {
        order.status = '待收货'
        setStorage('orders', orders.value)
      }, 2000)
    }
  }

  function confirmReceive(orderId) {
    const order = orders.value.find(o => o.id === orderId)
    if (order && order.status === '待收货') {
      order.status = '已完成'
      setStorage('orders', orders.value)
    }
  }

  // 根据用户ID过滤订单
  function getUserOrders(userId) {
    return orders.value.filter(o => o.userId === userId)
  }

  // 根据状态过滤
  function getOrdersByStatus(status) {
    if (!status || status === '全部') return orders.value
    return orders.value.filter(o => o.status === status)
  }

  return {
    orders, loadOrders, createOrder, cancelOrder, payOrder, confirmReceive, getUserOrders, getOrdersByStatus,
  }
})
