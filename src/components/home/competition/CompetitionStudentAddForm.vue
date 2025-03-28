<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { apiAddStudentCompetition } from '@/api/competition'
import type { StudentCompetitionWithMember } from '@/model/competitionModel'
import moment from 'moment'
import { apiUploadFile } from '@/api/file'
import CompetitionsSelect from '@/components/home/competition/CompetitionsSelect.vue'
import { useUserStore } from '@/stores/userStore'
import LevelSelect from '@/components/home/competition/LevelSelect.vue'
import DateSelect from '@/components/home/DateSelect.vue'
import StudentSelect from '@/components/home/competition/StudentSelect.vue'
import { useCompetitionStore } from '@/stores/competitionStore'

const dialog = defineModel<boolean>()
const emits = defineEmits(['onClosed'])
const loading = ref(false)
const form = ref(false)
const step = ref(1)
const files = ref<File[]>([])
const userStore = useUserStore()
const competitionStore = useCompetitionStore()
const newItem = reactive<StudentCompetitionWithMember>({
  competitionId: '',
  headerId: userStore.getUserData.username,
  evidence: '',
  level: '',
  date: moment(new Date()).format('YYYY-MM-DD'),
  studentIds: [userStore.getUserData.username]
})

const checkCompetitionIsSolo = computed(() => {
  return competitionStore.checkCompetitionIsSolo(newItem.competitionId)
})
const nextStepHandler = () => {
  if (isNaN(Number(userStore.getUserData.username))) {
    notify({ type: 'warn', title: '提示', text: '当前用户无法使用上报！' })
    return
  }
  step.value++
}
const submitHandler = async () => {
  loading.value = true
  // const { data: uploadFileResult } = await apiUploadFile('competition', files.value[0])
  // if (uploadFileResult.code !== 200) {
  //   notify({ type: 'error', title: '错误', text: uploadFileResult.message })
  //   loading.value = false
  //   return
  // }
  // newItem.evidence = uploadFileResult.data
  newItem.evidence = 'www.baidu.com'
  newItem.date = moment(new Date(newItem.date)).format('YYYY-MM-DD')
  const { data: result } = await apiAddStudentCompetition(newItem)
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  loading.value = false
  step.value = 1
  notify({ type: 'success', title: '成功', text: '获奖记录添加成功！' })
  emits('onClosed')
}
</script>

<template>
  <v-dialog v-model="dialog" width="600">
    <v-card :loading="loading" width="auto" prepend-icon="mdi-upload" title="上传获奖记录">
      <v-window v-model="step">
        <v-window-item :value="1">
          <v-container class="px-8">
            <v-form v-model="form" class="form text-indigo">
              <v-text-field
                label="填报人学号"
                color="indigo"
                v-model="newItem!.headerId"
                prepend-inner-icon="mdi-head"
                readonly
                hide-details
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                </template>
              </v-text-field>

              <CompetitionsSelect v-model="newItem!.competitionId">
                <v-icon size="smaller" color="error" icon="mdi-asterisk" />
              </CompetitionsSelect>

              <LevelSelect v-model="newItem!.level">
                <v-icon size="smaller" color="error" icon="mdi-asterisk" />
              </LevelSelect>

              <DateSelect v-model="newItem!.date" label="获奖日期">
                <v-icon size="smaller" color="error" icon="mdi-asterisk" />
              </DateSelect>

              <StudentSelect v-if="!checkCompetitionIsSolo" v-model="newItem!.studentIds" />
            </v-form>
          </v-container>

          <v-divider></v-divider>

          <v-container class="w-100 d-flex justify-space-evenly">
            <v-btn
              text="下一步"
              :loading="loading"
              color="indigo"
              variant="plain"
              @click="nextStepHandler"
            />
            <v-btn text="取消" variant="plain" @click="(step = 1), (dialog = false)" />
          </v-container>
        </v-window-item>
        <v-window-item :value="2">
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
          </v-container>

          <v-divider></v-divider>
          
          <v-container class="w-100 d-flex justify-space-evenly">
            <v-btn
              :disabled="files!.length <= 0"
              text="提交"
              :loading="loading"
              color="indigo"
              variant="plain"
              @click="submitHandler"
            />
            <v-btn text="取消" variant="plain" @click="(step = 1), (dialog = false)" />
          </v-container>
        </v-window-item>
      </v-window>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.form > * {
  margin-bottom: 0.5rem;
}
</style>
