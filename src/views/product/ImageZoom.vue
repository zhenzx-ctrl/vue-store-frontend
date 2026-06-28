<template>
  <div class="image-zoom">
    <!-- 主图 -->
    <div class="main-image" @mouseenter="showLens = true" @mouseleave="showLens = false" @mousemove="onMouseMove" @click="showFullPreview = true">
      <ImageLazy :src="currentImage" :fallback-text="fallbackText" />
      <!-- 放大镜 -->
      <div v-if="showLens" class="zoom-lens" :style="lensStyle"></div>
      <!-- 放大区域 -->
      <div v-if="showLens" class="zoom-result" :style="resultStyle">
        <div class="zoom-result-img" :style="resultImgStyle"></div>
      </div>
    </div>

    <!-- 缩略图列表 -->
    <div v-if="images.length > 1" class="thumb-list">
      <div
        v-for="(img, i) in images"
        :key="i"
        :class="['thumb-item', { active: currentIdx === i }]"
        @click="currentIdx = i"
      >
        <ImageLazy :src="img" :fallback-text="fallbackText" />
      </div>
    </div>

    <!-- 全屏预览 -->
    <Modal :visible="showFullPreview" title="图片预览" width="700px" :show-footer="false" @close="showFullPreview = false">
      <div class="full-preview">
        <img v-if="currentImage" :src="currentImage" :alt="fallbackText" />
        <div v-else class="full-preview-empty">{{ fallbackText }}</div>
        <div v-if="images.length > 1" class="full-preview-nav">
          <button class="nav-btn" @click="currentIdx = (currentIdx - 1 + images.length) % images.length">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            上一张
          </button>
          <span class="nav-counter">{{ currentIdx + 1 }} / {{ images.length }}</span>
          <button class="nav-btn" @click="currentIdx = (currentIdx + 1) % images.length">
            下一张
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ImageLazy from '@/components/ImageLazy.vue'
import Modal from '@/components/Modal.vue'

const props = defineProps({
  images: { type: Array, default: () => [] },
  fallbackText: { type: String, default: '暂无图片' },
})

const currentIdx = ref(0)
const showLens = ref(false)
const showFullPreview = ref(false)
const lensX = ref(0)
const lensY = ref(0)

const currentImage = computed(() => {
  if (!props.images.length) return ''
  return props.images[currentIdx.value] || ''
})

const lensStyle = computed(() => ({
  left: `${lensX.value - 75}px`,
  top: `${lensY.value - 75}px`,
}))

const resultStyle = computed(() => ({
  backgroundImage: currentImage.value ? `url(${currentImage.value})` : 'none',
}))

const resultImgStyle = computed(() => ({
  backgroundImage: currentImage.value ? `url(${currentImage.value})` : 'none',
  backgroundPosition: `${-lensX.value * 2}px ${-lensY.value * 2}px`,
}))

function onMouseMove(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  lensX.value = e.clientX - rect.left
  lensY.value = e.clientY - rect.top
}
</script>

<style scoped>
.image-zoom {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.main-image {
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--radius-md, 10px);
  overflow: hidden;
  background: var(--gray-100, #f7f8fa);
  position: relative;
  cursor: zoom-in;
  border: 1px solid var(--color-border-light, #f3f4f6);
}

.main-image :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.zoom-lens {
  position: absolute;
  width: 150px;
  height: 150px;
  border: 2px solid var(--color-primary, #FF6B35);
  border-radius: 4px;
  pointer-events: none;
  background: rgba(255, 107, 53, 0.08);
  z-index: 10;
}

.zoom-result {
  position: absolute;
  left: calc(100% + 16px);
  top: 0;
  width: 340px;
  height: 340px;
  border: 1px solid var(--gray-200, #edeef2);
  border-radius: var(--radius-sm, 6px);
  overflow: hidden;
  z-index: 20;
  background: var(--color-white, #fff);
  box-shadow: var(--shadow-lg, 0 10px 40px rgba(0,0,0,0.08));
}

.zoom-result-img {
  width: 200%;
  height: 200%;
  background-repeat: no-repeat;
  background-size: cover;
}

.thumb-list {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0;
}

.thumb-item {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-sm, 6px);
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  flex-shrink: 0;
  transition: border-color var(--transition-fast, 0.15s);
  background: var(--gray-100, #f7f8fa);
}

.thumb-item.active {
  border-color: var(--color-primary, #FF6B35);
}

.thumb-item:hover {
  border-color: var(--color-primary-light, #FF8A5C);
}

.thumb-item :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 全屏预览 */
.full-preview {
  text-align: center;
}

.full-preview img {
  max-width: 100%;
  max-height: 500px;
  border-radius: var(--radius-sm, 6px);
}

.full-preview-empty {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-400, #b0b5bd);
  font-size: 16px;
  background: var(--gray-100, #f7f8fa);
  border-radius: var(--radius-sm, 6px);
}

.full-preview-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 16px;
}

.nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border: 1.5px solid var(--gray-200, #edeef2);
  border-radius: 20px;
  background: var(--color-white, #fff);
  color: var(--gray-600, #6B7280);
  font-size: 13px;
  cursor: pointer;
  transition: all var(--transition-fast, 0.15s);
  font-family: inherit;
}

.nav-btn:hover {
  border-color: var(--color-primary, #FF6B35);
  color: var(--color-primary, #FF6B35);
}

.nav-btn svg {
  width: 14px;
  height: 14px;
}

.nav-counter {
  font-size: 14px;
  color: var(--gray-500, #8B909A);
  font-weight: 500;
}

@media (max-width: 768px) {
  .main-image {
    height: 280px;
  }
  .zoom-lens,
  .zoom-result {
    display: none;
  }
}
</style>
