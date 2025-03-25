import { reactive } from 'vue';
import { defineStore } from 'pinia'
import type { Language } from '@/model/foreignModel';

export const useForeignStore = defineStore('foreign', () => {
    const languageList = reactive<Language[]>([])
    const getLanguageList = () => {
        return languageList
    }
    const setLanguageList = (languages: Language[]) => {
        languageList.length = 0
        languageList.push(...languages)
    }
    return {
        getLanguageList,
        setLanguageList
    }
})
