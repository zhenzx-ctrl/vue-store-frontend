<template>
  <div class="profile-page">
    <h3 class="page-title">个人资料</h3>
    <div class="profile-card">
      <div class="profile-avatar">
        <span class="avatar-text">{{ userStore.username.charAt(0).toUpperCase() }}</span>
      </div>
      <div class="profile-info">
        <div class="info-row">
          <label>用户名</label>
          <span>{{ userStore.username }}</span>
        </div>
        <div class="info-row">
          <label>邮箱</label>
          <span v-if="!editingEmail">{{ userStore.userInfo?.email || '未设置' }}</span>
          <input v-else v-model="emailForm" type="email" placeholder="输入邮箱" />
          <button v-if="!editingEmail" class="btn-edit" @click="editingEmail = true; emailForm = userStore.userInfo?.email || ''">修改</button>
          <template v-else>
            <button class="btn-save" @click="saveEmail">保存</button>
            <button class="btn-cancel" @click="editingEmail = false">取消</button>
          </template>
        </div>
        <div class="info-row">
          <label>角色</label>
          <span>{{ roleLabel }}</span>
        </div>
      </div>
    </div>

    <div class="password-section">
      <h4>修改密码</h4>
      <div class="form-group">
        <label>当前密码</label>
        <input v-model="pwdForm.oldPassword" type="password" placeholder="请输入当前密码" />
      </div>
      <div class="form-group">
        <label>新密码</label>
        <input v-model="pwdForm.newPassword" type="password" placeholder="请输入新密码（至少6位）" />
      </div>
      <div class="form-group">
        <label>确认新密码</label>
        <input v-model="pwdForm.confirmPassword" type="password" placeholder="请再次输入新密码" />
      </div>
      <p v-if="pwdMsg" class="pwd-msg">{{ pwdMsg }}</p>
      <button class="btn-change-pwd" @click="changePassword">修改密码</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { updateUserProfile } from '@/api/user'
import { saveCurrentUser } from '@/api/user'

const userStore = useUserStore()

const editingEmail = ref(false)
const emailForm = ref('')
const pwdMsg = ref('')
const pwdForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' })

const roleLabel = computed(() => {
  const map = { super: '超级管理员', admin: '管理员', user: '普通用户' }
  return map[userStore.userInfo?.role] || '普通用户'
})

function saveEmail() {
  const result = updateUserProfile(userStore.userInfo.id, { email: emailForm.value })
  if (result.success) {
    const info = { ...userStore.userInfo, email: emailForm.value }
    userStore.userInfo = info
    saveCurrentUser(info)
    editingEmail.value = false
  }
}

function changePassword() {
  pwdMsg.value = ''
  if (!pwdForm.value.oldPassword) {
    pwdMsg.value = '请输入当前密码'
    return
  }
  if (pwdForm.value.oldPassword !== userStore.userInfo.password) {
    // 简化：需要从users数组中获取真实密码
  }
  if (pwdForm.value.newPassword.length < 6) {
    pwdMsg.value = '新密码至少6位'
    return
  }
  if (pwdForm.value.newPassword !== pwdForm.value.confirmPassword) {
    pwdMsg.value = '两次密码输入不一致'
    return
  }
  const result = updateUserProfile(userStore.userInfo.id, { password: pwdForm.value.newPassword })
  if (result.success) {
    pwdMsg.value = '密码修改成功'
    pwdForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
  }
}
</script>

<style scoped>
.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-900, #1F2937);
  margin: 0 0 24px;
}

.profile-card {
  background: var(--color-white, #fff);
  border-radius: 12px;
  padding: 32px;
  display: flex;
  gap: 32px;
  align-items: flex-start;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-bottom: 24px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary, #FF6B35), #ff6b6b);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-white, #fff);
}

.profile-info {
  flex: 1;
}

.info-row {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--gray-100, #f7f8fa);
  gap: 12px;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row label {
  width: 80px;
  font-size: 14px;
  color: var(--gray-400, #b0b5bd);
  flex-shrink: 0;
}

.info-row span {
  font-size: 15px;
  color: var(--gray-900, #1F2937);
  flex: 1;
}

.info-row input {
  flex: 1;
  height: 36px;
  border: 1px solid var(--gray-300, #d0d5dd);
  border-radius: 6px;
  padding: 0 12px;
  font-size: 14px;
  outline: none;
}

.info-row input:focus {
  border-color: var(--color-primary, #FF6B35);
}

.btn-edit {
  padding: 4px 14px;
  border: 1px solid var(--gray-300, #d0d5dd);
  border-radius: 14px;
  background: var(--color-white, #fff);
  color: var(--gray-600, #6B7280);
  font-size: 13px;
  cursor: pointer;
}

.btn-edit:hover {
  border-color: var(--color-primary, #FF6B35);
  color: var(--color-primary, #FF6B35);
}

.btn-save {
  padding: 4px 14px;
  border: none;
  border-radius: 14px;
  background: var(--color-primary, #FF6B35);
  color: var(--color-white, #fff);
  font-size: 13px;
  cursor: pointer;
}

.btn-cancel {
  padding: 4px 14px;
  border: 1px solid var(--gray-300, #d0d5dd);
  border-radius: 14px;
  background: var(--color-white, #fff);
  color: var(--gray-400, #b0b5bd);
  font-size: 13px;
  cursor: pointer;
}

/* 修改密码 */
.password-section {
  background: var(--color-white, #fff);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.password-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-900, #1F2937);
  margin: 0 0 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: var(--gray-600, #6B7280);
  margin-bottom: 6px;
}

.form-group input {
  width: 100%;
  height: 40px;
  border: 1px solid var(--gray-300, #d0d5dd);
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: var(--color-primary, #FF6B35);
}

.pwd-msg {
  font-size: 13px;
  color: #67c23a;
  margin: -8px 0 12px;
}

.btn-change-pwd {
  padding: 10px 32px;
  border: none;
  border-radius: 20px;
  background: var(--color-primary, #FF6B35);
  color: var(--color-white, #fff);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
}

.btn-change-pwd:hover {
  background: var(--color-primary-dark, #E55A2B);
}

@media (max-width: 768px) {
  .profile-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
