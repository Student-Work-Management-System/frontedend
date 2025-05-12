import http from '.'
import type { Result, RecordsPage } from '.'
import type { AxiosResponse } from 'axios'
import type {
    StudentPrecaution,
    StudentPrecautionItem,
    PrecautionQuery,
    PrecautionStatQuery,
    StudentPrecautionStatGroup,
} from '@/model/precautionModel'

export const levelOptions = [
    { value: '0', label: '红色' },
    { value: '1', label: '橙色' },
    { value: '2', label: '黄色' }
]

// 获取学业预警记录分页列表
export async function apiGetStudentPrecautionList(
    query: PrecautionQuery
): Promise<AxiosResponse<Result<RecordsPage<StudentPrecautionItem>>>> {
    return http.post('/precaution/gets', query)
}

// 新增单条学业预警记录
export async function apiAddStudentPrecaution(
    studentPrecaution: StudentPrecaution
): Promise<AxiosResponse<Result<null>>> {
    return http.post('/precaution/add', studentPrecaution)
}

// 批量新增学业预警记录
export async function apiAddStudentPrecautions(
    studentPrecautions: StudentPrecaution[]
): Promise<AxiosResponse<Result<null>>> {
    return http.post('/precaution/adds', studentPrecautions)
}

// 更新学业预警记录
export async function apiUpdateStudentPrecaution(
    studentPrecaution: StudentPrecaution
): Promise<AxiosResponse<Result<null>>> {
    return http.put('/precaution/update', studentPrecaution)
}

// 删除学业预警记录
export async function apiDeleteStudentPrecaution(
    studentPrecautionId: string
): Promise<AxiosResponse<Result<null>>> {
    return http.delete(`/precaution/delete/${studentPrecautionId}`)
}

export async function apiHandlePrecaution(
    studentPrecautionId: string
): Promise<AxiosResponse<Result<null>>> {
    return http.put(`/precaution/handle/${studentPrecautionId}`)
}

// 获取学业预警统计信息
export async function apiGetStudentPrecautionStat(
    query: PrecautionStatQuery
): Promise<AxiosResponse<Result<StudentPrecautionStatGroup[]>>> {
    return http.post('/precaution/stat', query)
}
