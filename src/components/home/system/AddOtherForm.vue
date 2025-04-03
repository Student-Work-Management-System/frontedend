<script lang="ts" setup>
import type { Result } from '@/api'
import { apiAddGrade, apiAddDegree } from '@/api/other'
import type { Degree, Grade } from '@/model/otherModel'
import { notify } from '@kyvg/vue3-notification'
import type { AxiosResponse } from 'axios'
import { ref } from 'vue'
import { computed } from 'vue'
const dialog = defineModel<boolean>()
const type = defineModel<'grade' | 'degree' | null>('type')
const emits = defineEmits(['onClosed'])
const info = ref({
  name: ''
})
const tip = computed(() =>
  (type.value as string) === 'grade'
    ? '输入年级(例: 2021-本科生(研究生/博士生))'
    : '输入学历层次(例: 本科)'
)
const loading = ref(false)
const title = computed(() => ((type.value as string) === 'grade' ? '添加年级' : '添加学历层次'))
const submitHandler = computed(() =>
  (type.value as string) === 'grade' ? addGradeLogic : addDegreeLogic
)

const addDegreeLogic = async () => {
  const degree: Degree = {
    degreeName: info.value.name
  }
  await addLogic<Degree>(degree, apiAddDegree)
}

const addGradeLogic = async () => {
  const grade: Grade = {
    gradeName: info.value.name
  }
  await addLogic<Grade>(grade, apiAddGrade)
}

const addLogic = async <T extends { [key: string]: any }>(
  obj: T,
  api: (obj: T) => Promise<AxiosResponse<Result<void>>>
) => {
  try {
    const { data: result } = await api(obj)
    if (result.code !== 200) {
      console.log(result.message)
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
    notify({ type: 'success', title: '成功', text: '添加成功' })
  } catch (error) {
    console.log(error)
  } finally {
    emits('onClosed')
    clearInput()
  }
}

const clearInput = () => {
  info.value.name = ''
}
</script>

<template>
  <v-dialog v-model="dialog" width="500">
    <v-card :title="title">
      <v-container class="px-8 text-indigo">
        <v-text-field label="名称" color="indigo" v-model="info!.name" clearable>
          <v-tooltip activator="parent" location="top" :text="tip" />
        </v-text-field>
      </v-container>

      <v-divider></v-divider>
      <v-container class="w-100 d-flex justify-space-evenly">
        <v-btn
          :disabled="info?.name === undefined || info?.name.length <= 0"
          text="提交"
          :loading="loading"
          color="indigo"
          variant="plain"
          @click="submitHandler()"
        />
        <v-btn text="取消" variant="plain" @click="dialog = false" />
      </v-container>
    </v-card>
  </v-dialog>
</template>
