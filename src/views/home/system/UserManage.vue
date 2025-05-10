<script lang="ts" setup>
import { ref } from 'vue'
import { apiDeleteUser, apiGetUserList, apiRecoverDeteteUser } from '@/api/user'
import { notify } from '@kyvg/vue3-notification'
import { reactive } from 'vue'
import { onMounted } from 'vue'
import AddUserForm from '@/components/home/system/AddUserForm.vue'
import TrueOrFalseSelect from '@/components/home/TrueOrFalseSelect.vue'
import EditUserRoleForm from '@/components/home/system/EditUserRoleForm.vue'
import EditUserInfoForm from '@/components/home/system/EditUserInfoForm.vue'
import DeleteDialog from '@/components/home/DeleteDialog.vue'
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { type UserRecord } from '@/model/systemModel'

const headers = [
  {
    title: 'UID',
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
    title: '手机号',
    align: 'start',
    sortable: false,
    key: 'phone'
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
  phone: '',
  createdAt: '',
  enabled: true,
  roles: []
})
const addUserFormDialog = ref(false)
const editUserRoleFormDialog = ref(false)
const editUserInfoFormDialog = ref(false)
const deleteDialog = ref(false)
const selectedUids = computed(() => selected.value.map((u) => u.uid))
const selectedEnabled = ref(true)

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
    enabled: selectedEnabled.value,
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
  selected.value = []
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

const deleteUserLogic = async () => {
  loading.value = true
  let reqs = selected.value.map((u) =>
    (async (u) => {
      const uid = u.uid
      const { data: result } = await apiDeleteUser(uid)
      if (result.code !== 200) {
        console.error(result)
        notify({ type: 'error', title: '错误', text: result.message })
        return
      }
      notify({ type: 'success', title: '成功', text: `用户:${uid} 角色删除成功！` })
    })(u)
  )

  await Promise.all(reqs)
  afterUser()
  loading.value = false
}

const afterUser = async () => {
  addUserFormDialog.value = false
  editUserRoleFormDialog.value = false
  editUserInfoFormDialog.value = false
  deleteDialog.value = false
  selected.value = []
  await fetchUserLogic()
}

const recoverUser = async (id: string) => {
  loading.value = true
  const { data: result } = await apiRecoverDeteteUser(id)
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  notify({ type: 'success', title: '成功', text: '恢复成功！' })
  loading.value = false
  afterUser()
  return
}

// 高度计算相关
const containerHeight = ref(0)
const selectMenuHeight = ref(0)
const tableHeight = computed(() => {
  return containerHeight.value - selectMenuHeight.value - 100
})

onMounted(() => {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target.classList.contains('card-container')) {
        containerHeight.value = entry.contentRect.height
      } else if (entry.target.classList.contains('menu')) {
        selectMenuHeight.value = entry.contentRect.height
      }
    }
  })

  // 观察元素
  const container = document.querySelector('.card-container')
  const selectMenu = document.querySelector('.menu')

  if (container) resizeObserver.observe(container)
  if (selectMenu) resizeObserver.observe(selectMenu)

  onMounted(() => {
    resizeObserver.disconnect()
  })
})
</script>
<template>
  <v-card elevation="10" height="100%" width="100%" class="card-container">
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
      @on-closed="afterUser"
    />

    <section class="menu">
      <span class="w-20">
        <TrueOrFalseSelect
          v-model="selectedEnabled"
          label="账户状态"
          variant="underlined"
          :items="[
            { key: '正常', value: true },
            { key: '已删除', value: false }
          ]"
        />
      </span>

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
        <v-btn
          v-if="has('user:select')"
          prepend-icon="mdi-refresh"
          @click="fetchUserLogic"
          text="刷新"
        />

        <v-btn
          v-if="has('user:insert')"
          prepend-icon="mdi-plus-circle"
          color="primary"
          @click="addUserFormDialog = true"
          text="添加"
        />

        <v-btn
          v-if="has('user_role:insert') && has('user_role:delete')"
          prepend-icon="mdi-card-multiple"
          color="indigo"
          @click="editUserRoleBtnHandler"
          text="设置角色"
        />

        <v-btn
          v-if="has('user:delete')"
          prepend-icon="mdi-delete"
          color="error"
          @click="deleteDialog = true"
          text="删除"
        />
      </span>
    </section>

    <section class="pa-4 w-100" ref="tableDom">
      <v-card>
        <v-data-table
          v-model="selected"
          :headers="headers as any"
          :height="tableHeight"
          :items="data"
          :loading="loading"
          :page="pageOptions.pageNum"
          :items-per-page="pageOptions.pageSize"
          show-select
          return-object
        >
          <!-- eslint-disable-next-line vue/valid-v-slot -->
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
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template v-slot:item.operations="{ item }">
            <div>
              <v-btn
                v-if="has('user:update:all')"
                prepend-icon="mdi-pencil"
                color="indigo"
                class="mr-2"
                @click="
                  () => {
                    editInfo = item as UserRecord
                    editUserInfoFormDialog = true
                  }
                "
                text="编辑"
              />
              <v-btn
                v-if="has('user:update:all') && !(item as UserRecord).enabled"
                prepend-icon="mdi-refresh"
                color="warning"
                variant="plain"
                @click="recoverUser((item as UserRecord).uid)"
                text="恢复删除"
              />
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
