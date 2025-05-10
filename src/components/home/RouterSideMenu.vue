<script lang="ts" setup>
import { routes } from '@/router'
import { useUserStore } from '@/stores/userStore'
import { computed } from 'vue'

const model = defineModel<boolean>()
const store = useUserStore()
const authorities = store.getUserData.authorities?.map((a) => a.authority)

const items = computed(() =>
  routes
    .filter((r) => {
      const auth = r.meta?.auth
      return auth === null ? true : typeof auth === 'string' && authorities?.includes(auth)
    })
    .map((r) => ({
      ...r,
      children:
        r.children?.filter((item) => {
          const auth = item.meta?.auth
          return typeof auth === 'string' && authorities?.includes(auth)
        }) || []
    }))
)
</script>

<template>
  <v-navigation-drawer color="#001529" theme="dark" v-model="model" permanent>
    <v-list-item class="logo">
      <template v-slot:append>
        <v-img :width="235" src="logo2.png" />
      </template>
    </v-list-item>
    <v-list density="compact" nav open-strategy="single">
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
            :prepend-icon="item.meta?.icon as string"
            :title="item.meta?.title as string"
          />
        </template>
        <v-list-item
          class="back"
          v-for="(chitem, chindex) in item.children"
          :key="index + '-' + chindex"
          :prepend-icon="chitem.meta?.icon as string"
          :title="chitem.meta?.title as string"
          :value="chitem.name"
          :to="chitem.path"
        />
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
