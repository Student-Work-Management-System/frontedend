import { reactive } from 'vue'
import { defineStore } from 'pinia'
import type { Scholarship } from '@/model/scholarshipModel'

export const useScholarshipStore = defineStore('scholarship', () => {
    const scholarshipList = reactive<Scholarship[]>([])
    const getScholarshipList = () => {
        return scholarshipList
    }
    const setScholarshipList = (list: Scholarship[]) => {
        scholarshipList.length = 0
        scholarshipList.push(...list)
    }
    return {
        getScholarshipList,
        setScholarshipList
    }
})