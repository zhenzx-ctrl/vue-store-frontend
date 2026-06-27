import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getProducts, searchProducts } from '@/api/product'

export const useProductStore = defineStore('product', () => {
  const allProducts = ref([])
  const loading = ref(false)

  // 加载所有商品
  function loadProducts() {
    loading.value = true
    allProducts.value = getProducts()
    loading.value = false
  }

  // 搜索 + 分页 + 排序 + 价格区间
  function search({ keyword, category, page, pageSize, sortBy, priceMin, priceMax }) {
    return searchProducts({ keyword, category, page, pageSize, sortBy, priceMin, priceMax })
  }

  return { allProducts, loading, loadProducts, search }
})
