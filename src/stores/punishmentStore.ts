import { reactive } from 'vue'
import { defineStore } from 'pinia'
import type { Punishment } from '@/model/punishmentModel'

export const usePunishmentStore = defineStore('punishment', () => {
    const punishments = reactive<Punishment[]>([])
    const getPunsihments = () => {
        return punishments
    }
    const setPunishments = (items: Punishment[]) => {
        punishments.length = 0
        punishments.push(...items)
    }
    return { getPunsihments, setPunishments }
})