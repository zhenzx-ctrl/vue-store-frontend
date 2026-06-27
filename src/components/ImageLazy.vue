<template>
  <img
    v-if="src"
    ref="imgRef"
    :data-src="src"
    :alt="alt"
    class="lazy-image"
    :class="{ loaded: isLoaded }"
    :style="{ backgroundColor: placeholder }"
  />
  <div v-else class="lazy-image placeholder" :style="{ backgroundColor: placeholder }">
    <span>{{ fallbackText }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  placeholder: { type: String, default: '#f5f5f5' },
  fallbackText: { type: String, default: '暂无图片' },
})

const imgRef = ref(null)
const isLoaded = ref(false)
let observer = null

onMounted(() => {
  if (!imgRef.value) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          const realSrc = img.dataset.src
          if (realSrc) {
            img.src = realSrc
            img.onload = () => { isLoaded.value = true }
            img.onerror = () => { isLoaded.value = false }
          }
          observer.unobserve(img)
        }
      })
    },
    { rootMargin: '100px' }
  )

  observer.observe(imgRef.value)
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.lazy-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s;
  opacity: 0;
}

.lazy-image.loaded {
  opacity: 1;
}

.lazy-image.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  font-size: 14px;
  opacity: 1;
}
</style>
