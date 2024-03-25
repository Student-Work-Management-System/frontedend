<script lang="ts" setup>
import { routes } from '@/router/index'
import { ref } from 'vue'

const drawer = ref(true)
const rail = ref(false)
const dialog = ref(false)
</script>

<template>
  <v-dialog v-model="dialog" width="auto">
    <v-card
      max-width="400"
      prepend-icon="mdi-update"
      text="Your application will relaunch automatically after the update is complete."
      title="Update in progress"
    >
      <template v-slot:actions>
        <v-btn class="ms-auto" text="Ok" @click="dialog = false"></v-btn>
      </template>
    </v-card>
  </v-dialog>

  <v-navigation-drawer theme="dark" v-model="drawer" :rail="rail" permanent @click="rail = false">
    <v-list-item class="logo">
      <template v-slot:append>
        <v-img :width="200" src="logo2.png"></v-img>
        <v-btn icon="mdi-chevron-left" variant="text" @click.stop="rail = !rail"></v-btn>
      </template>
    </v-list-item>
    <v-list density="compact" nav>
      <v-list-group v-for="(item, index) in routes" :key="index" :value="item.name">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            :prepend-icon="item.meta.icon"
            :title="item.meta.title"
          ></v-list-item>
        </template>
        <v-list-item
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
</style>
