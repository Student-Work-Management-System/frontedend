<script lang="ts" setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import { apiGetRoleList } from '@/api/role'
import { notify } from '@kyvg/vue3-notification'
import EditRoleForm from '@/components/home/system/EditRoleForm.vue'

const headers = [
  {
    title: '角色ID',
    align: 'start',
    sortable: true,
    key: 'rid'
  },
  {
    title: '角色名称',
    align: 'start',
    sortable: false,
    key: 'roleName'
  },
  {
    title: '角色描述',
    align: 'start',
    sortable: false,
    key: 'roleDesc'
  },
  {
    title: '操作',
    align: 'center',
    key: 'operations',
    sortable: false
  }
]
const selected = ref<any>([])
const loading = ref(true)
const data = ref<any>([])
const addRoleFormDialog = ref(false)

const fetchRoleLogic = async () => {
  loading.value = true
  const { data: result } = await apiGetRoleList()
  if (result.code !== 200) {
    console.log(result.message)
    notify({ title: '错误', text: result.message, type: 'error' })
    return
  }
  data.value = result.data
  loading.value = false
}

onMounted(fetchRoleLogic)
</script>
<template>
  <v-card elevation="10" height="100%" width="100%">
    <AddRoleForm v-model="addRoleFormDialog" />
    <section class="menu">
      <v-btn prepend-icon="mdi-refresh" @click="fetchRoleLogic">刷新</v-btn>
      <v-btn prepend-icon="mdi-plus-circle" color="primary" @click="addRoleFormDialog = true"
        >添加</v-btn
      >
      <v-btn prepend-icon="mdi-card-multiple" color="indigo">设置权限</v-btn>
      <v-btn prepend-icon="mdi-delete" color="error">删除</v-btn>
    </section>
    <section class="pa-4 d-inline-block h-100 w-100">
      <v-card width="100%" height="100%">
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="data"
          :loading="loading"
          show-select
          return-object
        >
          <template v-slot:item.operations="{ item }">
            <div>
              <v-btn prepend-icon="mdi-pencil" color="indigo">编辑</v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </section>
  </v-card>
</template>

<style scoped>
.v-card {
  align-items: start;
}
.menu {
  padding: 1rem 1rem 0 1rem;
}
.menu > * {
  margin-right: 0.5rem;
}
</style>
