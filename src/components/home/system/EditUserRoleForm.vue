<script lang="ts" setup>
import { apiGetRoleList } from '@/api/role'
import { apiUpdateUserRole } from '@/api/user'
import type { RoleItem } from '@/model/systemModel'
import { notify } from '@kyvg/vue3-notification'
import { onMounted, watch, computed, ref } from 'vue'

const model = defineModel<boolean>()
const props = defineProps<{ selectedUsers: string[] }>()
const emit = defineEmits(['onClosed'])
const loading = ref(false)
const items = ref<RoleItem[]>([])
const search = ref('')
const allSelected = ref(false)
const selected = ref<RoleItem[]>([])
const selections = computed(() => {
  const selections: RoleItem[] = []
  for (const selection of selected.value) {
    selections.push(selection)
  }
  return selections
})

const categories = computed(() => {
  const searchWord = search.value
  if (!searchWord) return items.value
  return items.value.filter((item) => {
    if (item.rid === '5') return false
    if (!searchWord) return true
    return item.roleName.includes(searchWord)
  })
})

watch(selected, () => {
  search.value = ''
})

const EditUserLogic = async () => {
  if (selected.value.length === 0) {
    notify({ type: 'warn', title: '错误', text: '请至少选择一个角色！' })
    return
  }
  loading.value = true
  try {
    const reqs = props.selectedUsers.map((uid) =>
      apiUpdateUserRole({
        uid,
        roles: selected.value.map((r) => r.rid) as string[]
      }).then(({ data: result }) => {
        if (result.code !== 200) {
          console.error(result)
          notify({ type: 'error', title: '错误', text: `用户: ${uid} ` + result.message })
          return false
        }
        notify({ type: 'success', title: '成功', text: `用户: ${uid}, 角色设置成功！` })
        return true
      })
    )

    const results = await Promise.all(reqs)
    // 只有当所有请求都成功时才关闭对话框并清理状态
    if (results.every((result) => result === true)) {
      clear()
      emit('onClosed')
    }
  } catch (error) {
    console.error('更新用户角色时发生错误:', error)
    notify({ type: 'error', title: '错误', text: '更新用户角色时发生错误' })
  } finally {
    loading.value = false
  }
}

const clear = () => {
  search.value = ''
  selected.value = []
  allSelected.value = false
}

const fetchRoleList = async () => {
  const { data: result } = await apiGetRoleList()
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  items.value = result.data.filter((item: RoleItem) => item.rid !== '5')
  selected.value = []
}

onMounted(async () => {
  await fetchRoleList()
})
</script>

<template>
  <v-dialog width="400" v-model="model">
    <v-card :loading="loading" width="auto" prepend-icon="mdi-script" title="选择角色">
      <v-container class="w-100">
        <v-row align="center" justify="start">
          <v-col
            v-for="(selection, i) in selections"
            :key="selection.roleName"
            class="py-1 pe-0"
            cols="auto"
          >
            <v-chip
              color="indigo"
              :disabled="loading"
              closable
              @click:close="selected.splice(i, 1)"
            >
              {{ selection.roleName }}
            </v-chip>
          </v-col>

          <v-col v-if="!allSelected" cols="12">
            <v-text-field
              ref="searchField"
              v-model="search"
              label="搜索"
              hide-details
              single-line
            />
          </v-col>
        </v-row>

        <v-divider v-if="!allSelected" />

        <v-list>
          <template v-for="item in categories">
            <v-list-item
              v-if="!selected.includes(item)"
              :key="item.roleName"
              :disabled="loading"
              @click="selected.push(item)"
            >
              <v-list-item-title>{{ item.roleName }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
        <v-divider />

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            :disabled="!selected.length"
            :loading="loading"
            color="indigo"
            variant="text"
            @click="EditUserLogic"
            text="提交"
          />
          <v-btn variant="text" @click="model = false" text="取消" />
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.form > * {
  margin-bottom: 0.5rem;
}
</style>
