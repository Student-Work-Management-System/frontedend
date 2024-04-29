<script lang="ts" setup>
import {
  apiUpdateStudentPovertyAssistance,
  apiGetPovertyAssistanceList,
  type StudentPovertyAssistanceRecord,
  type PovertyAssistance
} from '@/api/poverty'

import { watchEffect } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { ref, onMounted } from 'vue'
import { reactive } from 'vue'

const model = defineModel<boolean>()
const emits = defineEmits(['onClosed'])
const form = ref(false)
const props = defineProps<{ info: StudentPovertyAssistanceRecord }>()
const loading = ref(false)
const povertys = ref<PovertyAssistance[]>([])
const studentPovertyInfo = reactive({
  studentPovertyAssistanceId: '',
  studentId: '',
  povertyAssistanceId: '',
  povertyLevel: '',
  povertyType: '',
  assistanceYear: ''
})
const sname = ref('')

const updateInfoLogic = async () => {
  loading.value = true
  const { data: result } = await apiUpdateStudentPovertyAssistance({
    ...studentPovertyInfo
  })
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  loading.value = false
  notify({ type: 'success', title: '成功', text: '更新成功！' })
  emits('onClosed')
}
const itemProps = (poverty: PovertyAssistance) => {
  return {
    title: poverty.povertyType,
    value: poverty.povertyAssistanceId,
    subtitle: poverty.povertyLevel
  }
}
const fetchPovertyList = async () => {
  const { data: result } = await apiGetPovertyAssistanceList()
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  povertys.value = result.data
  
}

watchEffect(() => {
  studentPovertyInfo.studentPovertyAssistanceId = props.info.studentPovertyAssistanceId
  studentPovertyInfo.studentId = props.info.studentId
  studentPovertyInfo.povertyAssistanceId = props.info.povertyAssistanceId
  studentPovertyInfo.povertyLevel = props.info.povertyLevel
  studentPovertyInfo.povertyType = props.info.povertyType
  studentPovertyInfo.assistanceYear = props.info.assistanceYear
  sname.value = props.info.name

})

onMounted(() => {
  fetchPovertyList()
})
</script>

<template>
  <v-dialog width="auto" min-width="500" height="auto" v-model="model">
    <v-window>
      <v-window-item :value="1">
        <v-card width="auto" prepend-icon="mdi-account-edit" :title="sname + '的贫困认证记录信息'">
          <v-container>
            <v-form v-model="form" class="px-8">
              <v-text-field
                label="学号"
                v-model="studentPovertyInfo.studentId"
                :counter="20"
                readonly
                :rules="[() => !!studentPovertyInfo.studentId || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-text-field>

              <v-autocomplete
                label="贫困类型"
                v-model="studentPovertyInfo.povertyAssistanceId"
                :items="povertys"
                :item-props="itemProps"
                :rules="[() => !!studentPovertyInfo.povertyAssistanceId || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-autocomplete>

              <AcademicYearSelect
                class="mb-1"
                v-model="studentPovertyInfo.assistanceYear"
                label="认证学年"
                variant="filled"
              >
                <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
              </AcademicYearSelect>
            </v-form>
          </v-container>
          <v-divider></v-divider>
          <v-container class="w-100 d-flex justify-space-evenly">
            <v-btn
              :disabled="!form"
              text="确定"
              color="indigo"
              @click="updateInfoLogic"
              variant="plain"
            ></v-btn>
            <v-btn text="取消" @click="model = false" variant="plain"></v-btn>
          </v-container>
        </v-card>
      </v-window-item>
    </v-window>
  </v-dialog>
</template>

<style>
.svg-icon {
  margin-right: 0.5rem;
}
</style>

<style scoped>
.form > * {
  margin-bottom: 0.5rem;
}

.mb-1 {
  margin-bottom: 1rem !important;
}
</style>
