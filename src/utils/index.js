/**
 * 通用工具函数
 */

/**
 * 防抖函数
 * @param {Function} fn 目标函数
 * @param {number} delay 延迟毫秒数
 */
export function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

/**
 * 格式化价格
 */
export function formatPrice(price) {
  return '¥' + Number(price).toFixed(2)
}

/**
 * 生成唯一 ID
 */
export function generateId() {
  return Date.now() + Math.random().toString(36).slice(2, 8)
}

/**
 * 节流函数
 * @param {Function} fn 目标函数
 * @param {number} delay 间隔毫秒数
 */
export function throttle(fn, delay = 300) {
  let last = 0
  return function (...args) {
    const now = Date.now()
    if (now - last >= delay) {
      last = now
      fn.apply(this, args)
    }
  }
}

/**
 * 格式化时间
 */
export function formatTime(date) {
  const d = new Date(date)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/**
 * 验证手机号
 */
export function validatePhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 验证邮箱
 */
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
