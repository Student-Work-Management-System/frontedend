<script setup lang="ts">
import type { AcademicWorkRequest, AcademicWorkUser } from '@/model/academicWorkModel'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { academicWorkTypes, apiGetOptionalUser } from '@/api/academicWork'
import KeyValueSelect from '../KeyValueSelect.vue'
import { notify } from '@kyvg/vue3-notification'
import { useUserStore } from '@/stores/userStore'
import { debounce } from '@/utils/debounce'

const userStore = useUserStore()
const form = ref(false)
const loading = ref(false)
const model = defineModel<boolean>()
const step = ref(1)
const files = ref<File[]>([])
const emits = defineEmits(['onClosed'])
const search = ref('')
const searchLoading = ref(false)
const userOptions = ref<AcademicWorkUser[]>([])
const selectedUser = ref<AcademicWorkUser[]>([])

const fetchUsers = async (val: string) => {
  if (!val || val.length <= 0) return
  searchLoading.value = true
  try {
    const { data: result } = await apiGetOptionalUser(val)
    if (result.code === 200) {
      userOptions.value = result.data
    } else {
      notify({ type: 'error', title: '错误', text: result.message })
    }
  } finally {
    searchLoading.value = false
  }
}

const debouncedFetchUsers = debounce(fetchUsers, 500)
watch(search, (val) => {
  debouncedFetchUsers(val)
})

const addToSelectedUser = (user: AcademicWorkUser) => {
  const exists = selectedUser.value.find((u) => u.uid === user.uid)
  if (!exists) {
    selectedUser.value.push(user)
  } else {
    notify({ type: 'warn', title: '提示', text: '该成员已添加' })
  }
}

const applySelectedUsers = () => {
  selectedUser.value.forEach((user, index) => {
    work.team.push({
      uid: user.uid,
      memberOrder: String(work.team.length + 1 + index)
    })
  })
  selectedUser.value = []
}

const work = reactive<AcademicWorkRequest>({
  uid: userStore.getUserData.uid,
  workName: '',
  type: 'paper',
  team: [],
  evidence: '',
  academic: null
})

const addStudentAcademicWork = async () => {}

onMounted(() => {
  selectedUser.value.push({
    uid: userStore.getUserData.uid,
    username: userStore.getUserData.username,
    realName: userStore.getUserData.realName
  })
})
</script>

<template>
  <v-dialog width="auto" min-width="500" height="auto" v-model="model">
    <v-card :loading="loading" width="auto" prepend-icon="mdi-upload" title="上传学术作品记录">
      <v-window v-model="step">
        <v-window-item :value="1">
          <v-container class="px-8">
            <v-form v-model="form" class="px-8 form">
              <v-text-field
                label="作品名称"
                v-model="work.workName"
                class="text-indigo"
                color="indigo"
                required
                :rules="[() => !!work.workName || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                </template>
              </v-text-field>
              <KeyValueSelect v-model="work.type" label="类型" :items="academicWorkTypes">
                <v-icon size="smaller" color="error" icon="mdi-asterisk" />
              </KeyValueSelect>
            </v-form>
          </v-container>

          <v-divider></v-divider>

          <v-container class="w-100 d-flex justify-space-evenly">
            <v-btn
              text="下一步"
              :loading="loading"
              color="indigo"
              variant="plain"
              @click="step++"
            />
            <v-btn text="取消" variant="plain" @click="(step = 1), (model = false)" />
          </v-container>
        </v-window-item>

        <v-window-item :value="2">
          <v-container class="px-8 pt-4">
            <v-autocomplete
              v-model:search="search"
              :items="userOptions"
              :loading="searchLoading"
              :item-title="(item) => `${item.username} - ${item.realName}`"
              item-value="uid"
              class="text-indigo"
              color="indigo"
              label="搜索并暂存团队成员（输入学号 / 工号）"
              clearable
              return-object
              hide-selected
              hide-no-data
              no-data-text="未找到相关用户"
              @update:search="debouncedFetchUsers"
              @update:modelValue="(user) => user && addToSelectedUser(user)"
              @blur="search = ''"
            />

            <v-divider class="my-4" />

            <v-list v-if="selectedUser.length">
              <v-list-item
                v-for="(member, index) in selectedUser"
                :key="member.uid"
                :title="`成员 ${index + 1}`"
                :subtitle="`${member.realName} (${member.username})`"
              >
                <template #append>
                  <v-btn
                    icon="mdi-delete"
                    color="red"
                    variant="text"
                    @click="selectedUser.splice(index, 1)"
                  />
                </template>
              </v-list-item>
            </v-list>

            <v-alert v-else type="info" text="暂无成员，请添加。" />
          </v-container>

          <v-divider></v-divider>

          <v-container class="w-100 d-flex justify-space-evenly">
            <v-btn text="上一步" @click="step--" />
            <v-btn text="取消" variant="plain" @click="(step = 1), (model = false)" />
            <v-btn
              text="下一步"
              color="indigo"
              variant="plain"
              @click="applySelectedUsers(), step++"
            />
          </v-container>
        </v-window-item>
      </v-window>
    </v-card>
  </v-dialog>
</template>

<style>
.svg-icon {
  margin-right: 0.5rem;
}
</style>
