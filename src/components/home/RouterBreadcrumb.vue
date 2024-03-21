<script lang="ts" setup>
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

interface Crumbs {
  title: string
  href: string
}

const route = useRoute()
const crumbs = ref<Crumbs[]>([])

const updateCrumbs = () => {
  const matchedRoutes = route.matched
  crumbs.value = matchedRoutes.map((route) => ({
    title: route.meta.title as string,
    href: route.path
  }))
}

watch(route, updateCrumbs)
</script>

<template>
  <main class="pa-2">
    <span v-for="(item, index) in crumbs" :key="index">
      <router-link class="link" :to="item.href">{{ item.title }}</router-link>
      <span class="divider" v-if="index < crumbs.length - 1">/</span>
    </span>
  </main>
</template>

<style scoped>
.link {
  font-size: small;
  font-weight: 500;
  padding: 0.15rem;
  text-decoration: none;
  color: #a5a5a5;
}
.link:hover {
  color: rgba(0, 0, 0, 0.88);
  background-color: rgba(0, 0, 0, 0.06);
}
.divider {
  font-size: large;
  padding: 0 0.25rem;
  color: rgba(0, 0, 0, 0.45);
}
</style>
