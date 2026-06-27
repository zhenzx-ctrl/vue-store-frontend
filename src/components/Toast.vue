<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast-item">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', `toast-${toast.type}`]"
        >
          <span class="toast-icon">{{ iconMap[toast.type] }}</span>
          <span class="toast-msg">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { iconMap } from '@/composables/useToast'

defineProps({
  toasts: { type: Array, default: () => [] },
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
  pointer-events: auto;
}

.toast-icon {
  font-size: 16px;
}

.toast-success {
  background: #f0f9eb;
  color: #67c23a;
  border: 1px solid #e1f3d8;
}

.toast-error {
  background: #fef0f0;
  color: #f56c6c;
  border: 1px solid #fde2e2;
}

.toast-warning {
  background: #fdf6ec;
  color: #e6a23c;
  border: 1px solid #faecd8;
}

.toast-info {
  background: #f4f4f5;
  color: #909399;
  border: 1px solid #e9e9eb;
}

/* 动画 */
.toast-item-enter-active {
  transition: all 0.3s ease;
}

.toast-item-leave-active {
  transition: all 0.25s ease;
}

.toast-item-enter-from {
  opacity: 0;
  transform: translateY(-16px);
}

.toast-item-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
</style>
