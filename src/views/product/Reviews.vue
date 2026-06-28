<template>
  <div class="reviews-section">
    <h3 class="reviews-title">用户评价 ({{ reviews.length }})</h3>

    <!-- 评价列表 -->
    <div v-if="reviews.length" class="review-list">
      <div v-for="review in reviews" :key="review.id" class="review-item">
        <div class="review-header">
          <span class="review-avatar">{{ review.username.charAt(0) }}</span>
          <span class="review-username">{{ review.username }}</span>
          <div class="review-rating">
            <span v-for="s in 5" :key="s" :class="['star', { active: s <= review.rating }]">★</span>
          </div>
          <span class="review-time">{{ review.time }}</span>
        </div>
        <p class="review-content">{{ review.content }}</p>
        <div v-if="review.images && review.images.length" class="review-images">
          <img v-for="(img, i) in review.images" :key="i" :src="img" class="review-img" />
        </div>
      </div>
    </div>

    <!-- 无评价 -->
    <div v-else class="reviews-empty">
      <p>暂无评价，快来发表第一条评价吧！</p>
    </div>

    <!-- 发表评价 -->
    <div v-if="userStore.isLoggedIn" class="review-form">
      <h4>发表评价</h4>
      <div class="form-rating">
        <span>评分：</span>
        <span
          v-for="s in 5"
          :key="s"
          :class="['star-btn', { active: s <= formRating }]"
          @click="formRating = s"
        >★</span>
      </div>
      <textarea v-model="formContent" placeholder="分享您的使用体验..." rows="3"></textarea>
      <button class="btn-submit" @click="submitReview" :disabled="!formContent.trim()">提交评价</button>
    </div>
    <div v-else class="review-login-tip">
      <router-link :to="`/login?redirect=/product/${productId}`">登录后</router-link>即可发表评价
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getReviews, saveReview } from '@/api/product'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  productId: { type: [Number, String], required: true },
})

const userStore = useUserStore()

const reviews = ref([])
const formContent = ref('')
const formRating = ref(5)

onMounted(() => {
  reviews.value = getReviews(props.productId)
})

function submitReview() {
  if (!formContent.value.trim()) return
  const review = saveReview({
    productId: Number(props.productId),
    username: userStore.username,
    rating: formRating.value,
    content: formContent.value.trim(),
    images: [],
  })
  reviews.value.unshift(review)
  formContent.value = ''
  formRating.value = 5
}
</script>

<style scoped>
.reviews-section {
  margin-top: 32px;
  background: var(--color-white, #fff);
  border-radius: var(--radius-md, 10px);
  padding: 24px;
  box-shadow: var(--shadow-card, 0 2px 12px rgba(0,0,0,0.04));
  border: 1px solid var(--color-border-light, #f3f4f6);
}

.reviews-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-900, #1F2937);
  margin: 0 0 20px;
  padding-left: 14px;
  border-left: 4px solid var(--color-primary, #FF6B35);
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-item {
  background: var(--gray-100, #f7f8fa);
  border-radius: var(--radius-sm, 6px);
  padding: 16px;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.review-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-primary, #FF6B35);
  color: var(--color-white, #fff);
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.review-username {
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-800, #374151);
}

.review-rating .star {
  color: var(--gray-300, #d0d5dd);
  font-size: 14px;
}

.review-rating .star.active {
  color: #f5a623;
}

.review-time {
  font-size: 12px;
  color: var(--gray-400, #b0b5bd);
  margin-left: auto;
}

.review-content {
  font-size: 14px;
  color: var(--gray-600, #6B7280);
  line-height: 1.6;
  margin: 0;
}

.review-images {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.review-img {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  object-fit: cover;
  background: var(--gray-100, #f7f8fa);
}

.reviews-empty {
  text-align: center;
  padding: 40px 20px;
  color: var(--gray-400, #b0b5bd);
  font-size: 14px;
}

/* 评价表单 */
.review-form {
  margin-top: 24px;
  background: var(--color-white, #fff);
  border-radius: var(--radius-sm, 6px);
  padding: 20px;
  border: 1px solid var(--color-border, #edeef2);
}

.review-form h4 {
  font-size: 15px;
  font-weight: 600;
  color: var(--gray-800, #374151);
  margin: 0 0 12px;
}

.form-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
  font-size: 14px;
  color: var(--gray-600, #6B7280);
}

.star-btn {
  font-size: 20px;
  color: var(--gray-300, #d0d5dd);
  cursor: pointer;
  transition: color 0.2s;
}

.star-btn.active {
  color: #f5a623;
}

.star-btn:hover {
  color: #f5a623;
}

.review-form textarea {
  width: 100%;
  border: 1.5px solid var(--gray-200, #edeef2);
  border-radius: var(--radius-sm, 6px);
  padding: 12px;
  font-size: 14px;
  color: var(--gray-800, #374151);
  resize: vertical;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
  transition: border-color var(--transition-fast, 0.15s);
}

.review-form textarea:focus {
  border-color: var(--color-primary, #FF6B35);
}

.btn-submit {
  margin-top: 12px;
  padding: 8px 24px;
  border: none;
  border-radius: 20px;
  background: var(--color-primary, #FF6B35);
  color: var(--color-white, #fff);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast, 0.15s);
  font-family: inherit;
}

.btn-submit:hover:not(:disabled) {
  background: var(--color-primary-dark, #E55A2B);
}

.btn-submit:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.review-login-tip {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  color: var(--gray-400, #b0b5bd);
}

.review-login-tip a {
  color: var(--color-primary, #FF6B35);
  text-decoration: none;
}

.review-login-tip a:hover {
  text-decoration: underline;
}
</style>
