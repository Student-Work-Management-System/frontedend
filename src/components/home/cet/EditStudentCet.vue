<script lang="ts" setup>
import { ref } from 'vue'
import { apiUpdateStudentCET, type UpdateStudentCetDTO } from '@/api/cet'
import { notify } from '@kyvg/vue3-notification'

const dialog = defineModel<boolean>()
const info = defineModel<UpdateStudentCetDTO>('info')
const emits = defineEmits(['onClosed'])
const loading = ref(false)
const form = ref(false)
const updateInfoLogic = async () => {
  loading.value = true
  const { data: result } = await apiUpdateStudentCET(info.value as UpdateStudentCetDTO)
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  notify({ type: 'success', title: '成功', text: 'CET 成绩修改成功！' })
  loading.value = false
  emits('onClosed')
}
</script>

<template>
  <v-dialog v-model="dialog" width="400">
    <v-card :loading="loading" width="auto" prepend-icon="mdi-pencil" title="修改信息">
      <v-container class="px-8">
        <v-form v-model="form" class="form">
          <v-text-field v-model="info!.score" label="分数" class="text-indigo" color="indigo" clearable required
            hide-details :rules="[() => !!info!.score || '该选项必填！']">
            <template v-slot:prepend>
              <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
            </template>
          </v-text-field>

          <CETYearSelect v-model="info!.examDate" color="indigo" class="text-indigo">
            <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
          </CETYearSelect>


          <v-text-field v-model="info!.certificateNumber" label="证书编号" class="text-indigo" color="indigo" clearable
            hide-details required :rules="[() => !!info!.certificateNumber || '该选项必填！']">
            <template v-slot:prepend>
              <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
            </template>
          </v-text-field>

          <v-select label="考试类别" v-model="info!.examType" :items="['CET4', 'CET6']" class="text-indigo" color="indigo"
            hide-details clearable>
            <template v-slot:prepend>
              <v-icon size="smaller" color="error" icon="mdi-asterisk"></v-icon>
            </template>
          </v-select>
        </v-form>
      </v-container>

      <v-divider></v-divider>

      <v-container class="w-100 d-flex justify-space-evenly">
        <v-btn :disabled="!form" text="修改" :loading="loading" color="indigo" variant="plain"
          @click="updateInfoLogic"></v-btn>
        <v-btn text="取消" variant="plain" @click="dialog = false"></v-btn>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<style scoped>
.form>* {
  margin-bottom: 0.5rem;
}
</style>
