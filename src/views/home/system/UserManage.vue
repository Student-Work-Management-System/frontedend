<script lang="ts" setup>
import { ref } from 'vue'
import { apiGetUserList, type UserRecord } from '@/api/user'
import { notify } from '@kyvg/vue3-notification'
import { reactive } from 'vue'
import { onMounted } from 'vue'
import AddUserForm from '@/components/home/system/AddUserForm.vue'
import EditUserRoleForm from '@/components/home/system/EditUserRoleForm.vue'
import { computed } from 'vue'

const headers: readonly {
  readonly title: string
  readonly align: string
  readonly sortable: boolean
  readonly key: string
}[] = [
  {
    title: '用户ID',
    align: 'start',
    sortable: true,
    key: 'uid'
  },
  {
    title: '用户名',
    align: 'start',
    sortable: true,
    key: 'username'
  },
  {
    title: '真实姓名',
    align: 'start',
    sortable: false,
    key: 'realName'
  },
  {
    title: '邮箱',
    align: 'start',
    sortable: false,
    key: 'email'
  },
  {
    title: '用户角色',
    align: 'start',
    sortable: false,
    key: 'roles'
  },
  {
    title: '操作',
    align: 'center',
    key: 'operations',
    sortable: false
  }
]

const selected = ref<UserRecord[]>([])
const data = ref<any>([])
const loading = ref(true)
const search = ref('')
const addUserFormDialog = ref(false)
const editUserRoleFormDialog = ref(false)
const deleteDialog = ref(false)
const selectedUids = computed(() => selected.value.map((u) => u.uid))

const pageOptions = reactive({
  pageSize: 10,
  pageNum: 1
})

const fetchUserLogic = async () => {
  loading.value = true
  const { data: result } = await apiGetUserList({
    keyword: search.value,
    pageNo: pageOptions.pageNum,
    pageSize: pageOptions.pageSize
  })
  if (result.code !== 200) {
    // error
    console.log(result)
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  // success
  data.value = []
  selected.value = []
  data.value = result.data.records
  loading.value = false
}
onMounted(fetchUserLogic)

const afterUser = () => {
  addUserFormDialog.value = false
  editUserRoleFormDialog.value = false
  fetchUserLogic()
}
</script>
<template>
  <v-card elevation="10" height="100%" width="100%">
    <AddUserForm v-model="addUserFormDialog" @on-closed="afterUser" />
    <EditUserRoleForm
      v-model="editUserRoleFormDialog"
      :selected-users="selectedUids"
      @on-closed="afterUser"
    />
    <v-dialog width="500" v-model="deleteDialog">
      <v-card
        prepend-icon="mdi-delete"
        title="选择删除"
        :text="`已选择 ${selected.length} 条记录，本操作不可撤回，确定要删除吗？`"
      >
        <v-card-actions class="mx-auto">
          <v-btn :disabled="selected.length === 0" color="error">删除</v-btn>
          <v-btn @click="deleteDialog = false">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <section class="menu">
      <span>
        <v-btn prepend-icon="mdi-refresh" @click="fetchUserLogic">刷新</v-btn>
        <v-btn prepend-icon="mdi-plus-circle" color="primary" @click="addUserFormDialog = true"
          >添加</v-btn
        >
        <v-btn
          prepend-icon="mdi-card-multiple"
          color="indigo"
          @click="editUserRoleFormDialog = true"
          >选择设置角色</v-btn
        >
        <v-btn prepend-icon="mdi-delete" color="error" @click="deleteDialog = true">删除选择</v-btn>
      </span>
      <span class="w-25">
        <v-text-field
          v-model="search"
          @update:modelValue="fetchUserLogic"
          :loading="loading"
          :counter="15"
          clearable
          label="搜索"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
        >
          <v-tooltip activator="parent" location="top">以用户名或真实姓名搜索</v-tooltip>
        </v-text-field>
      </span>
    </section>
    <section class="pa-4 d-inline-block h-100 w-100">
      <v-card min-width="100%" min-height="100%">
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="data"
          :loading="loading"
          :page="pageOptions.pageNum"
          :items-per-page="pageOptions.pageSize"
          show-select
          return-object
        >
          <template v-slot:item.roles="{ item }">
            <v-chip
              class="mr-1"
              color="indigo"
              :key="index"
              v-for="(r, index) in (item as UserRecord).roles"
            >
              {{ r.roleName }}
            </v-chip>
          </template>

          <template v-slot:item.operations="{ item }">
            <div>
              <v-btn prepend-icon="mdi-pencil" color="indigo" click="">编辑</v-btn>
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
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1rem 0 1rem;
}
.menu span > * {
  margin-right: 0.5rem;
}
</style>
