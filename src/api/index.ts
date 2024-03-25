import axios from 'axios'

const http = axios.create({
  baseURL: '/api',
  timeout: 1000
})

export function setAuthorizationToken(token: string) {
  http.defaults.headers.common['Authorization'] = token
}

export interface Result<T> {
  code: number
  message: string
  data: T
}

export default http
