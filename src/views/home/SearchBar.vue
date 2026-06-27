<template>
  <div class="search-bar" ref="searchRef">
    <div class="search-input-wrap">
      <span class="search-icon">🔍</span>
      <input
        v-model="keyword"
        type="text"
        placeholder="搜索商品..."
        @input="onInput"
        @focus="showSuggestions = true"
        @keyup.enter="doSearch"
      />
      <button v-if="keyword" class="search-clear" @click="clearSearch">✕</button>
      <button class="search-btn" @click="doSearch">搜索</button>
    </div>

    <!-- 联想下拉 -->
    <Transition name="dropdown">
      <div v-if="showSuggestions && suggestions.length && keyword" class="suggestions">
        <div
          v-for="item in suggestions"
          :key="item.id"
          class="suggestion-item"
          @click="goToProduct(item.id)"
        >
          <span class="suggestion-name">{{ item.name }}</span>
          <span class="suggestion-price">¥{{ item.price.toFixed(2) }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { getProducts } from '@/api/product'
import { debounce } from '@/utils'

const router = useRouter()
const searchRef = ref(null)

const keyword = ref('')
const suggestions = ref([])
const showSuggestions = ref(false)

// 搜索联想（防抖300ms）
const onInput = debounce(() => {
  if (!keyword.value.trim()) {
    suggestions.value = []
    return
  }
  const all = getProducts()
  const kw = keyword.value.toLowerCase()
  suggestions.value = all
    .filter(p => p.name.toLowerCase().includes(kw) || p.description.toLowerCase().includes(kw))
    .slice(0, 5)
  showSuggestions.value = true
}, 300)

function doSearch() {
  if (!keyword.value.trim()) return
  showSuggestions.value = false
  router.push({ path: '/products', query: { keyword: keyword.value.trim() } })
}

function goToProduct(id) {
  showSuggestions.value = false
  router.push(`/product/${id}`)
}

function clearSearch() {
  keyword.value = ''
  suggestions.value = []
  showSuggestions.value = false
}

// 点击外部关闭
function handleClickOutside(e) {
  if (searchRef.value && !searchRef.value.contains(e.target)) {
    showSuggestions.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.search-bar {
  position: relative;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 24px;
  padding: 0 8px 0 16px;
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
  cursor: pointer;
}

.search-clear:hover {
  color: #e4393c;
}

.search-btn {
  padding: 8px 24px;
  border: none;
  border-radius: 20px;
  background: #e4393c;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.search-btn:hover {
  background: #c1272d;
}

/* 联想下拉 */
.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  margin-top: 8px;
  z-index: 50;
  overflow: hidden;
}

.suggestion-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.suggestion-item:hover {
  background: #f5f5f5;
}

.suggestion-name {
  font-size: 14px;
  color: #333;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.suggestion-price {
  font-size: 14px;
  font-weight: 600;
  color: #e4393c;
  margin-left: 12px;
  white-space: nowrap;
}

/* 下拉动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
