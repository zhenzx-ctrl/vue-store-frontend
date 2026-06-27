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
}

.reviews-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px;
  padding-left: 12px;
  border-left: 4px solid #e4393c;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-item {
  background: #fafafa;
  border-radius: 8px;
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
  background: #e4393c;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.review-username {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.review-rating .star {
  color: #ddd;
  font-size: 14px;
}

.review-rating .star.active {
  color: #f5a623;
}

.review-time {
  font-size: 12px;
  color: #999;
  margin-left: auto;
}

.review-content {
  font-size: 14px;
  color: #666;
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
  background: #f5f5f5;
}

.reviews-empty {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 14px;
}

/* 评价表单 */
.review-form {
  margin-top: 24px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #f0f0f0;
}

.review-form h4 {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px;
}

.form-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.star-btn {
  font-size: 20px;
  color: #ddd;
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
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  color: #333;
  resize: vertical;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
  transition: border-color 0.2s;
}

.review-form textarea:focus {
  border-color: #e4393c;
}

.btn-submit {
  margin-top: 12px;
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

.btn-submit:hover:not(:disabled) {
  background: #c1272d;
}

.btn-submit:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.review-login-tip {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.review-login-tip a {
  color: #e4393c;
  text-decoration: none;
}

.review-login-tip a:hover {
  text-decoration: underline;
}
</style>
