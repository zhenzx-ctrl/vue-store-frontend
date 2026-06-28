<template>
  <div id="app-root">
    <router-view v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <KeepAlive :include="keepAlivePages">
          <component :is="Component" />
        </KeepAlive>
      </Transition>
    </router-view>
  </div>
</template>

<script setup>
const keepAlivePages = ['HomePage', 'ProductList']
</script>

<style>
/* 路由切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
