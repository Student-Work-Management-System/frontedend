<script lang="ts" setup>
import { apiAddCounselor, apiGetAllGrades, apiGetOptional } from '@/api/other'
import type { CounselorRequest, UserWithCounselorRole } from '@/model/otherModel'
import { useBaseStore } from '@/stores/baseStore'
import { notify } from '@kyvg/vue3-notification'
import { computed, onMounted, ref } from 'vue'
import { reactive } from 'vue'

const baseStore = useBaseStore()
const items = baseStore.getGradeList()
const emits = defineEmits(['onClosed'])
const form = ref(false)
const loading = ref(false)
const model = defineModel<boolean>()
const rawOptionalUser = ref<UserWithCounselorRole[]>([])
const optionalUser = computed(() => {
  return rawOptionalUser.value.map((it) => ({
    uid: it.uid,
    title: `${it.realName}(${it.username})`
  }))
})
const newCounselor = reactive<CounselorRequest>({
  uid: '',
  chargeGrade: []
})

const AddCounselorLogic = async () => {
  try {
    loading.value = true
    const { data: result } = await apiAddCounselor(newCounselor)
    if (result.code !== 200) {
      console.error(result)
      notify({ type: 'error', title: '错误', text: result.message })
      loading.value = false
      return
    }
    notify({ type: 'success', title: '成功', text: '添加成功！' })
    emits('onClosed')
    clearCounselorInfo()
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

const clearCounselorInfo = () => {
  newCounselor.uid = ''
  newCounselor.chargeGrade = []
}

onMounted(async () => {
  const { data: result } = await apiGetOptional()
  if (result.code !== 200) {
    console.log(result.message)
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  rawOptionalUser.value = result.data
  if (baseStore.getGradeList().length <= 0) {
    const { data: gradeResult } = await apiGetAllGrades()
    if (gradeResult.code !== 200) {
      console.log(gradeResult.message)
      notify({ type: 'error', title: '错误', text: gradeResult.message })
      return
    }
    baseStore.updateGradeList(gradeResult.data)
  }
})
</script>

<template>
  <v-dialog width="auto" min-width="500" height="auto" v-model="model">
    <v-window>
      <v-window-item :value="1">
        <v-card width="auto" prepend-icon="mdi-vector-arrange-below" title="辅导员工作安排">
          <v-container>
            <v-form v-model="form" class="px-8 form">
              <v-select
                v-model="newCounselor.uid"
                label="可选教师"
                class="text-indigo"
                color="indigo"
                :items="optionalUser"
                item-title="title"
                item-value="uid"
                :rules="[(v) => v.length > 0 || '至少选择一名教师']"
                required
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                </template>
              </v-select>
              <v-select
                v-model="newCounselor.chargeGrade"
                label="负责年级"
                class="text-indigo"
                color="indigo"
                :items="items"
                item-title="gradeName"
                item-value="gradeId"
                multiple
                chips
                :rules="[(v) => v.length > 0 || '请至少选择一个年级']"
                required
              >
                <template v-slot:prepend>
                  <v-icon size="smaller" color="error" icon="mdi-asterisk" />
                </template>
              </v-select>
            </v-form>
          </v-container>
          <v-divider></v-divider>
          <v-container class="w-100 d-flex justify-space-evenly">
            <v-btn
              :disabled="!form"
              text="确定"
              color="indigo"
              @click="AddCounselorLogic"
              variant="plain"
            />
            <v-btn text="取消" @click="model = false" variant="plain" />
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
</style>
