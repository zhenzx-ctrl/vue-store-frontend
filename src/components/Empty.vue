<template>
  <div class="empty-state">
    <span class="empty-icon">{{ icon }}</span>
    <p class="empty-text">{{ text }}</p>
    <router-link v-if="actionLink" :to="actionLink">
      <button class="empty-action">{{ actionText }}</button>
    </router-link>
    <button v-else-if="actionText" class="empty-action" @click="$emit('action')">{{ actionText }}</button>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: '📭' },
  text: { type: String, default: '暂无数据' },
  actionText: { type: String, default: '' },
  actionLink: { type: String, default: '' },
})

defineEmits(['action'])
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: var(--color-white, #fff);
  border-radius: 12px;
}

.empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: var(--gray-400, #b0b5bd);
  margin: 0 0 20px;
}

.empty-action {
  padding: 10px 32px;
  border: 2px solid var(--color-primary, #FF6B35);
  border-radius: 24px;
  background: var(--color-white, #fff);
  color: var(--color-primary, #FF6B35);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.empty-action:hover {
  background: var(--color-primary-lighter, #FFF0E8);
}
</style>
