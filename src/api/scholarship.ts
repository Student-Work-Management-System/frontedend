import type { AxiosResponse } from "axios";
import type { Result, RecordsPage } from ".";
import type { Scholarship, StudentScholarship, StudentScholarshipItem, ScholarshipQuery } from "@/model/scholarshipModel"
import http from ".";

export const scholarshipLevels = ["院级", "校级", "区级", "省级", "国家级"]

export async function apiGetScholarships(): Promise<AxiosResponse<Result<Scholarship[]>>> {
    return http.get("/scholarship/gets")
}

export async function apiAddScholarships(scholarship: Scholarship): Promise<AxiosResponse<Result<void>>> {
    return http.post("/scholarship/add", scholarship)
}

export async function apiUpdateScholarships(scholarship: Scholarship): Promise<AxiosResponse<Result<void>>> {
    return http.put("/scholarship/update", scholarship)
}

export async function apiDeleteScholarships(scholarshipId: string): Promise<AxiosResponse<Result<void>>> {
    return http.delete(`/scholarship/delete/${scholarshipId}`)
}


export async function apiGetStudentScholarships(query: ScholarshipQuery): Promise<AxiosResponse<Result<RecordsPage<StudentScholarshipItem>>>> {
    return http.post("/scholarship/student/gets", query)
}

export async function apiAddStudentScholarships(studentScholarship: StudentScholarship[]): Promise<AxiosResponse<Result<void>>> {
    return http.post("/scholarship/student/add", studentScholarship)
}

export async function apiUpdateStudentScholarships(studentScholarship: StudentScholarship): Promise<AxiosResponse<Result<void>>> {
    return http.put("/scholarship/student/update", studentScholarship)
}

export async function apiDeleteStudentScholarships(studentScholarshipId: string): Promise<AxiosResponse<Result<void>>> {
    return http.put("/scholarship/student/delete", studentScholarshipId)
}