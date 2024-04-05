import axios from 'axios'

const http = axios.create({
  baseURL: '/api',
  timeout: 1000
})

http.interceptors.response.use(
  (res) => {
    if (res.data.code === -201) {
      console.error('用户权限不足：', res)
      localStorage.clear()
      setAuthorizationToken('')
      location.reload()
    } else if (res.data.code === -210) {
      console.error('用户token过期：', res)
      localStorage.clear()
      setAuthorizationToken('')
      location.reload()
    }

    return res
  },
  (error) => {
    if (error) {
      // 请求配置发生的错误
      if (!error.response) {
        return console.log('Error', error.message)
      }

      // 获取状态码
      const status = error.response.status

      // 错误状态处理
      if (status === 401) {
        location.reload()
      } else if (status === 403) {
        location.reload()
      } else if (status >= 404 && status < 422) {
        location.reload()
      }
    }
    return Promise.reject(error)
  }
)

export function setAuthorizationToken(token: string) {
  http.defaults.headers.common['Authorization'] = token
}

export interface Result<T> {
  code: number
  message: string
  data: T
}

export interface RecordsPage<T> {
  records: T[]
  pageNumber: number
  pageSize: number
  totalPage: number
  totalRow: number
}

export default http
