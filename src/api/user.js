/**
 * 用户数据接口
 * 与后台管理系统共享 localStorage users 数据
 */
import { getAdminData, setAdminData, getStorage, setStorage, removeStorage } from '@/utils/storage'
import { generateId } from '@/utils'

// 默认用户数据（与后台管理系统一致，首次访问时自动初始化）
const DEFAULT_USERS = [
  { id: 1, username: 'admin', password: '123456', email: 'admin@test.com', status: 1, role: 'super' },
  { id: 2, username: 'zhangsan', password: '123456', email: 'zhangsan@test.com', status: 1, role: 'admin' },
  { id: 3, username: 'lisi', password: '123456', email: 'lisi@test.com', status: 0, role: 'user' },
  { id: 4, username: 'wangwu', password: '123456', email: 'wangwu@test.com', status: 1, role: 'admin' },
  { id: 5, username: 'zhaoliu', password: '123456', email: 'zhaoliu@test.com', status: 1, role: 'user' },
]

/**
 * 获取所有用户（优先读取后台数据，否则初始化默认用户）
 */
export function getUsers() {
  const users = getAdminData('users', null)
  if (users && users.length > 0) return users
  // 首次使用，初始化默认用户
  setAdminData('users', DEFAULT_USERS)
  return DEFAULT_USERS
}

/**
 * 根据用户名查找用户
 */
export function getUserByUsername(username) {
  const users = getUsers()
  return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null
}

/**
 * 用户注册（写入后台管理系统的 users 数据源）
 */
export function register({ username, password, email }) {
  const users = getUsers()

  // 检查用户名是否已存在
  if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    return { success: false, message: '用户名已存在' }
  }

  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    username,
    password,
    email: email || '',
    status: 1,
    role: 'user',
  }

  users.push(newUser)
  setAdminData('users', users)

  return { success: true, user: newUser }
}

/**
 * 更新用户信息
 */
export function updateUserProfile(userId, data) {
  const users = getUsers()
  const user = users.find(u => u.id === userId)
  if (!user) return { success: false, message: '用户不存在' }

  Object.assign(user, data)
  setAdminData('users', users)
  return { success: true, user }
}

/**
 * 保存当前登录用户信息（带前缀，前端专用）
 */
export function saveCurrentUser(user) {
  return setStorage('currentUser', user)
}

/**
 * 获取当前登录用户信息
 */
export function getCurrentUser() {
  return getStorage('currentUser', null)
}

/**
 * 移除当前登录用户信息
 */
export function removeCurrentUser() {
  removeStorage('currentUser')
}
