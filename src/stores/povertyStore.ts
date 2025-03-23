import type { PovertyAssistance } from '@/model/povertyModel'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const usePovertyStore = defineStore('poverty', () => {
    const povertyList = reactive<PovertyAssistance[]>([])
    const getPovertyList = () => {
        return povertyList
    }
    const setPovertyList = (list: PovertyAssistance[]) => {
        povertyList.length = 0
        povertyList.push(...list)
    }
    return {
        getPovertyList,
        setPovertyList
    }
})
