import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getUsers, getUserByUsername, register as apiRegister, saveCurrentUser, getCurrentUser, removeCurrentUser } from '@/api/user'
import { removeStorage } from '@/utils/storage'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)

  // 是否已登录
  const isLoggedIn = computed(() => !!userInfo.value)

  // 用户名
  const username = computed(() => userInfo.value?.username || '')

  /**
   * 登录：读取 users 数组验证，兼容后台管理系统 token 格式
   */
  function login(usernameInput, password) {
    const user = getUserByUsername(usernameInput)

    if (!user) {
      return { success: false, message: '用户名不存在' }
    }
    if (user.status !== 1) {
      return { success: false, message: '账号已被禁用' }
    }
    if (user.password !== password) {
      return { success: false, message: '密码错误' }
    }

    // 设置后台管理系统的 token 格式（兼容后台）
    localStorage.setItem('token', 'fake-token')
    localStorage.setItem('userRole', user.role || 'user')

    // 保存前端专用用户信息
    const info = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
    }
    userInfo.value = info
    saveCurrentUser(info)

    return { success: true }
  }

  /**
   * 注册
   */
  function register(data) {
    const result = apiRegister(data)
    if (result.success) {
      // 自动登录
      login(data.username, data.password)
    }
    return result
  }

  /**
   * 退出登录
   */
  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    removeCurrentUser()
    userInfo.value = null
  }

  /**
   * 检查登录状态（应用启动时调用）
   */
  function checkAuth() {
    const token = localStorage.getItem('token')
    if (!token) {
      userInfo.value = null
      return
    }

    // 优先从本地缓存恢复
    const cached = getCurrentUser()
    if (cached) {
      userInfo.value = cached
      return
    }

    // 缓存不存在但 token 在（可能从后台管理系统登录的），尝试根据 userRole 恢复
    const userRole = localStorage.getItem('userRole')
    const users = getUsers()
    const matched = users.find(u => u.role === userRole && u.status === 1)
    if (matched) {
      const info = {
        id: matched.id,
        username: matched.username,
        email: matched.email,
        role: matched.role,
        status: matched.status,
      }
      userInfo.value = info
      saveCurrentUser(info)
    } else {
      logout()
    }
  }

  return { userInfo, isLoggedIn, username, login, register, logout, checkAuth }
})
