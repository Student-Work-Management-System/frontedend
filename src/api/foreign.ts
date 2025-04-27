import http from '.'
import type { Result, RecordsPage } from '.'
import { type AxiosResponse } from 'axios'
import type { Language, ForeignLanguage, ForeignLanguageItem, ForeignLanguageQuery, ForeignLanguageStatQuery, ForeignLanguageStatGrouped } from '@/model/foreignModel'

export async function apiGetLanguages(): Promise<AxiosResponse<Result<Language[]>>> {
    return http.get('/language/gets')
}

export async function apiAddLanguage(language: Language): Promise<AxiosResponse<Result<null>>> {
    return http.post('/language/add', language)
}

export async function apiUpdateLanguage(language: Language): Promise<AxiosResponse<Result<null>>> {
    return http.put('/language/update', language)
}

export async function apiDeleteLanguage(languageId: string): Promise<AxiosResponse<Result<null>>> {
    return http.delete(`/language/delete/${languageId}`)
}

export async function apiGetForeignLanguages(query: ForeignLanguageQuery): Promise<AxiosResponse<Result<RecordsPage<ForeignLanguageItem>>>> {
    return http.post('/language/student/gets', query)
}

export async function apiAddForeignLanguage(foreignLanguages: ForeignLanguage[]): Promise<AxiosResponse<Result<null>>> {
    return http.post('/language/student/add', foreignLanguages)
}

export async function apiUpdateForeignLanguage(foreignLanguage: ForeignLanguage): Promise<AxiosResponse<Result<null>>> {
    return http.put('/language/student/update', foreignLanguage)
}

export async function apiDeleteForeignLanguage(foreignLanguageId: string): Promise<AxiosResponse<Result<null>>> {
    return http.delete(`/language/student/delete/${foreignLanguageId}`)
}

export async function apiGetForeignLanguageStat(query: ForeignLanguageStatQuery): Promise<AxiosResponse<Result<ForeignLanguageStatGrouped[]>>> {
    return http.post("/language/student/stat", query)
}















