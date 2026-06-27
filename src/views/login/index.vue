<template>
  <div class="login-page">
    <div class="login-card">
      <h2 class="login-title">登录 优选商城</h2>
      <p class="login-subtitle">品质生活，优选好物</p>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label>用户名</label>
          <input
            v-model="form.username"
            type="text"
            placeholder="请输入用户名"
            autocomplete="username"
          />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            autocomplete="current-password"
          />
        </div>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <button type="submit" class="btn-login" :disabled="loading">
          {{ loading ? '登录中...' : '登 录' }}
        </button>
      </form>

      <div class="login-footer">
        还没有账号？
        <router-link to="/register" class="link-register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const form = ref({ username: '', password: '' })
const errorMsg = ref('')
const loading = ref(false)

async function handleLogin() {
  errorMsg.value = ''

  if (!form.value.username.trim()) {
    errorMsg.value = '请输入用户名'
    return
  }
  if (!form.value.password) {
    errorMsg.value = '请输入密码'
    return
  }

  loading.value = true

  // 模拟网络延迟
  await new Promise(r => setTimeout(r, 300))

  const result = userStore.login(form.value.username.trim(), form.value.password)

  loading.value = false

  if (result.success) {
    // 跳转到之前意图访问的页面，或首页
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } else {
    errorMsg.value = result.message
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 400px;
  max-width: 100%;
  background: #fff;
  border-radius: 16px;
  padding: 40px 36px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.login-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 6px;
  text-align: center;
}

.login-subtitle {
  font-size: 14px;
  color: #999;
  margin: 0 0 32px;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  height: 44px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 14px;
  font-size: 15px;
  color: #333;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: #e4393c;
}

.form-group input::placeholder {
  color: #ccc;
}

.error-msg {
  font-size: 13px;
  color: #e4393c;
  margin: -8px 0 0;
}

.btn-login {
  height: 48px;
  border: none;
  border-radius: 24px;
  background: #e4393c;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 4px;
}

.btn-login:hover:not(:disabled) {
  background: #c1272d;
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #999;
}

.link-register {
  color: #e4393c;
  text-decoration: none;
  font-weight: 500;
}

.link-register:hover {
  text-decoration: underline;
}
</style>
