/**
 * localStorage 持久化工具
 * 统一管理本地数据存取，与后台管理系统共享数据源
 */

const STORAGE_PREFIX = 'store_'

/**
 * 获取存储数据（自动 JSON 解析）
 */
export function getStorage(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    if (raw === null) return defaultValue
    return JSON.parse(raw)
  } catch {
    return defaultValue
  }
}

/**
 * 设置存储数据（自动 JSON 序列化）
 */
export function setStorage(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

/**
 * 删除指定 key
 */
export function removeStorage(key) {
  localStorage.removeItem(STORAGE_PREFIX + key)
}

/**
 * 清除所有带前缀的存储数据
 */
export function clearStorage() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX))
  keys.forEach(k => localStorage.removeItem(k))
}

/**
 * 直接读取后台管理系统的数据（无前缀）
 * 后台系统的 localStorage key: products, users 等
 */
export function getAdminData(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return defaultValue
    return JSON.parse(raw)
  } catch {
    return defaultValue
  }
}

/**
 * 向后台管理系统的数据源写入（无前缀）
 */
export function setAdminData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
