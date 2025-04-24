import { reactive } from 'vue'
import { defineStore } from 'pinia'
import type { UserWithCounselorRole } from '@/model'

export const useLeaveStore = defineStore('leave', () => {
    const optionalCounselor = reactive<UserWithCounselorRole[]>([])
    const getOptional = () => {
        return optionalCounselor
    }
    const setOptional = (list: UserWithCounselorRole[]) => {
        optionalCounselor.length = 0
        optionalCounselor.push(...list)
    }
    return {
        getOptional, setOptional
    }
})