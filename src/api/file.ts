import http from '.'
import type { Result } from '.'
import { type AxiosResponse } from 'axios'

export async function apiUploadFile(from: "competition" | "academic", file: File): Promise<AxiosResponse<Result<string>>> {
  let formData = new FormData()
  formData.append('file', file)
  return http.post(`/file/upload/${from}`, formData)
}

export async function apiDownloadFile(filename: string): Promise<AxiosResponse<Blob>> {
  return http.get(`/file/download/${filename}`, { responseType: 'blob' })
}
