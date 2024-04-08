import http from '.'
import { type Result } from '.'
import { type AxiosResponse } from 'axios'

export async function apiAddStudentBaseInfo(
  students: {
    studentId: string
    name: string
    idNumber: string
    gender: string
    nativePlace: string
    postalCode: string
    politicsStatus: string
    phone: string
    nation: string
    majorId: string
    grade: string
    classNo: string
  }[]
): Promise<AxiosResponse<Result<null>>> {
  return http.post('/student/adds', { students })
}
