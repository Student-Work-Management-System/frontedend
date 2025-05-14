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

watch(route, updateCrumbs, { immediate: true })
</script>

<template>
  <slot></slot>
  <span v-for="(item, index) in crumbs" :key="index">
    <router-link :class="['link', index == crumbs.length - 1 ? 'last' : '']" :to="item.href">{{
      item.title
    }}</router-link>
    <span class="divider" v-if="index < crumbs.length - 1">/</span>
  </span>
</template>

<style scoped>
.link {
  font-size: 15px;
  font-weight: 500;
  padding: 0.15rem;
  text-decoration: none;
  color: #a5a5a5;
}

.link:hover {
  color: #3f51b5;
  background-color: rgba(0, 0, 0, 0.06);
}

.divider {
  font-size: large;
  padding: 0 0.25rem;
  color: rgba(0, 0, 0, 0.45);
}

.last {
  color: #3f51b5;
  border-bottom: #3f51b5 1px solid;
}
</style>
