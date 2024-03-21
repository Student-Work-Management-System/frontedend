<script lang="ts" setup>
import RouterContainer from '@/components/basic/RouterContainer.vue'
import RouterBreadcrumb from '@/components/home/RouterBreadcrumb.vue'
import RouterSiderMenu from '@/components/home/RouterSiderMenu.vue'
</script>
<template>
  <v-card>
    <v-layout>
      <RouterSiderMenu />
      <v-main style="width: 100vw; height: 100vh">
        <RouterBreadcrumb />
        <RouterContainer />
      </v-main>
    </v-layout>
  </v-card>
</template>

<style setup>
.logo {
  padding: 4px 16px 4px 13px !important;
}
</style>
