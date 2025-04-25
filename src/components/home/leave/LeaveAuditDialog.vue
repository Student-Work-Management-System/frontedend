<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import ItemSelect from '../ItemSelect.vue'
import type { AuditOperator } from '@/model'
import { apiCounselorAudit, apiLeaderAudit } from '@/api/leave'
import TrueOrFalseSelect from '../TrueOrFalseSelect.vue'
import { useUserStore } from '@/stores/userStore'

const model = defineModel<boolean>()
const isLeader = defineModel<boolean>('isLeader')
const totalDay = defineModel<number>('totalDay')
const auditId = defineModel<string>('auditId')
const emits = defineEmits(['onClosed'])
const loading = ref(false)
const userStore = useUserStore()
const operator = reactive<AuditOperator>({
  auditId: '',
  username: '',
  state: '通过',
  needNoticeStudent: false,
  needNoticeLeader: false
})

const auditStudentLeave = async () => {
  operator.auditId = auditId.value!!
  operator.username = userStore.getUserData.username
  if (isLeader.value) await auditStudentLeaveLeader()
  else await auditStudentLeaveCounselor()
}

const auditStudentLeaveCounselor = async () => {
  try {
    loading.value = true
    const { data: result } = await apiCounselorAudit(operator)
    if (result.code !== 200) {
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
    notify({ type: 'success', title: '成功', text: '成功' })
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
    model.value = false
    emits('onClosed')
  }
}

const auditStudentLeaveLeader = async () => {
  try {
    loading.value = true
    const { data: result } = await apiLeaderAudit(operator)
    if (result.code !== 200) {
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
    notify({ type: 'success', title: '成功', text: '成功' })
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
    model.value = false
    emits('onClosed')
  }
}
</script>

<template>
  <v-dialog width="auto" min-width="450" height="auto" v-model="model">
    <v-card width="auto" prepend-icon="mdi-content-save-edit-outline" title="请假审核">
      <v-container class="container">
        <ItemSelect v-model="operator.state" label="审核状态" :items="['通过', '拒绝']" />
        <TrueOrFalseSelect
          v-if="!isLeader && totalDay! > 7"
          v-model="operator.needNoticeLeader"
          label="通知领导审核"
          :items="[
            { key: '是', value: true },
            { key: '否', value: false }
          ]"
        />
        <TrueOrFalseSelect
          v-model="operator.needNoticeStudent"
          label="通知学生审核结果"
          :items="[
            { key: '是', value: true },
            { key: '否', value: false }
          ]"
        />
      </v-container>

      <v-divider></v-divider>

      <v-container class="w-100 d-flex justify-space-evenly">
        <v-btn
          :disabled="operator.state === null"
          text="确定"
          color="indigo"
          @click="auditStudentLeave"
          variant="plain"
        />
        <v-btn text="取消" @click="model = false" variant="plain" />
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
.container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
