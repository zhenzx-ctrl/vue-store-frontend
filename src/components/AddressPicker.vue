<template>
  <div class="address-picker">
    <div class="picker-row">
      <select v-model="province" @change="onProvinceChange">
        <option value="">请选择省份</option>
        <option v-for="p in provinces" :key="p.name" :value="p.name">{{ p.name }}</option>
      </select>
      <select v-model="city" @change="onCityChange" :disabled="!province">
        <option value="">请选择城市</option>
        <option v-for="c in cities" :key="c.name" :value="c.name">{{ c.name }}</option>
      </select>
      <select v-model="district" :disabled="!city">
        <option value="">请选择区县</option>
        <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
      </select>
    </div>
    <div class="picker-row">
      <input v-model="detail" type="text" placeholder="详细地址（街道、楼栋等）" class="detail-input" />
    </div>
    <div class="picker-row">
      <input v-model="name" type="text" placeholder="收货人姓名" class="name-input" />
      <input v-model="phone" type="tel" placeholder="手机号码" class="phone-input" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { REGIONS } from '@/data/regions'

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:modelValue'])

const province = ref(props.modelValue.province || '')
const city = ref(props.modelValue.city || '')
const district = ref(props.modelValue.district || '')
const detail = ref(props.modelValue.detail || '')
const name = ref(props.modelValue.name || '')
const phone = ref(props.modelValue.phone || '')

const provinces = computed(() => REGIONS)

const cities = computed(() => {
  if (!province.value) return []
  const p = REGIONS.find(r => r.name === province.value)
  return p ? p.cities : []
})

const districts = computed(() => {
  if (!province.value || !city.value) return []
  const p = REGIONS.find(r => r.name === province.value)
  if (!p) return []
  const c = p.cities.find(ct => ct.name === city.value)
  return c ? c.districts : []
})

function onProvinceChange() {
  city.value = ''
  district.value = ''
}

function onCityChange() {
  district.value = ''
}

// 双向绑定
watch([province, city, district, detail, name, phone], () => {
  emit('update:modelValue', {
    province: province.value,
    city: city.value,
    district: district.value,
    detail: detail.value,
    name: name.value,
    phone: phone.value,
  })
}, { deep: true })

// 外部值变化时同步
watch(() => props.modelValue, (val) => {
  if (val.province !== province.value) province.value = val.province || ''
  if (val.city !== city.value) city.value = val.city || ''
  if (val.district !== district.value) district.value = val.district || ''
  if (val.detail !== detail.value) detail.value = val.detail || ''
  if (val.name !== name.value) name.value = val.name || ''
  if (val.phone !== phone.value) phone.value = val.phone || ''
}, { deep: true })
</script>

<style scoped>
.address-picker {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.picker-row {
  display: flex;
  gap: 12px;
}

.picker-row select,
.picker-row input {
  flex: 1;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  color: #333;
  outline: none;
  transition: border-color 0.2s;
  background: #fff;
}

.picker-row select:focus,
.picker-row input:focus {
  border-color: #e4393c;
}

.picker-row select:disabled {
  background: #f5f5f5;
  color: #ccc;
}

.detail-input,
.name-input,
.phone-input {
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .picker-row {
    flex-wrap: wrap;
  }
  .picker-row select,
  .picker-row input {
    min-width: 100%;
  }
  .picker-row select:first-child {
    min-width: 100%;
  }
}
</style>
