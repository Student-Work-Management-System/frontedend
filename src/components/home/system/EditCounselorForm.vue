<script lang="ts" setup>
import { type CounselorItem, type CounselorRequest } from '@/model/otherModel'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { apiUpdateCounselor, apiGetAllGrades } from '@/api/other'
import { useBaseStore } from '@/stores/baseStore'

const emits = defineEmits(['onClosed'])
const model = defineModel<boolean>()
const info = defineModel<CounselorItem>('info')
const localInfo = ref<CounselorItem>()
watchEffect(() => {
  if (model.value && info.value) {
    localInfo.value = { ...info.value }
  }
})
const form = ref<boolean>(false)
const loading = ref(false)
const baseStore = useBaseStore()

const gradeMap = computed(() =>
  baseStore.getGradeList().reduce((gradeMap, grade) => {
    gradeMap.set(grade.gradeName, grade.gradeId)
    return gradeMap
  }, new Map())
)

const gradeList = computed(() => baseStore.getGradeList())

const title = computed(
  () => `${localInfo.value?.counselorName}(${localInfo.value?.counselorUsername})信息`
)

const updateInfoLogic = async () => {
  loading.value = true
  try {
    const request = createCounselorRequest(localInfo.value as CounselorItem)
    const { data: result } = await apiUpdateCounselor(request)
    if (result.code !== 200) {
      notify({ type: 'error', title: '错误', text: result.message })
      loading.value = false
      return
    }
    notify({ type: 'success', title: '成功', text: '辅导员信息修改成功！' })
    loading.value = false
    model.value = false
    emits('onClosed')
  } catch (error) {
    console.error(error)
    loading.value = false
  }
}

const createCounselorRequest = (item: CounselorItem): CounselorRequest => {
  return {
    uid: item.uid,
    chargeGrade: item.chargeGrade.map((grade) => gradeMap.value.get(grade) ?? '')
  }
}

onMounted(async () => {
  if (baseStore.getGradeList().length <= 0) {
    const { data: result } = await apiGetAllGrades()
    if (result.code !== 200) {
      console.log(result.message)
      notify({ type: 'error', title: '错误', text: result.message })
    }
    baseStore.updateGradeList(result.data)
  }
})
</script>

<template>
  <v-dialog width="auto" min-width="500" height="auto" v-model="model">
    <v-window>
      <v-window-item :value="1">
        <v-card width="auto" prepend-icon="mdi-content-save-edit-outline" :title="title">
          <v-container>
            <v-form v-model="form" class="px-8 form">
              <v-select
                v-model="localInfo!.chargeGrade"
                label="负责年级"
                class="text-indigo mb-4"
                color="indigo"
                :items="gradeList"
                item-title="gradeName"
                item-value="gradeName"
                multiple
                chips
                :rules="[(v) => v.length > 0 || '请至少选择一个年级']"
                required
              />
            </v-form>
          </v-container>
          <v-divider></v-divider>
          <v-container class="w-100 d-flex justify-space-evenly">
            <v-btn
              :disabled="!form || loading"
              text="确定"
              color="indigo"
              @click="updateInfoLogic"
              variant="plain"
            />
            <v-btn text="取消" @click="model = false" variant="plain" />
          </v-container>
        </v-card>
      </v-window-item>
    </v-window>
  </v-dialog>
</template>
