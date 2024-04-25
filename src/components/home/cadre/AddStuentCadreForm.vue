<script lang="ts" setup>
import { apiAddStudentCadre, apiGetCadreList, type Cadre } from '@/api/cadre'
import SemesterSelect from '@/components/home/cadre/SemesterSelect.vue'
import { notify } from '@kyvg/vue3-notification'
import { ref } from 'vue'
import { reactive } from 'vue'
import { onMounted } from 'vue'

const model = defineModel<boolean>()
const emits = defineEmits(['onClosed'])
const form = ref(false)
const cadres = ref<Cadre[]>([])
const loading = ref(false)

const newStudentCadre = reactive({
  studentId: '',
  cadreId: '',
  appointmentStartTerm: '',
  appointmentEndTerm: '',
  comment: ''
})
const fetchCadreList = async () => {
  const { data: result } = await apiGetCadreList()
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  cadres.value = result.data
}
const AddStudentCadreLogic = async () => {
  loading.value = true
  const { data: result } = await apiAddStudentCadre(newStudentCadre)
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  notify({ type: 'success', title: '成功', text: '添加成功！' })
  emits('onClosed')
  ClearStudentCadreInfo()
  loading.value = false
}

const ClearStudentCadreInfo = () => {
  newStudentCadre.studentId = ''
  newStudentCadre.cadreId = ''
  newStudentCadre.comment = ''
  newStudentCadre.appointmentStartTerm = ''
  newStudentCadre.appointmentEndTerm = ''
}

const itemProps = (cadre: Cadre) => {
  return {
    title: cadre.cadrePosition,
    value: cadre.cadreId,
    subtitle: cadre.cadreLevel
  }
}

onMounted(() => {
  fetchCadreList()
})
</script>

<template>
  <v-dialog width="auto" min-width="500" height="auto" v-model="model">
    <v-window>
      <v-window-item :value="1">
        <v-card width="auto" prepend-icon="mdi-account-box-plus-outline" title="任职信息">
          <v-container>
            <v-form v-model="form" class="px-8 ">
              <v-text-field
                label="学号"
                v-model="newStudentCadre.studentId"
                :counter="20"
                required
                :rules="[() => !!newStudentCadre.studentId || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-text-field>

              <v-autocomplete
                label="职位"
                v-model="newStudentCadre.cadreId"
                :items="cadres"
                :item-props="itemProps"
                item-value="value"
                item-title="cadrePosition"
                :rules="[() => !!newStudentCadre.cadreId || '该选项必填！']"
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </template>
              </v-autocomplete>

        
              
          
              <SemesterSelect
                class="mb-1"
                  v-model="newStudentCadre.appointmentStartTerm"
                  label="任职开始学期"
                  variant="filled"
                
                >
                <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </SemesterSelect>
          

          
   
      
              <SemesterSelect
              class="mb-1"
                  v-model="newStudentCadre.appointmentEndTerm"
                  label="任职结束学期"
                 
                  variant="filled"
                >
                <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
                </SemesterSelect>
          
     

              <v-text-field label="备注" v-model="newStudentCadre.comment" :counter="20" required>
                <template v-slot:prepend>
                  <v-icon size="smaller" icon="mdi-pencil"></v-icon>
                </template>
              </v-text-field>
            </v-form>
          </v-container>
          <v-divider></v-divider>
          <v-container class="w-100 d-flex justify-space-evenly">
            <v-btn
              :disabled="!form"
              text="确定"
              color="indigo"
              @click="AddStudentCadreLogic"
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

.mb-1 {
  margin-bottom: 1rem !important;
}
</style>
