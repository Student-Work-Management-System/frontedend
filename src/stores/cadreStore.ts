import { defineStore } from 'pinia'
import type { Cadre } from '@/model/cadreModel'
import { reactive } from 'vue'
export const useCadreStore = defineStore('cadre', () => {
    const cadreList = reactive<Cadre[]>([])
    const getCadreList = () => {
        return cadreList
    }
    const setCadreList = (cadres: Cadre[]) => {
        cadreList.length = 0
        cadreList.push(...cadres)
    }
    return { getCadreList, setCadreList }
})
