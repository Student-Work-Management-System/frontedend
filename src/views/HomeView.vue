<script lang="ts" setup>
import RouterContainer from '@/components/basic/RouterContainer.vue'
import RouterBreadcrumb from '@/components/home/RouterBreadcrumb.vue'
import RouterSideMenu from '@/components/home/RouterSideMenu.vue'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { notify } from '@kyvg/vue3-notification'
import { useUserStore } from '@/stores/user'
import { apiLogout } from '@/api/user'
import { computed } from 'vue'
import { setAuthorizationToken } from '@/api'

const loading = ref(true)
const dialog = ref(false)
const drawer = ref(true)

const finishLoading = () => {
  // check permission
  loading.value = false
}
const store = useUserStore()
const router = useRouter()
const realName = computed(() => store.getUserData.realName)

const logoutBtnHandler = () => {
  dialog.value = false
  logoutHandler()
}

const logoutHandler = () => {
  loading.value = true
  apiLogout()
  store.updateUser({ uid: '', username: '', email: '', realName: '', token: '', authorities: [] })
  setAuthorizationToken('')
  localStorage.clear()
  loading.value = false
  notify({ title: '提示', text: '登出成功！', type: 'success' })
  router.push({ name: 'login' })
}

onMounted(finishLoading)
</script>
<template>
  <v-dialog v-model="dialog" width="auto">
    <v-card max-width="400" prepend-icon="mdi-account-question" text="确定要登出当前账号吗？" title="登出账号">
      <template v-slot:actions>
        <section class="w-100 d-flex justify-space-evenly">
          <v-btn text="确定" @click="logoutBtnHandler"></v-btn>
          <v-btn text="取消" @click="dialog = false"></v-btn>
        </section>
      </template>
    </v-card>
  </v-dialog>

  <v-card :loading="loading">
    <v-layout>
      <RouterSideMenu v-model="drawer" />
      <v-main style="width: 100vw; height: 100vh; display: flex; flex-direction: column">
        <div class="nav">
          <v-card elevation="4" class="pb-1 w-100">
            <v-card-title class="d-flex justify-space-between align-center" style="height: 6vh">
              <span>
                <RouterBreadcrumb>
                  <v-icon size="small" class="mr-2" :color="drawer ? 'indigo' : 'black'"
                    :icon="drawer ? 'mdi-menu-open' : 'mdi-menu'" variant="text" @click="drawer = !drawer">
                  </v-icon>
                </RouterBreadcrumb>
              </span>
              <span>
                <v-btn variant="text" :loading="loading" prepend-icon="mdi-account">
                  {{ realName }}
                </v-btn>
                <v-btn variant="text" :loading="loading" prepend-icon="mdi-login-variant" @click="dialog = true">
                  登出
                </v-btn>
              </span>
            </v-card-title>
          </v-card>
        </div>
        <div class="contain">
          <RouterContainer />
        </div>
      </v-main>
    </v-layout>
  </v-card>
</template>

<style scoped>
.logo {
  padding: 4px 16px 4px 13px !important;
}

.nav {
  width: 100%;
  padding: 0.5rem 1rem;
}

.contain {
  flex: 1;
  width: 100%;
  height: 91vh;
  padding: 0 1rem 0.5rem 1rem;
}
</style>
