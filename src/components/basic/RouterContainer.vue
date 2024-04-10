<script lang="ts" setup>
import { RouterView, useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <main class="router-container-main" v-if="!route.meta.hasPage">
    <div>
      <h1>当前未打开任何管理条目</h1>
      <h2>( 请尝试点击左侧栏以打开条目 )</h2>
    </div>
  </main>
  <router-view v-else />
</template>

<style scoped>
.router-container-main {
  display: flex;
  height: 100%;
  widows: 100%;
  justify-content: center;
  align-items: center;
}
.router-container-main div {
  color: #8e95c9;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
