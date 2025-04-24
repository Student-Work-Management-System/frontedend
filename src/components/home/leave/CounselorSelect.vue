<script setup lang="ts">
import { apiGetOptionalCounselors } from '@/api/other'
import { notify } from '@kyvg/vue3-notification'
import { apiGetOwnEnrollment } from '@/api/student'
import { useLeaveStore } from '@/stores/leaveStore'
import { useEnrollmentStore } from '@/stores/studentStore'
import { useUserStore } from '@/stores/userStore'
import { onMounted, ref } from 'vue'
import type { UserWithCounselorRole } from '@/model'

const counselorId = defineModel<string>('counselorId')
const props = defineProps<{
  variant?:
    | 'filled'
    | 'underlined'
    | 'outlined'
    | 'plain'
    | 'solo'
    | 'solo-inverted'
    | 'solo-filled'
    | undefined
  density?: 'compact' | 'default' | 'comfortable' | undefined
}>()
const loading = ref<boolean>(false)
const leaveStore = useLeaveStore()
const enrollmentStore = useEnrollmentStore()
const userStore = useUserStore()
const optionalItems = ref<UserWithCounselorRole[]>([])

const getOptionalCounselor = async () => {
  try {
    loading.value = true
    const { data: result } = await apiGetOptionalCounselors(enrollmentStore.getInfo().gradeId)
    if (result.code !== 200) {
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
    optionalItems.value = result.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (enrollmentStore.getInfo().enrollmentId === '') {
    const { data: enrollmentResult } = await apiGetOwnEnrollment(userStore.getUserData.username)
    if (enrollmentResult.code !== 200) {
      notify({ type: 'error', title: '错误', text: enrollmentResult.message })
      return
    }
    enrollmentStore.setInfo(enrollmentResult.data)
  }
  if (leaveStore.getOptional().length === 0) {
    getOptionalCounselor()
    leaveStore.setOptional(optionalItems.value)
  }
})
</script>

<template>
  <v-select
    v-model="counselorId"
    :items="optionalItems"
    item-title="realName"
    item-value="username"
    class="text-indigo"
    color="indigo"
    label="指派辅导员"
    :variant="props.variant"
    :density="props.density"
    clearable
    hide-details
  >
    <template v-slot:prepend>
      <slot></slot>
    </template>
  </v-select>
</template>
