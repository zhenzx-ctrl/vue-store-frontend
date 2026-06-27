<template>
  <div class="address-page">
    <div class="address-header">
      <h3 class="page-title">地址管理</h3>
      <button class="btn-add" @click="openAdd">+ 新增地址</button>
    </div>

    <div v-if="addressStore.addresses.length" class="address-list">
      <div v-for="addr in addressStore.addresses" :key="addr.id" class="address-card" :class="{ default: addr.id === addressStore.defaultId }">
        <div class="addr-info">
          <div class="addr-top">
            <span class="addr-name">{{ addr.name }}</span>
            <span class="addr-phone">{{ addr.phone }}</span>
            <span v-if="addr.id === addressStore.defaultId" class="default-tag">默认</span>
          </div>
          <p class="addr-detail">{{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.detail }}</p>
        </div>
        <div class="addr-actions">
          <button v-if="addr.id !== addressStore.defaultId" @click="addressStore.setDefault(addr.id)">设为默认</button>
          <button @click="openEdit(addr)">编辑</button>
          <button class="danger" @click="addressStore.deleteAddress(addr.id)">删除</button>
        </div>
      </div>
    </div>
    <Empty v-else icon="📍" text="暂无收货地址" />

    <!-- 新增/编辑弹窗 -->
    <Modal :visible="showForm" :title="editingId ? '编辑地址' : '新增地址'" width="480px" @close="showForm = false">
      <AddressPicker v-model="addressForm" />
      <template #footer>
        <button class="btn-cancel" @click="showForm = false">取消</button>
        <button class="btn-confirm" @click="saveAddress">保存</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAddressStore } from '@/stores/address'
import Modal from '@/components/Modal.vue'
import AddressPicker from '@/components/AddressPicker.vue'
import Empty from '@/components/Empty.vue'

const addressStore = useAddressStore()
const showForm = ref(false)
const editingId = ref(null)
const addressForm = ref({})

onMounted(() => {
  addressStore.loadAddresses()
})

function openAdd() {
  editingId.value = null
  addressForm.value = {}
  showForm.value = true
}

function openEdit(addr) {
  editingId.value = addr.id
  addressForm.value = { ...addr }
  showForm.value = true
}

function saveAddress() {
  if (!addressForm.value.name || !addressForm.value.phone || !addressForm.value.province) {
    alert('请填写完整的地址信息')
    return
  }
  if (editingId.value) {
    addressStore.updateAddress(editingId.value, addressForm.value)
  } else {
    addressStore.addAddress(addressForm.value)
  }
  showForm.value = false
}
</script>

<style scoped>
.address-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.btn-add {
  padding: 8px 20px;
  border: 1px solid #e4393c;
  border-radius: 20px;
  background: #fff;
  color: #e4393c;
  font-size: 14px;
  cursor: pointer;
}

.btn-add:hover {
  background: #fff0f0;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.address-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px 20px;
  border: 1px solid #f0f0f0;
  transition: border-color 0.2s;
}

.address-card.default {
  border-color: #e4393c;
}

.addr-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.addr-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.addr-phone {
  font-size: 14px;
  color: #666;
}

.default-tag {
  font-size: 12px;
  color: #e4393c;
  background: #fff0f0;
  padding: 2px 8px;
  border-radius: 4px;
}

.addr-detail {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.addr-actions {
  display: flex;
  gap: 12px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f5f5f5;
}

.addr-actions button {
  padding: 4px 12px;
  border: none;
  background: none;
  font-size: 13px;
  color: #666;
  cursor: pointer;
}

.addr-actions button:hover {
  color: #e4393c;
}

.addr-actions button.danger:hover {
  color: #f56c6c;
}

.btn-cancel {
  padding: 8px 24px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: #fff;
  color: #666;
  font-size: 14px;
  cursor: pointer;
}

.btn-confirm {
  padding: 8px 24px;
  border: none;
  border-radius: 20px;
  background: #e4393c;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.btn-confirm:hover {
  background: #c1272d;
}
</style>
