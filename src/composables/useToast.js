import { ref } from 'vue'
import { createApp } from 'vue'
import Toast from '@/components/Toast.vue'

const toasts = ref([])
let toastId = 0

export const iconMap = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}

// 确保Toast容器已挂载
let mounted = false
let toastApp = null

function mountToast() {
  if (mounted) return
  const div = document.createElement('div')
  div.id = 'toast-root'
  document.body.appendChild(div)
  toastApp = createApp(Toast, { toasts })
  toastApp.mount(div)
  mounted = true
}

export function useToast() {
  function show(message, type = 'info', duration = 2500) {
    mountToast()
    const id = ++toastId
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, duration)
  }

  return {
    show,
    success: (msg) => show(msg, 'success'),
    error: (msg) => show(msg, 'error'),
    warning: (msg) => show(msg, 'warning'),
    info: (msg) => show(msg, 'info'),
  }
}
