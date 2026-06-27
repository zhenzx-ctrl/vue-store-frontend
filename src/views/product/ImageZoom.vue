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
          <button @click="currentIdx = (currentIdx - 1 + images.length) % images.length">‹ 上一张</button>
          <span>{{ currentIdx + 1 }} / {{ images.length }}</span>
          <button @click="currentIdx = (currentIdx + 1) % images.length">下一张 ›</button>
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

// 放大镜位置
const lensStyle = computed(() => ({
  left: `${lensX.value - 75}px`,
  top: `${lensY.value - 75}px`,
}))

// 放大结果容器位置（右侧）
const resultStyle = computed(() => ({
  backgroundImage: currentImage.value ? `url(${currentImage.value})` : 'none',
}))

// 放大结果图片样式
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
  height: 420px;
  border-radius: 12px;
  overflow: hidden;
  background: #f5f5f5;
  position: relative;
  cursor: zoom-in;
}

.zoom-lens {
  position: absolute;
  width: 150px;
  height: 150px;
  border: 2px solid #e4393c;
  border-radius: 4px;
  pointer-events: none;
  background: rgba(228, 57, 60, 0.1);
  z-index: 10;
}

.zoom-result {
  position: absolute;
  left: 100%;
  top: 0;
  width: 300px;
  height: 300px;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  z-index: 20;
  background: #f5f5f5;
  margin-left: 12px;
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
}

.thumb-item {
  width: 64px;
  height: 64px;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  flex-shrink: 0;
  transition: border-color 0.2s;
  background: #f5f5f5;
}

.thumb-item.active {
  border-color: #e4393c;
}

.thumb-item:hover {
  border-color: #e4393c;
}

/* 全屏预览 */
.full-preview {
  text-align: center;
}

.full-preview img {
  max-width: 100%;
  max-height: 500px;
  border-radius: 8px;
}

.full-preview-empty {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.full-preview-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}

.full-preview-nav button {
  padding: 6px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: #fff;
  color: #666;
  font-size: 13px;
  cursor: pointer;
}

.full-preview-nav button:hover {
  border-color: #e4393c;
  color: #e4393c;
}

.full-preview-nav span {
  font-size: 14px;
  color: #999;
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
