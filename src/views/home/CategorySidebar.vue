<template>
  <div class="category-sidebar">
    <h4 class="sidebar-title">全部分类</h4>
    <div class="category-list">
      <router-link
        v-for="cat in categories"
        :key="cat.id"
        :to="`/products?category=${cat.name}`"
        class="category-item"
      >
        <span class="cat-icon">{{ cat.icon }}</span>
        <div class="cat-info">
          <span class="cat-name">{{ cat.name }}</span>
          <span class="cat-desc">{{ cat.subtitle }}</span>
        </div>
        <span class="cat-arrow">→</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { CATEGORIES } from '@/api/product'

// 添加副标题
const categories = CATEGORIES.map(cat => {
  const subtitles = {
    '手机数码': '旗舰新机热销',
    '电脑办公': '办公娱乐利器',
    '音频设备': '聆听好声音',
    '智能穿戴': '科技潮品',
    '家用电器': '品质生活',
    '服饰鞋包': '时尚穿搭',
  }
  return { ...cat, subtitle: subtitles[cat.name] || '' }
})
</script>

<style scoped>
.category-sidebar {
  background: var(--color-white, #fff);
  border-radius: var(--radius-md, 10px);
  overflow: hidden;
  box-shadow: var(--shadow-card, 0 2px 12px rgba(0, 0, 0, 0.04));
  border: 1px solid var(--color-border-light, #f3f4f6);
}

.sidebar-title {
  font-size: 15px;
  font-weight: var(--weight-semibold, 600);
  color: var(--gray-900, #1F2937);
  margin: 0;
  padding: 16px 20px 12px;
  border-bottom: 1px solid var(--gray-200, #edeef2);
}

.category-list {
  padding: 4px 0;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 11px 20px;
  text-decoration: none;
  color: var(--gray-700, #4B5563);
  transition: all var(--transition-fast, 0.15s);
  gap: 10px;
}

.category-item:hover {
  background: var(--color-primary-lighter, #FFF0E8);
  color: var(--color-primary, #FF6B35);
}

.cat-icon {
  font-size: 22px;
  width: 32px;
  text-align: center;
  flex-shrink: 0;
}

.cat-info {
  flex: 1;
  min-width: 0;
}

.cat-name {
  font-size: 14px;
  font-weight: var(--weight-medium, 500);
  display: block;
}

.cat-desc {
  font-size: 11px;
  color: var(--gray-400, #b0b5bd);
  display: block;
  margin-top: 1px;
}

.category-item:hover .cat-desc {
  color: var(--color-primary-light, #FF8A5C);
}

.cat-arrow {
  font-size: 14px;
  color: var(--gray-300, #d0d5dd);
  transition: transform var(--transition-fast, 0.15s);
}

.category-item:hover .cat-arrow {
  color: var(--color-primary, #FF6B35);
  transform: translateX(3px);
}

/* 移动端水平滚动 */
@media (max-width: 768px) {
  .category-sidebar {
    border-radius: 0;
  }
  .sidebar-title {
    display: none;
  }
  .cat-desc {
    display: none;
  }
  .category-list {
    display: flex;
    overflow-x: auto;
    padding: 8px;
    gap: 8px;
    -webkit-overflow-scrolling: touch;
  }
  .category-item {
    flex-shrink: 0;
    padding: 8px 16px;
    background: var(--gray-100, #f7f8fa);
    border-radius: 20px;
    flex-direction: column;
    gap: 2px;
  }
  .cat-arrow {
    display: none;
  }
  .cat-icon {
    width: auto;
    font-size: 20px;
  }
  .cat-name {
    font-size: 12px;
  }
}
</style>
