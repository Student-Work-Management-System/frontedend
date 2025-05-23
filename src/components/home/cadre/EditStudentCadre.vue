<script lang="ts" setup>
import { apiUpdateStudentCadre } from '@/api/cadre'
import type { StudentCadre, StudentCadreItem } from '@/model/cadreModel'
import { notify } from '@kyvg/vue3-notification'
import { ref, watchEffect } from 'vue'
import SemesterSelect from '@/components/home/SemesterSelect.vue'
import CadreSelect from '@/components/home/cadre/CadreSelect.vue'

const model = defineModel<boolean>()
const info = defineModel<StudentCadreItem>('info')
const localInfo = ref<StudentCadreItem>()
// 当弹窗打开时，创建副本
watchEffect(() => {
  if (model.value && info.value) {
    localInfo.value = { ...info.value }
  }
})
const emits = defineEmits(['onClosed'])
const form = ref(false)
const loading = ref(false)

const onCancel = () => {
  model.value = false
}

const updateInfoLogic = async () => {
  loading.value = true
  const { data: result } = await apiUpdateStudentCadre(localInfo.value as StudentCadre)
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  loading.value = false
  notify({ type: 'success', title: '成功', text: '更新成功！' })
  emits('onClosed')
}
</script>

<template>
  <v-dialog width="auto" min-width="500" height="auto" v-model="model">
    <v-card width="auto" prepend-icon="mdi-account-edit" :title="localInfo!.name + '的任职信息'">
      <v-container>
        <v-form v-model="form" class="px-8">
          <CadreSelect
            class="mb-1"
            v-model="localInfo!.cadreId"
            variant="filled"
            density="comfortable"
          >
            <v-icon size="smaller" color="error" icon="mdi-asterisk" />
          </CadreSelect>

          <SemesterSelect
            class="mb-1"
            v-model="localInfo!.appointmentStartTerm"
            label="任职开始学期"
            variant="filled"
            density="comfortable"
          >
            <v-icon size="smaller" color="error" icon="mdi-asterisk" />
          </SemesterSelect>

          <SemesterSelect
            class="mb-1"
            v-model="localInfo!.appointmentEndTerm"
            label="任职结束学期"
            variant="filled"
            density="comfortable"
          >
            <v-icon size="smaller" color="error" icon="mdi-asterisk" />
          </SemesterSelect>

          <v-text-field
            class="text-indigo"
            color="indigo"
            label="备注"
            v-model="localInfo!.comment"
            required
          >
            <template v-slot:prepend>
              <v-icon size="smaller" icon="mdi-format-color-highlight" />
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
          @click="updateInfoLogic"
          variant="plain"
        />
        <v-btn text="取消" @click="onCancel" variant="plain" />
      </v-container>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.svg-icon {
  margin-right: 0.5rem;
}
.form > * {
  margin-bottom: 0.5rem;
}

.mb-1 {
  margin-bottom: 1rem !important;
}
</style>
