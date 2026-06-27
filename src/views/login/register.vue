<template>
  <div class="register-page">
    <div class="register-card">
      <h2 class="register-title">注册 优选商城</h2>
      <p class="register-subtitle">创建账号，开启品质生活</p>

      <form class="register-form" @submit.prevent="handleRegister">
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
          <label>邮箱</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="请输入邮箱（选填）"
            autocomplete="email"
          />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="请输入密码（至少6位）"
            autocomplete="new-password"
          />
        </div>
        <div class="form-group">
          <label>确认密码</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            autocomplete="new-password"
          />
        </div>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <button type="submit" class="btn-register" :disabled="loading">
          {{ loading ? '注册中...' : '注 册' }}
        </button>
      </form>

      <div class="register-footer">
        已有账号？
        <router-link to="/login" class="link-login">去登录</router-link>
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

const form = ref({ username: '', email: '', password: '', confirmPassword: '' })
const errorMsg = ref('')
const loading = ref(false)

async function handleRegister() {
  errorMsg.value = ''

  if (!form.value.username.trim()) {
    errorMsg.value = '请输入用户名'
    return
  }
  if (form.value.username.trim().length < 2) {
    errorMsg.value = '用户名至少2个字符'
    return
  }
  if (!form.value.password) {
    errorMsg.value = '请输入密码'
    return
  }
  if (form.value.password.length < 6) {
    errorMsg.value = '密码至少6位'
    return
  }
  if (form.value.password !== form.value.confirmPassword) {
    errorMsg.value = '两次密码输入不一致'
    return
  }

  loading.value = true
  await new Promise(r => setTimeout(r, 300))

  const result = userStore.register({
    username: form.value.username.trim(),
    password: form.value.password,
    email: form.value.email.trim(),
  })

  loading.value = false

  if (result.success) {
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } else {
    errorMsg.value = result.message
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  width: 400px;
  max-width: 100%;
  background: #fff;
  border-radius: 16px;
  padding: 40px 36px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.register-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 6px;
  text-align: center;
}

.register-subtitle {
  font-size: 14px;
  color: #999;
  margin: 0 0 32px;
  text-align: center;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
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

.btn-register {
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

.btn-register:hover:not(:disabled) {
  background: #c1272d;
}

.btn-register:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.register-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #999;
}

.link-login {
  color: #e4393c;
  text-decoration: none;
  font-weight: 500;
}

.link-login:hover {
  text-decoration: underline;
}
</style>
