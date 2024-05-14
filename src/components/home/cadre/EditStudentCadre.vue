<script lang="ts" setup>
import { apiUpdateStudentCadreInfo, apiGetCadreList, type StudentCadreRecord, type Cadre } from '@/api/cadre'
import { watchEffect } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { ref, onMounted } from 'vue'
import { reactive } from 'vue'


const model = defineModel<boolean>()
const emits = defineEmits(['onClosed'])
const form = ref(false)
const props = defineProps<{ info: StudentCadreRecord }>()
const loading = ref(false)
const cadres = ref<Cadre[]>([])
const studentCadreInfo = reactive({
  studentCadreId: '',
  studentId: '',
  cadreId: '',
  appointmentStartTerm: '',
  appointmentEndTerm: '',
  comment: ''
})
const sname = ref('')


const updateInfoLogic = async () => {
  loading.value = true
  const { data: result } = await apiUpdateStudentCadreInfo({
    ...studentCadreInfo
  })
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  loading.value = false
  notify({ type: 'success', title: '成功', text: '更新成功！' })
  emits('onClosed')
}
const itemProps = (cadre: Cadre) => {
  return {
    title: cadre.cadrePosition,
    value: cadre.cadreId,
    subtitle: cadre.cadreLevel
  }
}
const fetchCadreList = async () => {
  const { data: result } = await apiGetCadreList()
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  cadres.value = result.data
  selected.value = []
}

watchEffect(() => {
  studentCadreInfo.studentCadreId = props.info.studentCadreId
  studentCadreInfo.studentId = props.info.studentId
  studentCadreInfo.cadreId = props.info.cadreId
  studentCadreInfo.appointmentStartTerm = props.info.appointmentStartTerm
  studentCadreInfo.appointmentEndTerm = props.info.appointmentEndTerm
  studentCadreInfo.comment = props.info.comment
  sname.value = props.info.name
})

onMounted(() => {
  fetchCadreList()

})
</script>

<template>
  <v-dialog width="auto" min-width="500" height="auto" v-model="model">
    <v-window>
      <v-window-item :value="1">
        <v-card width="auto" prepend-icon="mdi-account-edit" :title="sname + '的任职信息'">
          <v-container>

            <v-form v-model="form" class="px-8 ">
              <v-text-field label="学号" v-model="studentCadreInfo.studentId" :counter="20" readonly
                :rules="[() => !!studentCadreInfo.studentId || '该选项必填！']">
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-text-field>

              <v-autocomplete label="职位" v-model="studentCadreInfo.cadreId" :items="cadres" :item-props="itemProps"
                item-value="value" item-title="cadrePosition" :rules="[() => !!studentCadreInfo.cadreId || '该选项必填！']">
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-autocomplete>

              <SemesterSelect class="mb-1" v-model="studentCadreInfo.appointmentStartTerm" label="任职开始学期"
                variant="filled">
                <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
              </SemesterSelect>





              <SemesterSelect class="mb-1" v-model="studentCadreInfo.appointmentEndTerm" label="任职结束学期" variant="filled">
                <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
              </SemesterSelect>


              <v-text-field label="备注" v-model="studentCadreInfo.comment" :counter="20" required>
                <template v-slot:prepend>
                  <v-icon size="smaller" icon="mdi-format-color-highlight"></v-icon>
                </template>
              </v-text-field>
            </v-form>
          </v-container>
          <v-divider></v-divider>
          <v-container class="w-100 d-flex justify-space-evenly">
            <v-btn :disabled="!form" text="确定" color="indigo" @click="updateInfoLogic" variant="plain"></v-btn>
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
.form>* {
  margin-bottom: 0.5rem;
}

.mb-1 {
  margin-bottom: 1rem !important;
}
</style>
