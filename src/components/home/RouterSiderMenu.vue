<script lang="ts" setup>
import { routes } from '@/router/index'
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'
import { ref } from 'vue'

const drawer = ref(true)
const rail = ref(false)
const store = useUserStore()
const authorities = store.getUserData.authorities?.map((a) => a.authority)
console.log(routes)

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
  <v-navigation-drawer
    color="#001529"
    theme="dark"
    v-model="drawer"
    :rail="rail"
    permanent
    @click="rail = false"
  >
    <v-list-item class="logo">
      <template v-slot:append>
        <v-img v-if="!rail" :width="200" src="logo2.png"></v-img>
        <v-img v-else style="left: -2px; top: 6px" :width="35" src="logo-mini.png"></v-img>
        <v-btn
          v-if="!rail"
          icon="mdi-chevron-left"
          variant="text"
          @click.stop="rail = !rail"
        ></v-btn>
      </template>
    </v-list-item>
    <v-list density="compact" nav>
      <v-list-group
        v-for="(item, index) in items"
        base-color="#147ddf"
        color="#fff"
        :key="index"
        :value="item.name"
      >
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            :prepend-icon="item.meta.icon"
            :title="item.meta.title"
          ></v-list-item>
        </template>
        <v-list-item
          class="back"
          v-for="(chitem, chindex) in item.children"
          :key="index + '-' + chindex"
          :prepend-icon="chitem.meta.icon"
          :title="chitem.meta.title"
          :value="chitem.name"
          :to="chitem.path"
        ></v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
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
