<template>
  <div class="skeleton" :class="[`skeleton-${type}`]">
    <template v-if="type === 'card'">
      <div v-for="i in count" :key="i" class="skeleton-card">
        <div class="skeleton-image shimmer"></div>
        <div class="skeleton-body">
          <div class="skeleton-title shimmer"></div>
          <div class="skeleton-text shimmer"></div>
          <div class="skeleton-price shimmer"></div>
        </div>
      </div>
    </template>
    <template v-else-if="type === 'text'">
      <div v-for="i in count" :key="i" class="skeleton-text-row">
        <div class="skeleton-line shimmer" :style="{ width: `${60 + Math.random() * 40}%` }"></div>
      </div>
    </template>
    <template v-else-if="type === 'image'">
      <div v-for="i in count" :key="i" class="skeleton-image shimmer" style="height: 200px; border-radius: 12px;"></div>
    </template>
    <template v-else-if="type === 'detail'">
      <div class="skeleton-detail">
        <div class="skeleton-image shimmer" style="width: 420px; height: 420px; border-radius: 12px;"></div>
        <div class="skeleton-detail-info">
          <div class="skeleton-line shimmer" style="width: 60%; height: 24px;"></div>
          <div class="skeleton-line shimmer" style="width: 80%; height: 16px; margin-top: 12px;"></div>
          <div class="skeleton-line shimmer" style="width: 40%; height: 32px; margin-top: 20px;"></div>
          <div class="skeleton-line shimmer" style="width: 30%; height: 16px; margin-top: 20px;"></div>
          <div class="skeleton-line shimmer" style="width: 50%; height: 40px; margin-top: 24px;"></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'card' },
  count: { type: Number, default: 4 },
})
</script>

<style scoped>
.skeleton {
  display: contents;
}

/* 卡片骨架 */
.skeleton-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.skeleton-image {
  background: #e8e8e8;
  width: 100%;
  height: 180px;
}

.skeleton-body {
  padding: 14px;
}

.skeleton-title {
  height: 16px;
  width: 70%;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-text {
  height: 12px;
  width: 90%;
  border-radius: 4px;
  margin-bottom: 12px;
}

.skeleton-price {
  height: 20px;
  width: 40%;
  border-radius: 4px;
}

/* 文本骨架 */
.skeleton-text-row {
  margin-bottom: 12px;
}

.skeleton-line {
  height: 16px;
  border-radius: 4px;
  background: #e8e8e8;
}

/* 详情骨架 */
.skeleton-detail {
  display: flex;
  gap: 40px;
  background: #fff;
  border-radius: 12px;
  padding: 32px;
}

.skeleton-detail-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Shimmer 动画 */
.shimmer {
  position: relative;
  overflow: hidden;
  background: #e8e8e8;
}

.shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@media (max-width: 768px) {
  .skeleton-detail {
    flex-direction: column;
    gap: 20px;
  }
  .skeleton-image[style*="420px"] {
    width: 100% !important;
    height: 280px !important;
  }
}
</style>
