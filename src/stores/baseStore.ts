import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { type StudentQuery } from '@/model/studentModel'

export const useBaseStore = defineStore('base', () => {
    const studentQuery = reactive<StudentQuery>({
        search: '' as string,
        gradeId: null as string | null,
        majorId: null as string | null,
        degreeId: null as string | null,
        statusId: '1' as string | null,
        gender: null as string | null,
        nation: null as string | null,
        politicId: null as string | null,
        classNo: null as string | null,
        dormitory: null as string | null,
        householdRegistration: null as string | null,
        householdType: null as string | null,
        address: null as string | null,
        examId: null as string | null,
        admissionBatch: null as string | null,
        nativePlace: null as string | null,
        highSchool: null as string | null,
        totalExamScore: null as string | null,
        foreignLanguage: null as string | null,
        foreignScore: null as string | null,
        hobbies: null as string | null,
        joiningTime: null as string | null,
        isStudentLoans: null as boolean | null,
        religiousBeliefs: null as string | null,
        location: null as string | null,
        familyPopulation: null as string | null,
        isOnlyChild: null as boolean | null,
        disability: false as boolean,
        otherNotes: null as string | null,
        enabled: true as boolean,
        pageNo: 1 as number,
        pageSize: 25 as number
    })
    const getStudentQuery = studentQuery
    const updateStudentQuery = <K extends keyof StudentQuery>(key: K, value: StudentQuery[K]) => {
        studentQuery[key] = value
    }
    return { getStudentQuery, updateStudentQuery }
})

