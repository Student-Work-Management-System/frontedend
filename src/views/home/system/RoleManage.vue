<script lang="ts" setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import { apiGetRoleList, apiDeleteRole, type Role } from '@/api/role'
import { notify } from '@kyvg/vue3-notification'
import AddRoleForm from '@/components/home/system/AddRoleForm.vue'
import SelectPermission from '@/components/home/system/SelectPermission.vue'
import DeleteDialog from '@/components/home/DeleteDialog.vue'
import { reactive } from 'vue'
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

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
  }
]
const selected = ref<Role[]>([])
const selectedIds = computed(() => selected.value.map((r) => r.rid))
const selectedPermissions = computed(() => {
  if (selected.value.length === 0 || selected.value[0].permissionList[0] === null) {
    return []
  }
  return selected.value[0].permissionList.map((p) => p.pid)
})
const loading = ref(true)

const data = ref<any>([])
const addRoleFormDialog = ref(false)
const selectPermissionDialog = ref(false)
const deleteDialog = ref(false)
const editRoleInfo = reactive<Role>({
  rid: '',
  roleName: '',
  roleDesc: '',
  permissionList: []
})

const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}

const fetchRoleLogic = async () => {
  loading.value = true
  const { data: result } = await apiGetRoleList()
  if (result.code !== 200) {
    console.log(result.message)
    notify({ title: '错误', text: result.message, type: 'error' })
    return
  }
  selected.value = []
  data.value = result.data
  loading.value = false
}

const afterRole = () => {
  addRoleFormDialog.value = false
  selectPermissionDialog.value = false
  deleteDialog.value = false
  selected.value = []
  fetchRoleLogic()
}

const deleteRolerLogic = async () => {
  loading.value = true

  let reqs = selected.value.map(r => (async (r) => {
    const rid = r.rid
    const { data: result } = await apiDeleteRole(rid)
    if (result.code !== 200) {
      console.error(result)
      notify({ type: 'error', title: '错误', text: `角色:${rid}, ` + result.message })
      return
    }
    notify({ type: 'success', title: '成功', text: `角色:${rid} 角色删除成功！` })
  })(r))

  await Promise.all(reqs)
  loading.value = false
  afterRole()
}

const editRoleBtnHandler = () => {
  if (selected.value.length === 0) {
    notify({ type: 'warn', title: '提示', text: '请至少选择一条记录！' })
    return
  }
  selectPermissionDialog.value = true
}

onMounted(fetchRoleLogic)
</script>
<template>
  <v-card elevation="10" height="100%" width="100%">
    <AddRoleForm v-model="addRoleFormDialog" :role-info="editRoleInfo" @on-closed="afterRole" />
    <SelectPermission v-model="selectPermissionDialog" :rid-list="selectedIds" :permissions="selectedPermissions"
      @on-closed="afterRole" />
    <DeleteDialog v-model="deleteDialog" v-model:length="selected.length" @delete="deleteRolerLogic" />
    <section class="menu">
      <v-btn v-if="has('role:select')" prepend-icon="mdi-refresh" @click="fetchRoleLogic">刷新</v-btn>
      <v-btn v-if="has('role:insert')" prepend-icon="mdi-plus-circle" color="primary"
        @click="addRoleFormDialog = true">添加</v-btn>
      <v-btn v-if="has('role_permission:insert') && has('role_permission:delete')" prepend-icon="mdi-card-multiple"
        color="indigo" @click="editRoleBtnHandler">设置权限</v-btn>
      <v-btn v-if="has('role:delete')" prepend-icon="mdi-delete" color="error" @click="deleteDialog = true">删除</v-btn>
    </section>
    <section class="pa-4 w-100 h-100">
      <v-card height="92%" style="overflow: hidden; overflow-y: auto; ">
        <v-data-table v-model="selected" :headers="headers" :items="data" :loading="loading" show-select return-object>
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

.menu>* {
  margin-right: 0.5rem;
}
</style>
