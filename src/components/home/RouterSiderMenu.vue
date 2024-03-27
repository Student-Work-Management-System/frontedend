<script lang="ts" setup>
import { routes } from '@/router/index'
import { ref } from 'vue'

const drawer = ref(true)
const rail = ref(false)
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
        v-for="(item, index) in routes"
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
