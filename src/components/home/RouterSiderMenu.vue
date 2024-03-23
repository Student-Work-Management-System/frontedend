<script lang="ts" setup>
import { routes } from '@/router/index'
import { useUserStore } from '@/stores/user'
import { useCookies } from 'vue3-cookies'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const store = useUserStore()
const { cookies } = useCookies()
const router = useRouter()

const drawer = ref(true)
const rail = ref(false)
const logoutHandle = () => {
  store.updateUser({ user: null, token: '', authorities: [] })
  cookies.remove('user-cache')
  router.push({ name: 'login' })
}
</script>

<template>
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
    <template v-if="!rail" v-slot:append>
      <div class="pa-2">
        <v-btn block prepend-icon="mdi-login-variant" @click="logoutHandle"> 登 出 </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.v-list-group__items .v-list-item {
  padding-inline-start: 2rem !important;
}
</style>
