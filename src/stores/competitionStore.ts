import type { Competition } from '@/model/competitionModel'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useCompetitionStore = defineStore('competition', () => {
    const competitionList = reactive<Competition[]>([])

    const getCompetitionList = () => {
        return competitionList
    }

    const setCompetitionList = (competitions: Competition[]) => {
        competitionList.length = 0
        competitionList.push(...competitions)
    }

    const checkCompetitionIsSolo = (competitionId: string) => {
        return (
            competitionList
                .find((competition) => competition.competitionId === competitionId)
                ?.competitionNature === '单人'
        )
    }

    return { getCompetitionList, setCompetitionList, checkCompetitionIsSolo }
})
