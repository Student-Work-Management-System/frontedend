<script lang="ts" setup>
import RouterContainer from '@/components/basic/RouterContainer.vue'
import RouterBreadcrumb from '@/components/home/RouterBreadcrumb.vue'
import RouterSiderMenu from '@/components/home/RouterSiderMenu.vue'
import { onMounted } from 'vue'
import { ref } from 'vue'

const loading = ref(true)
const finishLoading = () => {
  // check permission
  loading.value = false
}
onMounted(finishLoading)
</script>
<template>
  <v-card :loading="loading">
    <v-layout>
      <RouterSiderMenu />
      <v-main style="width: 100vw; height: 100vh">
        <RouterBreadcrumb />
        <div class="contain">
          <RouterContainer />
        </div>
      </v-main>
    </v-layout>
  </v-card>
</template>

<style setup>
.logo {
  padding: 4px 16px 4px 13px !important;
}
.contain {
  height: 100%;
  width: 100%;
  padding: 0.5rem 1rem;
}
</style>
