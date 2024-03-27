<script lang="ts" setup>
import { apiGetRoleList } from '@/api/role'
import { apiAddUser } from '@/api/user'
import { notify } from '@kyvg/vue3-notification'
import { onMounted } from 'vue'
import { watch } from 'vue'
import { computed } from 'vue'
import { reactive, ref } from 'vue'

const model = defineModel<boolean>()
const emit = defineEmits(['onClosed'])

const form = ref(false)
const newUser = reactive({ username: '', password: '', email: '', realName: '' })
const loading = ref(false)
const step = ref(1)
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

const AddBtnHandler = () => {
  step.value++
}
const AddUserLogic = async () => {
  if (selected.value.length === 0) {
    notify({ type: 'warn', title: '错误', text: '请至少选择一个角色！' })
    return
  }
  if (form.value === null || !form.value) {
    console.error(form.value)
    notify({ type: 'error', title: '错误', text: '表单信息错误！' })
    return
  }
  loading.value = true
  const { data: result } = await apiAddUser({
    ...newUser,
    roles: selected.value.map((r) => r.rid)
  })
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  notify({ type: 'success', title: '成功', text: '添加成功！' })
  loading.value = false
  emit('onClosed')
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
onMounted(fetchRoleList)
</script>

<template>
  <v-dialog width="500" v-model="model">
    <v-window v-model="step">
      <v-window-item :value="1">
        <v-card :loading="loading" width="auto" prepend-icon="mdi-account-plus" title="新增用户">
          <v-container class="px-8">
            <v-form v-model="form" class="form">
              <v-text-field
                label="用户名"
                v-model="newUser.username"
                prepend-inner-icon="mdi-account"
                :counter="20"
                clearable
                required
                :rules="[() => !!newUser.username || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-text-field>
              <v-text-field
                label="密码"
                prepend-inner-icon="mdi-lock"
                v-model="newUser.password"
                :counter="18"
                clearable
                required
                :rules="[() => !!newUser.password || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-text-field>

              <v-text-field
                label="真实姓名"
                v-model="newUser.realName"
                prepend-inner-icon="mdi-human-greeting"
                :counter="20"
                clearable
                required
                :rules="[() => !!newUser.realName || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-text-field>
              <v-text-field
                prepend-inner-icon="mdi-email"
                label="邮箱"
                v-model="newUser.email"
                :counter="11"
                clearable
                required
                :rules="[() => !!newUser.realName || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-text-field>
            </v-form>
          </v-container>
          <v-divider></v-divider>

          <v-container class="w-100 d-flex justify-space-evenly">
            <v-btn
              :disabled="!form"
              text="下一步"
              :loading="loading"
              color="purple"
              variant="plain"
              @click="AddBtnHandler"
            ></v-btn>
            <v-btn text="取消" variant="plain" @click="model = false"></v-btn>
          </v-container>
        </v-card>
      </v-window-item>
      <v-window-item :value="2">
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
                @click="AddUserLogic"
              >
                提交
              </v-btn>
              <v-btn
                variant="text"
                @click="
                  () => {
                    model = false
                    step = 1
                  }
                "
              >
                取消
              </v-btn>
            </v-card-actions>
          </v-container>
        </v-card>
      </v-window-item>
    </v-window>
  </v-dialog>
</template>

<style scoped>
.form > * {
  margin-bottom: 0.5rem;
}
</style>
