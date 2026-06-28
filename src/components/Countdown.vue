<template>
  <div class="countdown">
    <span class="countdown-block"><em>{{ days }}</em><small>天</small></span>
    <span class="countdown-sep">:</span>
    <span class="countdown-block"><em>{{ hours }}</em><small>时</small></span>
    <span class="countdown-sep">:</span>
    <span class="countdown-block"><em>{{ minutes }}</em><small>分</small></span>
    <span class="countdown-sep">:</span>
    <span class="countdown-block"><em>{{ seconds }}</em><small>秒</small></span>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  targetTime: { type: [String, Number], required: true },
})

const emit = defineEmits(['finished'])

const days = ref('00')
const hours = ref('00')
const minutes = ref('00')
const seconds = ref('00')

let timer = null

function update() {
  const target = new Date(props.targetTime).getTime()
  const now = Date.now()
  let diff = target - now

  if (diff <= 0) {
    days.value = hours.value = minutes.value = seconds.value = '00'
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    emit('finished')
    return
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24))
  diff -= d * 1000 * 60 * 60 * 24
  const h = Math.floor(diff / (1000 * 60 * 60))
  diff -= h * 1000 * 60 * 60
  const m = Math.floor(diff / (1000 * 60))
  diff -= m * 1000 * 60
  const s = Math.floor(diff / 1000)

  const pad = n => String(n).padStart(2, '0')
  days.value = pad(d)
  hours.value = pad(h)
  minutes.value = pad(m)
  seconds.value = pad(s)
}

onMounted(() => {
  update()
  timer = setInterval(update, 1000)
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style scoped>
.countdown {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.countdown-block {
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
}

.countdown-block em {
  font-style: normal;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-primary, #FF6B35);
  background: var(--color-primary-lighter, #FFF0E8);
  padding: 2px 6px;
  border-radius: 4px;
  min-width: 28px;
  text-align: center;
  display: inline-block;
}

.countdown-block small {
  font-size: 12px;
  color: var(--gray-400, #b0b5bd);
  font-weight: 400;
}

.countdown-sep {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary, #FF6B35);
  margin: 0 2px;
}
</style>
