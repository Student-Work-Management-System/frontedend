<script setup lang="ts">
import type {
  AcademicWorkRequest,
  AcademicWorkUser,
  AcademicWorkPaper,
  AcademicWorkPatent,
  AcademicWorkSoft
} from '@/model/academicWorkModel'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { apiUploadFile } from '@/api/file'
import { academicWorkTypes, apiAddAcademicWork, apiGetOptionalUser } from '@/api/academicWork'
import DateSelect from '../DateSelect.vue'
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

const targetAcademicWork = computed(() => {
  if (work.type === 'paper') {
    return paper
  } else if (work.type === 'soft') {
    return soft
  } else {
    return patent
  }
})

const work = reactive<AcademicWorkRequest>({
  username: userStore.getUserData.username,
  workName: '',
  type: 'paper',
  team: [],
  evidence: '',
  academicWork: null
})

const paper = ref<AcademicWorkPaper>({
  periodicalName: '',
  jrcPartition: '',
  casPartition: '',
  recordedTime: '',
  searchedTime: '',
  isMeeting: false,
  isChineseCore: false,
  isEI: false,
  isEIRecorded: false,
  type: 'paper'
})

const patent = ref<AcademicWorkPatent>({
  publishState: '',
  publishDate: '',
  acceptDate: '',
  authorizationDate: '',
  type: 'patent'
})

const soft = ref<AcademicWorkSoft>({
  publishInstitution: '',
  publishDate: '',
  type: 'soft'
})

const isPaper = (type: string) => {
  return type === 'paper'
}

const isSoft = (type: string) => {
  return type === 'soft'
}

const isPatent = (type: string) => {
  return type === 'patent'
}

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
  const exists = selectedUser.value.find((u) => u.username === user.username)
  if (!exists) {
    selectedUser.value.push(user)
  } else {
    notify({ type: 'warn', title: '提示', text: '该成员已添加' })
  }
}

const applySelectedUsers = () => {
  selectedUser.value.forEach((user, index) => {
    work.team.push({
      username: user.username,
      memberOrder: String(work.team.length + 1 + index)
    })
  })
}

const stepOneNext = () => {
  step.value++
  selectedUser.value = []
  selectedUser.value.push({
    username: userStore.getUserData.username,
    realName: userStore.getUserData.realName
  })
}

const stepTwoBack = () => {
  step.value--
}

const stepTwoNext = () => {
  step.value++
  applySelectedUsers()
}

const stepThreeBack = () => {
  step.value--
  work.team = []
}

const paperEnabled = computed(() => {
  return (
    paper.value.casPartition === '' ||
    paper.value.jrcPartition === '' ||
    paper.value.periodicalName === '' ||
    paper.value.recordedTime === '' ||
    paper.value.searchedTime === ''
  )
})

const softEnabled = computed(() => {
  return soft.value.publishDate === '' || soft.value.publishInstitution === ''
})

const patentEnabled = computed(() => {
  return (
    patent.value.acceptDate === '' ||
    patent.value.authorizationDate === '' ||
    patent.value.publishDate === '' ||
    patent.value.publishState === ''
  )
})

const disabled = computed(() => {
  if (work.type === 'paper') return paperEnabled.value
  else if (work.type === 'soft') return softEnabled.value
  else return patentEnabled.value
})

const addStudentAcademicWork = async () => {
  try {
    loading.value = true
    // const { data: uploadFileResult } = await apiUploadFile('academic', files.value[0])
    // if (uploadFileResult.code !== 200) {
    //   notify({ type: 'error', title: '错误', text: uploadFileResult.message })
    //   loading.value = false
    //   return
    // }
    // work.evidence = uploadFileResult.data
    work.evidence = 'www.baidu.com'
    work.academicWork = targetAcademicWork.value
    const { data: result } = await apiAddAcademicWork(work)
    if (result.code !== 200) {
      notify({ type: 'error', title: '错误', text: result.message })
      loading.value = false
      return
    }
    notify({ type: 'success', title: '成功', text: '学术作品添加成功！' })
  } catch (error) {
    console.log(error)
    notify({ type: 'error', title: '错误', text: `${error}` })
  } finally {
    loading.value = false
    step.value = 1
    emits('onClosed')
    initWork()
  }
}

const initWork = () => {
  work.type = 'paper'
  work.username = userStore.getUserData.username
  work.evidence = ''
  work.academicWork = targetAcademicWork
  work.team = []
  selectedUser.value = []
  work.workName = ''
  paper.value.casPartition = ''
  paper.value.isChineseCore = false
  paper.value.isEI = false
  paper.value.isEIRecorded = false
  paper.value.isMeeting = false
  paper.value.jrcPartition = ''
  paper.value.periodicalName = ''
  paper.value.recordedTime = ''
  paper.value.searchedTime = ''
  soft.value.publishInstitution = ''
  soft.value.publishDate = ''
  patent.value.publishDate = ''
  patent.value.authorizationDate = ''
  patent.value.acceptDate = ''
  patent.value.publishState = ''
}

onMounted(initWork)
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
                :rules="[() => work.workName.length >= 0 || '该选项必填！']"
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
            <v-btn text="取消" variant="plain" @click="(step = 1), (model = false), initWork()" />
            <v-btn
              :disabled="work.workName.length <= 0 || work.type === null"
              text="下一步"
              :loading="loading"
              color="indigo"
              variant="plain"
              @click="stepOneNext()"
            />
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
                :key="member.username"
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
            <v-btn variant="plain" text="上一步" @click="stepTwoBack" />

            <v-btn text="取消" variant="plain" @click="(step = 1), (model = false), initWork()" />
            <v-btn text="下一步" color="indigo" variant="plain" @click="stepTwoNext()" />
          </v-container>
        </v-window-item>

        <v-window-item :value="3">
          <v-container class="px-8">
            <v-form v-model="form" class="px-8 form">
              <!-- 论文类型 -->
              <template v-if="isPaper(work.type)">
                <v-text-field
                  color="indigo"
                  class="text-indigo"
                  v-model="paper!.periodicalName"
                  label="期刊名称"
                >
                  <template v-slot:prepend>
                    <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                  </template>
                </v-text-field>

                <v-text-field
                  color="indigo"
                  class="text-indigo"
                  v-model="paper!.jrcPartition"
                  label="JCR分区"
                >
                  <template v-slot:prepend>
                    <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                  </template>
                </v-text-field>

                <v-text-field
                  color="indigo"
                  class="text-indigo"
                  v-model="paper!.casPartition"
                  label="CAS分区"
                >
                  <template v-slot:prepend>
                    <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                  </template>
                </v-text-field>

                <DateSelect class="mb-5" v-model="paper!.recordedTime" label="收录时间">
                  <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                </DateSelect>

                <DateSelect class="mt-5" v-model="paper!.searchedTime" label="检索时间">
                  <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                </DateSelect>

                <v-checkbox
                  color="indigo"
                  class="text-indigo"
                  v-model="paper!.isMeeting"
                  label="会议论文"
                />
                <v-checkbox
                  color="indigo"
                  class="text-indigo"
                  v-model="paper!.isChineseCore"
                  label="中文核心"
                />
                <v-checkbox
                  color="indigo"
                  class="text-indigo"
                  v-model="paper!.isEI"
                  label="EI收录"
                />
                <v-checkbox
                  color="indigo"
                  class="text-indigo"
                  v-model="paper!.isEIRecorded"
                  label="EI检索"
                />
              </template>

              <!-- 软件著作类型 -->
              <template v-else-if="isSoft(work.type)">
                <v-text-field
                  color="indigo"
                  class="text-indigo"
                  v-model="soft!.publishInstitution"
                  label="登记机构"
                >
                  <template v-slot:prepend>
                    <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                  </template>
                </v-text-field>
                <DateSelect v-model="soft!.publishDate" label="登记日期">
                  <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                </DateSelect>
              </template>

              <!-- 专利类型 -->
              <template v-else-if="isPatent(work.type)">
                <v-text-field
                  color="indigo"
                  class="text-indigo"
                  v-model="patent!.publishState"
                  label="授权状态"
                >
                  <template v-slot:prepend>
                    <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                  </template>
                </v-text-field>
                <DateSelect v-model="patent!.publishDate" label="发表日期">
                  <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                </DateSelect>
                <DateSelect class="mt-5" v-model="patent!.acceptDate" label="受理日期">
                  <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                </DateSelect>
                <DateSelect class="mt-5" v-model="patent!.authorizationDate" label="授权日期">
                  <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                </DateSelect>
              </template>
            </v-form>
          </v-container>

          <v-divider></v-divider>

          <v-container class="w-100 d-flex justify-space-evenly">
            <v-btn variant="plain" text="上一步" @click="stepThreeBack()" />
            <v-btn text="取消" variant="plain" @click="(step = 1), (model = false), initWork()" />
            <v-btn
              :disabled="disabled"
              text="下一步"
              color="indigo"
              variant="plain"
              @click="step++"
            />
          </v-container>
        </v-window-item>

        <v-window-item :value="4">
          <v-container class="px-8">
            <v-file-input
              v-model="files"
              class="text-indigo"
              color="indigo"
              variant="outlined"
              counter
              show-size
              free-select
              label="证明材料 文件选择"
            />

            <v-divider></v-divider>

            <v-container class="w-100 d-flex justify-space-evenly">
              <v-btn variant="plain" text="上一步" @click="step--, (work.evidence = '')" />
              <v-btn text="取消" variant="plain" @click="(step = 1), (model = false), initWork()" />
              <v-btn text="提交" color="indigo" variant="plain" @click="addStudentAcademicWork" />
            </v-container>
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
