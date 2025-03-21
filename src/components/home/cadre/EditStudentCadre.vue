<script lang="ts" setup>
import { apiUpdateStudentCadre } from '@/api/cadre'
import type { Cadre, StudentCadreItem } from '@/model/cadreModel'
import { notify } from '@kyvg/vue3-notification'
import { computed, ref } from 'vue'
import { useCadreStore } from '@/stores/cadreStore'
import SemesterSelect from '@/components/home/SemesterSelect.vue'

const model = defineModel<boolean>()
const info = defineModel<StudentCadreItem>('info')
const modifyInfo = computed(() => {
  return {
    studentCadreId: info.value!.studentCadreId,
    studentId: info.value!.studentId,
    cadreId: info.value!.cadreId,
    appointmentStartTerm: info.value!.appointmentStartTerm,
    appointmentEndTerm: info.value!.appointmentEndTerm,
    comment: info.value!.comment
  }
})
const cadreStore = useCadreStore()
const emits = defineEmits(['onClosed'])
const form = ref(false)
const loading = ref(false)
const cadreList = cadreStore.getCadreList()

const updateInfoLogic = async () => {
  loading.value = true
  const { data: result } = await apiUpdateStudentCadre(modifyInfo.value)
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
    cadreId: cadre.cadreId,
    subtitle: `${cadre.cadreLevel} - ${cadre.cadreBelong}`
  }
}
</script>

<template>
  <v-dialog width="auto" min-width="500" height="auto" v-model="model">
    <v-card width="auto" prepend-icon="mdi-account-edit" :title="info!.name + '的任职信息'">
      <v-container>
        <v-form v-model="form" class="px-8">
          <v-autocomplete
            label="职位"
            v-model="modifyInfo!.cadreId"
            :items="cadreList"
            :item-props="itemProps"
            item-value="cadreId"
            item-title="cadrePosition"
            :rules="[
              () =>
                (modifyInfo.cadreId !== undefined &&
                  modifyInfo.cadreId !== null &&
                  modifyInfo.cadreId !== '') ||
                '该选项必填！'
            ]"
          >
            <template v-slot:prepend>
              <v-icon size="smaller" color="error" icon="mdi-asterisk" />
            </template>
          </v-autocomplete>

          <SemesterSelect
            class="mb-1"
            v-model="modifyInfo!.appointmentStartTerm"
            label="任职开始学期"
            variant="filled"
          >
            <v-icon size="smaller" color="error" icon="mdi-asterisk" />
          </SemesterSelect>

          <SemesterSelect
            class="mb-1"
            v-model="modifyInfo!.appointmentEndTerm"
            label="任职结束学期"
            variant="filled"
          >
            <v-icon size="smaller" color="error" icon="mdi-asterisk" />
          </SemesterSelect>

          <v-text-field label="备注" v-model="modifyInfo!.comment" :counter="20" required>
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
        <v-btn text="取消" @click="model = false" variant="plain" />
      </v-container>
    </v-card>
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
