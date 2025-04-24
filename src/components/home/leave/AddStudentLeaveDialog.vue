<script setup lang="ts">
import { ref, reactive } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { apiAddStudentLeave } from '@/api/leave'
import type { StudentLeaveRequest } from '@/model/leaveModel'
import { useUserStore } from '@/stores/userStore'
import DateSelect from '@/components/home/DateSelect.vue'
import ItemSelect from '../ItemSelect.vue'
import TrueOrFalseSelect from '../TrueOrFalseSelect.vue'
import CounselorSelect from './CounselorSelect.vue'

const dialog = defineModel<boolean>()
const loading = ref(false)
const step = ref(1)
const files = ref<File[]>([])
const userStore = useUserStore()
const emits = defineEmits(['onClosed'])
const newRequest = reactive<StudentLeaveRequest>({
  studentId: userStore.getUserData.username,
  type: '',
  reason: '',
  target: '',
  targetDetail: '',
  internship: false,
  startDay: '',
  endDay: '',
  evidences: [],
  counselorId: ''
})

const addStudentLeave = async () => {
  try {
    loading.value = true
    // todo: 请假附件
    const { data: result } = await apiAddStudentLeave(newRequest)
    if (result.code !== 200) {
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
    step.value = 1
    notify({ type: 'success', title: '成功', text: '申请添加成功' })
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
    cancel()
    emits('onClosed')
  }
}

const backToStepOne = () => {
  step.value = 1
  newRequest.type = ''
  newRequest.reason = ''
}

const backToStepTwo = () => {
  step.value = 2
  newRequest.startDay = ''
  newRequest.endDay = ''
  newRequest.target = ''
  newRequest.targetDetail = ''
}

const backToStepThree = () => {
  step.value = 3
  newRequest.counselorId = ''
}

const cancel = () => {
  step.value = 1
  dialog.value = false
  newRequest.type = ''
  newRequest.reason = ''
  newRequest.startDay = ''
  newRequest.endDay = ''
  newRequest.target = ''
  newRequest.targetDetail = ''
  newRequest.evidences = []
  newRequest.counselorId = ''
}
</script>

<template>
  <v-dialog v-model="dialog" width="500">
    <v-card :loading="loading" width="auto" prepend-icon="mdi-upload" title="添加请假记录">
      <v-window v-model="step">
        <v-window-item :value="1">
          <v-container class="px-8 form">
            <ItemSelect
              v-model="newRequest.type"
              prepend-icon="mdi-shape"
              label="请假类型"
              :items="['事假', '病假']"
            >
              <v-icon size="smaller" color="error" icon="mdi-asterisk" />
            </ItemSelect>

            <v-textarea
              label="请假理由"
              color="indigo"
              class="text-indigo"
              v-model="newRequest.reason"
              prepend-inner-icon="mdi-comment-text"
              auto-grow
              rows="3"
              hide-details
            >
              <template v-slot:prepend>
                <v-icon size="smaller" color="error" icon="mdi-asterisk" />
              </template>
            </v-textarea>
          </v-container>

          <v-divider></v-divider>

          <v-container class="w-100 d-flex justify-space-evenly">
            <v-btn text="取消" variant="plain" @click="cancel" />
            <v-btn
              :disabled="newRequest.type === '' && newRequest.reason === ''"
              text="下一步"
              color="indigo"
              variant="plain"
              @click="step++"
            />
          </v-container>
        </v-window-item>

        <v-window-item :value="2">
          <v-container class="px-8 form">
            <v-text-field
              label="目的地"
              color="indigo"
              class="text-indigo"
              v-model="newRequest.target"
              prepend-inner-icon="mdi-map-marker"
              hide-details
            >
              <template v-slot:prepend>
                <v-icon size="smaller" color="error" icon="mdi-asterisk" />
              </template>
            </v-text-field>

            <v-text-field
              label="目的地详细地址"
              color="indigo"
              class="text-indigo"
              v-model="newRequest.targetDetail"
              prepend-inner-icon="mdi-map-marker-path"
              hide-details
            >
              <template v-slot:prepend>
                <v-icon size="smaller" color="error" icon="mdi-asterisk" />
              </template>
            </v-text-field>

            <DateSelect v-model="newRequest!.startDay" label="请假起始日期">
              <v-icon size="smaller" color="error" icon="mdi-asterisk" />
            </DateSelect>

            <DateSelect v-model="newRequest!.endDay" label="请假结束日期">
              <v-icon size="smaller" color="error" icon="mdi-asterisk" />
            </DateSelect>

            <TrueOrFalseSelect
              label="在外实习"
              prepend-icon="mdi-briefcase-clock"
              :items="[
                { key: '是', value: true },
                { key: '否', value: false }
              ]"
            >
              <v-icon size="smaller" color="error" icon="mdi-asterisk" />
            </TrueOrFalseSelect>
          </v-container>

          <v-divider></v-divider>

          <v-container class="w-100 d-flex justify-space-evenly">
            <v-btn text="上一步" color="indigo" variant="plain" @click="backToStepOne" />
            <v-btn text="取消" variant="plain" @click="cancel" />
            <v-btn
              :disabled="
                newRequest.startDay === '' &&
                newRequest.endDay === '' &&
                newRequest.target === '' &&
                newRequest.targetDetail === ''
              "
              text="下一步"
              color="indigo"
              variant="plain"
              @click="step++"
            />
          </v-container>
        </v-window-item>

        <v-window-item :value="3">
          <v-container class="px-8 form">
            <CounselorSelect v-model:counselor-id="newRequest.counselorId">
              <template v-slot:prepend>
                <v-icon size="smaller" color="error" icon="mdi-asterisk" />
              </template>
            </CounselorSelect>
          </v-container>
          <v-divider></v-divider>
          <v-container class="w-100 d-flex justify-space-evenly">
            <v-btn text="上一步" color="indigo" variant="plain" @click="backToStepTwo" />
            <v-btn text="取消" variant="plain" @click="cancel" />
            <v-btn
              :disabled="newRequest.counselorId === ''"
              text="下一步"
              color="indigo"
              variant="plain"
              @click="step++"
            />
          </v-container>
        </v-window-item>

        <v-window-item :value="4">
          <v-container class="px-8 form">
            <v-file-input
              v-model="files"
              class="text-indigo"
              color="indigo"
              variant="outlined"
              multiple
              counter
              show-size
              free-select
              label="证明材料 文件选择"
            />
          </v-container>
          <v-divider></v-divider>
          <v-container class="px-8 form">
            <v-container class="w-100 d-flex justify-space-evenly">
              <v-btn text="上一步" color="indigo" variant="plain" @click="backToStepThree" />
              <v-btn text="取消" variant="plain" @click="cancel" />
              <v-btn text="提交" color="indigo" variant="plain" @click="addStudentLeave" />
            </v-container>
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
