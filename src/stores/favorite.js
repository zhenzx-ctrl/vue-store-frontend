import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getStorage, setStorage } from '@/utils/storage'
import { getProducts } from '@/api/product'

export const useFavoriteStore = defineStore('favorite', () => {
  const items = ref([])

  // 是否已收藏
  function isFavorite(productId) {
    return items.value.some(f => f.id === productId)
  }

  // 切换收藏
  function toggleFavorite(product) {
    const idx = items.value.findIndex(f => f.id === product.id)
    if (idx >= 0) {
      items.value.splice(idx, 1)
    } else {
      items.value.unshift({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || '',
        category: product.category,
      })
    }
    save()
  }

  // 移除收藏
  function removeFavorite(productId) {
    items.value = items.value.filter(f => f.id !== productId)
    save()
  }

  // 清空收藏
  function clearFavorites() {
    items.value = []
    save()
  }

  // 加载
  function loadFavorites() {
    items.value = getStorage('favorites', [])
    // 用最新商品数据补充缺失的图片
    const products = getProducts()
    items.value.forEach(f => {
      if (!f.image) {
        const product = products.find(p => p.id === f.id)
        if (product && product.image) {
          f.image = product.image
        }
      }
    })
    save()
  }

  // 持久化
  function save() {
    setStorage('favorites', items.value)
  }

  return { items, isFavorite, toggleFavorite, removeFavorite, clearFavorites, loadFavorites }
})
