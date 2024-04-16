<script lang="ts" setup>
import { ref } from 'vue'
import { apiDeleteUser, apiGetUserList, type UserRecord } from '@/api/user'
import { notify } from '@kyvg/vue3-notification'
import { reactive } from 'vue'
import { onMounted } from 'vue'
import AddUserForm from '@/components/home/system/AddUserForm.vue'
import EditUserRoleForm from '@/components/home/system/EditUserRoleForm.vue'
import EditUserInfoForm from '@/components/home/system/EditUserInfoForm.vue'
import DeleteDialog from '@/components/home/DeleteDialog.vue'
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

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
const editInfo = ref<UserRecord>({
  uid: '',
  username: '',
  realName: '',
  email: '',
  createdAt: '',
  roles: []
})
const addUserFormDialog = ref(false)
const editUserRoleFormDialog = ref(false)
const editUserInfoFormDialog = ref(false)
const deleteDialog = ref(false)
const selectedUids = computed(() => selected.value.map((u) => u.uid))

const pageOptions = reactive({
  pageSize: 10,
  pageNum: 1
})

const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}

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
  data.value = result.data
  loading.value = false
}
onMounted(fetchUserLogic)

const editUserRoleBtnHandler = () => {
  if (selected.value.length == 0) {
    notify({ type: 'warn', title: '提示', text: '请至少选择一条记录！' })
    return
  }
  editUserRoleFormDialog.value = true
}

const deleteUserLogic = () => {
  loading.value = true
  selected.value.forEach(async (u) => {
    const uid = u.uid
    const { data: result } = await apiDeleteUser(uid)
    if (result.code !== 200) {
      console.error(result)
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
    notify({ type: 'success', title: '成功', text: `用户:${uid} 角色删除成功！` })
  })
  setTimeout(() => {
    afterUser()
    loading.value = false
  }, 500)
}

const afterUser = () => {
  addUserFormDialog.value = false
  editUserRoleFormDialog.value = false
  editUserInfoFormDialog.value = false
  deleteDialog.value = false
  selected.value = []
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
    <EditUserInfoForm v-model="editUserInfoFormDialog" :info="editInfo" @on-closed="afterUser" />
    <DeleteDialog
      v-model="deleteDialog"
      v-model:length="selected.length"
      @delete="deleteUserLogic"
    />
    <section class="menu">
      <span class="w-20 text-indigo">
        <v-text-field
          v-model="search"
          @update:modelValue="fetchUserLogic"
          :loading="loading"
          :counter="15"
          clearable
          label="搜索"
          prepend-inner-icon="mdi-magnify"
          variant="underlined"
          hide-details
        >
          <v-tooltip activator="parent" location="top">以用户名或真实姓名搜索</v-tooltip>
        </v-text-field>
      </span>
      <span>
        <v-btn v-if="has('user:select')" prepend-icon="mdi-refresh" @click="fetchUserLogic"
          >刷新</v-btn
        >
        <v-btn
          v-if="has('user:insert')"
          prepend-icon="mdi-plus-circle"
          color="primary"
          @click="addUserFormDialog = true"
          >添加</v-btn
        >
        <v-btn
          v-if="has('user_role:insert') && has('user_role:delete')"
          prepend-icon="mdi-card-multiple"
          color="indigo"
          @click="editUserRoleBtnHandler"
          >设置角色</v-btn
        >
        <v-btn
          v-if="has('user:delete')"
          prepend-icon="mdi-delete"
          color="error"
          @click="deleteDialog = true"
          >删除</v-btn
        >
      </span>
    </section>
    <section class="pa-4 d-inline-block w-100">
      <v-card>
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
              <v-btn
                prepend-icon="mdi-pencil"
                color="indigo"
                @click="
                  () => {
                    editInfo = item as UserRecord
                    editUserInfoFormDialog = true
                  }
                "
                >编辑</v-btn
              >
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
  align-items: center;
  padding: 1rem 1rem 0 1rem;
}
.menu span > * {
  margin-right: 0.5rem;
}
.w-20 {
  width: 20% !important;
}
</style>
