import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { type HeaderTeacher } from '@/model/studentModel'
import type { Grade, Major, Degree, Politics } from '@/model/otherModel'
import type { Status } from '@/model/statusModel'
import type { EnrollmentQuery } from '@/model/enrollmentModel'

export const useBaseStore = defineStore('base', () => {
    const enrollmentQuery = reactive<EnrollmentQuery>({
        search: '',
        familySearch: '',
        householdRegistration: null,
        householdType: null,
        isOnlyChild: null,
        schoolSearch: '',
        headerTeacherSearch: '',
        highSchoolSearch: '',
        candidateCategory: null,
        studentType: null,
        admissionBatch: null,
        gender: null,
        politicId: null,
        majorId: null,
        gradeId: null,
        degreeId: null,
        statusId: null,
        studentLoans: null,
        disability: false,
        religiousBeliefs: null,
        enabled: true,
        pageNo: 1,
        pageSize: 25,
    })
    const getQuery = () => {
        return enrollmentQuery
    }
    const updateQuery = <K extends keyof EnrollmentQuery>(key: K, value: EnrollmentQuery[K]) => {
        enrollmentQuery[key] = value
    }
    const headerTeacherList = reactive<HeaderTeacher[]>([])
    const gradeList = reactive<Grade[]>([])
    const majorList = reactive<Major[]>([])
    const degreeList = reactive<Degree[]>([])
    const politicList = reactive<Politics[]>([])
    const statusList = reactive<Status[]>([])
    const getGradeList = () => {
        return gradeList
    }
    const getMajorList = () => {
        return majorList
    }
    const getDegreeList = () => {
        return degreeList
    }
    const getPoliticList = () => {
        return politicList
    }
    const getHeaderTeacherList = () => {
        return headerTeacherList
    }
    const getStatusList = () => {
        return statusList
    }
    const updateGradeList = (grades: Grade[]) => {
        gradeList.length = 0
        gradeList.push(...grades)
    }
    const updateMajorList = (majors: Major[]) => {
        majorList.length = 0
        majorList.push(...majors)
    }
    const updateDegreeList = (degrees: Degree[]) => {
        degreeList.length = 0
        degreeList.push(...degrees)
    }
    const updatePoliticList = (politics: Politics[]) => {
        politicList.length = 0
        politicList.push(...politics)
    }
    const updateHeaderTeacherList = (headerTeachers: HeaderTeacher[]) => {
        headerTeacherList.length = 0
        headerTeacherList.push(...headerTeachers)
    }
    const updateStatusList = (statuses: Status[]) => {
        statusList.length = 0
        statusList.push(...statuses)
    }
    return {
        getQuery,
        updateQuery,
        getGradeList,
        getMajorList,
        getDegreeList,
        getPoliticList,
        getHeaderTeacherList,
        updateGradeList,
        updateMajorList,
        updateDegreeList,
        updatePoliticList,
        updateHeaderTeacherList,
        getStatusList,
        updateStatusList
    }
})

