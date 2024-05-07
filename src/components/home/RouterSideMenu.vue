<script lang="ts" setup>
import { routes } from '@/router'
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'
import { ref } from 'vue'

const drawer = ref(true)
const store = useUserStore()
const authorities = store.getUserData.authorities?.map((a) => a.authority)

const items = computed(() =>
  routes
    .filter((r) => (r.meta.auth === null ? true : authorities?.includes(r.meta.auth)))
    .map((r) => ({
      ...r,
      children: r.children.filter((item) =>
        item.meta.auth === null ? false : authorities?.includes(item.meta.auth)
      )
    }))
)
</script>

<template>
  <v-navigation-drawer color="#001529" theme="dark" v-model="drawer" permanent>
    <v-list-item class="logo">
      <template v-slot:append>
        <v-img :width="235" src="logo2.png" />
      </template>
    </v-list-item>
    <v-list density="compact" nav open-strategy="single">
      <v-list-group v-for="(item, index) in items" base-color="#147ddf" color="#fff" :key="index" :value="item.name">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" :prepend-icon="item.meta.icon" :title="item.meta.title" />
        </template>
        <v-list-item class="back" v-for="(chitem, chindex) in item.children" :key="index + '-' + chindex"
          :prepend-icon="chitem.meta.icon" :title="chitem.meta.title" :value="chitem.name" :to="chitem.path" />
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.logo {
  display: flex;
  justify-content: end;
  align-items: end;
  margin-top: 0.3rem;
}

.v-list-group__items .v-list-item {
  padding-inline-start: 2rem !important;
}

.v-list-item__spacer {
  display: none !important;
}

.back {
  background-color: #000c17;
}
</style>
