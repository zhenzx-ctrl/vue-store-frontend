import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getStorage, setStorage } from '@/utils/storage'
import { generateId } from '@/utils'

export const useAddressStore = defineStore('address', () => {
  const addresses = ref([])
  const defaultId = ref(null)

  // 默认地址
  const defaultAddress = computed(() => {
    if (defaultId.value) {
      return addresses.value.find(a => a.id === defaultId.value) || null
    }
    return addresses.value[0] || null
  })

  // 加载
  function loadAddresses() {
    addresses.value = getStorage('addresses', [])
    defaultId.value = getStorage('defaultAddressId', null)
  }

  // 持久化
  function save() {
    setStorage('addresses', addresses.value)
    setStorage('defaultAddressId', defaultId.value)
  }

  // 新增
  function addAddress(address) {
    const newAddr = {
      id: generateId(),
      ...address,
    }
    addresses.value.push(newAddr)
    // 如果是第一个地址，设为默认
    if (addresses.value.length === 1) {
      defaultId.value = newAddr.id
    }
    save()
    return newAddr
  }

  // 更新
  function updateAddress(id, data) {
    const idx = addresses.value.findIndex(a => a.id === id)
    if (idx >= 0) {
      addresses.value[idx] = { ...addresses.value[idx], ...data }
      save()
    }
  }

  // 删除
  function deleteAddress(id) {
    addresses.value = addresses.value.filter(a => a.id !== id)
    if (defaultId.value === id) {
      defaultId.value = addresses.value[0]?.id || null
    }
    save()
  }

  // 设为默认
  function setDefault(id) {
    defaultId.value = id
    save()
  }

  return { addresses, defaultId, defaultAddress, loadAddresses, addAddress, updateAddress, deleteAddress, setDefault }
})
