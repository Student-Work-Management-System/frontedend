<script lang="ts" setup>
import { apiGetRoleList } from '@/api/role'
import { apiUpdateUser } from '@/api/user'
import { notify } from '@kyvg/vue3-notification'
import { onMounted } from 'vue'
import { watch } from 'vue'
import { computed, type ComputedRef } from 'vue'
import { ref } from 'vue'
import SelectPermissions from './SelectPermissions.vue'

const model = defineModel<boolean>()
const props = defineProps<{ selectedUsers: string[] }>()
const emit = defineEmits(['onClosed'])
const loading = ref(false)
const items = ref<{ text: string }[]>([])
const search = ref('')
const allSelected = ref(false)
const selected = ref<{ rid: string; text: string }[]>([])
const selections = computed(() => {
  const selections: any[] = []
  for (const selection of selected.value) {
    selections.push(selection)
  }
  return selections
})

const categories = computed(() => {
  const searchWord = search.value
  if (!searchWord) return items.value
  return items.value.filter((item) => item.text.indexOf(searchWord) > -1)
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
  console.log(props.selectedUsers)
  props.selectedUsers.forEach((uid) => {
    apiUpdateUser({
      uid,
      roles: selected.value.map((r) => r.rid)
    }).then(({ data: result }) => {
      if (result.code !== 200) {
        console.error(result)
        notify({ type: 'error', title: '错误', text: result.message })
        loading.value = false
        return
      }
      notify({ type: 'success', title: '成功', text: `用户:${uid} 角色同步成功！` })
    })
  })
  setTimeout(() => {
    loading.value = false
    emit('onClosed')
  }, 500)
}

const fetchRoleList = async () => {
  const { data: result } = await apiGetRoleList()
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  items.value = result.data.map((r) => ({ rid: r.rid, text: r.roleName }))
}

onMounted(() => {
  fetchRoleList()
})
</script>

<template>
  <v-dialog width="500" v-model="model">
    <v-card :loading="loading" width="auto" prepend-icon="mdi-script" title="选择角色">
      <v-container class="w-100">
        <v-row align="center" justify="start">
          <v-col
            v-for="(selection, i) in selections"
            :key="selection.text"
            class="py-1 pe-0"
            cols="auto"
          >
            <v-chip
              color="indigo"
              :disabled="loading"
              closable
              @click:close="selected.splice(i, 1)"
            >
              {{ selection.text }}
            </v-chip>
          </v-col>

          <v-col v-if="!allSelected" cols="12">
            <v-text-field
              ref="searchField"
              v-model="search"
              label="搜索"
              hide-details
              single-line
            ></v-text-field>
          </v-col>
        </v-row>

        <v-divider v-if="!allSelected"></v-divider>

        <v-list>
          <template v-for="item in categories">
            <v-list-item
              v-if="!selected.includes(item)"
              :key="item.text"
              :disabled="loading"
              @click="selected.push(item)"
            >
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            :disabled="!selected.length"
            :loading="loading"
            color="purple"
            variant="text"
            @click="EditUserLogic"
          >
            提交
          </v-btn>
          <v-btn variant="text" @click="model = false"> 取消 </v-btn>
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
