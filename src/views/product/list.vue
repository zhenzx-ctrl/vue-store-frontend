<template>
  <div class="product-list-page">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <div class="search-input-wrap">
        <span class="search-icon">🔍</span>
        <input
          v-model="keyword"
          type="text"
          placeholder="搜索商品名称或描述..."
          @input="onSearch"
        />
        <button v-if="keyword" class="search-clear" @click="keyword = ''; onSearch()">✕</button>
      </div>
    </div>

    <!-- 分类筛选 -->
    <div class="category-bar">
      <button
        :class="{ active: !currentCategory }"
        @click="currentCategory = ''; page = 1; loadData()"
      >全部</button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        :class="{ active: currentCategory === cat.name }"
        @click="currentCategory = cat.name; page = 1; loadData()"
      >{{ cat.icon }} {{ cat.name }}</button>
    </div>

    <!-- 高级筛选栏 -->
    <FilterBar @change="onFilterChange" />

    <!-- 商品列表 -->
    <div v-if="result.items.length" class="product-grid">
      <ProductCard v-for="product in result.items" :key="product.id" :product="product" />
    </div>

    <!-- 空状态 -->
    <Empty v-else icon="😕" text="没有找到相关商品" action-text="清除筛选" @action="resetFilter" />

    <!-- 分页 -->
    <Pagination v-model="page" :total="result.total" :page-size="pageSize" @update:model-value="loadData" />

    <!-- 移动端加载更多 -->
    <div v-if="result.items.length && result.total > result.items.length" class="load-more-mobile" @click="loadMore">
      加载更多
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { CATEGORIES } from '@/api/product'
import { useProductStore } from '@/stores/product'
import { debounce } from '@/utils'
import ProductCard from '@/components/ProductCard.vue'
import Pagination from '@/components/Pagination.vue'
import Empty from '@/components/Empty.vue'
import FilterBar from './FilterBar.vue'

const route = useRoute()
const productStore = useProductStore()
const categories = CATEGORIES

const keyword = ref('')
const currentCategory = ref('')
const page = ref(1)
const pageSize = 8
const sortBy = ref('')
const priceMin = ref(0)
const priceMax = ref(0)

const result = ref({ items: [], total: 0, page: 1, pageSize })

// 加载数据
function loadData() {
  result.value = productStore.search({
    keyword: keyword.value,
    category: currentCategory.value,
    page: page.value,
    pageSize,
    sortBy: sortBy.value,
    priceMin: priceMin.value,
    priceMax: priceMax.value,
  })
}

// 搜索防抖
const onSearch = debounce(() => {
  page.value = 1
  loadData()
}, 300)

// 筛选变更
function onFilterChange(filters) {
  sortBy.value = filters.sortBy
  priceMin.value = filters.priceMin
  priceMax.value = filters.priceMax
  page.value = 1
  loadData()
}

// 清除筛选
function resetFilter() {
  keyword.value = ''
  currentCategory.value = ''
  sortBy.value = ''
  priceMin.value = 0
  priceMax.value = 0
  page.value = 1
  loadData()
}

// 移动端加载更多
function loadMore() {
  page.value++
  const more = productStore.search({
    keyword: keyword.value,
    category: currentCategory.value,
    page: page.value,
    pageSize,
    sortBy: sortBy.value,
    priceMin: priceMin.value,
    priceMax: priceMax.value,
  })
  result.value = { ...more, items: [...result.value.items, ...more.items] }
}

// 监听路由 query
watch(() => route.query.category, (cat) => {
  if (cat) {
    currentCategory.value = cat
    page.value = 1
    loadData()
  }
}, { immediate: true })

watch(() => route.query.keyword, (kw) => {
  if (kw) {
    keyword.value = kw
    page.value = 1
    loadData()
  }
}, { immediate: true })

watch(() => route.query.sort, (s) => {
  if (s) {
    sortBy.value = s
    page.value = 1
    loadData()
  }
}, { immediate: true })

onMounted(() => {
  productStore.loadProducts()
  loadData()
})
</script>

<style scoped>
/* 搜索栏 */
.search-bar {
  margin-bottom: 16px;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 24px;
  padding: 0 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 2px solid transparent;
  transition: border-color 0.2s;
}

.search-input-wrap:focus-within {
  border-color: #e4393c;
}

.search-icon {
  font-size: 16px;
  margin-right: 8px;
}

.search-input-wrap input {
  flex: 1;
  border: none;
  outline: none;
  height: 44px;
  font-size: 15px;
  background: transparent;
  color: #333;
}

.search-input-wrap input::placeholder {
  color: #bbb;
}

.search-clear {
  background: none;
  border: none;
  color: #999;
  font-size: 14px;
  padding: 4px 8px;
}

.search-clear:hover {
  color: #e4393c;
}

/* 分类筛选 */
.category-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.category-bar button {
  padding: 8px 20px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: #fff;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;
}

.category-bar button:hover {
  border-color: #e4393c;
  color: #e4393c;
}

.category-bar button.active {
  background: #e4393c;
  color: #fff;
  border-color: #e4393c;
}

/* 商品网格 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

/* 移动端加载更多 */
.load-more-mobile {
  display: none;
  text-align: center;
  padding: 16px;
  margin-top: 20px;
  background: #fff;
  border-radius: 8px;
  color: #e4393c;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #e4393c;
  transition: background 0.2s;
}

.load-more-mobile:hover {
  background: #fff0f0;
}

/* 响应式 */
@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .load-more-mobile {
    display: block;
  }
}
</style>
