import axios, { AxiosInstance } from 'axios'
import { Category, Item, Student } from './model'
import { usePreferences } from './store'
import useSWR from 'swr'

export type UserType = 'student' | 'teacher'

// Both in Admin and User

export interface AuthRequest {
  account: string
  password: string
}

export interface AuthResponse {
  token: string
}

export interface UpdatePasswordRequest {
  old_password: string
  new_password: string
}

export interface SignOssResponse {
  upload_url: string
  download_url: string
  expire_seconds: number
}

export type GetStudentCategoriesResponse = Category[]

export type AddItemRequest = (Pick<Category, 'id'> & {
  items: Pick<Item, 'description' | 'duration_hour' | 'picture_urls'>[]
})[]

export type UpdateItemRequest = Pick<
  Item,
  'id' | 'description' | 'duration_hour' | 'picture_urls'
>[]

// Admin Only

export type GetManagedClassesResponse = {
  id: number
  name: string
}[]

export type GetStudentsInClassResponse = Student[]

export type UpdateCategoryRequest = Omit<Category, 'items'>

export type RejectStudentItemRequest = {
  item_id: number
  reason?: string
}

export class Http {
  axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      baseURL: 'http://47.103.210.124:8080/api',
    })
    this.axios.interceptors.request.use((config) => {
      if (config.url?.endsWith('/login')) {
        return config
      }

      const token = usePreferences.getState().token
      if (token) {
        config.headers!.Authorization = token
      }
      return config
    })
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout()
        }
        return Promise.reject(error)
      }
    )
  }

  async login(request: AuthRequest, userType: UserType): Promise<void> {
    // Global axios
    const {
      data: { token },
    } = await this.axios.post<AuthResponse>(
      `/v1/user/${userType}/login`,
      request
    )
    usePreferences.setState({ token })
  }

  logout() {
    usePreferences.setState({ token: undefined })
  }

  useGet<T>(url: string, query?: Record<string, string>) {
    return useSWR(
      [url, query ? `?${String(new URLSearchParams(query))}` : ''],
      async ([url, query]) => {
        const { data } = await this.axios.get<T>(url + query)
        return data
      }
    )
  }

  async updatePassword(
    request: UpdatePasswordRequest,
    userType: UserType
  ): Promise<void> {
    await this.axios.post(`/v1/user/${userType}/password`, request)
  }

  useStudent() {
    return this.useGet<Student>('/v1/student/info')
  }

  private async signFileUploadUrl(): Promise<SignOssResponse> {
    const { data } = await this.axios.get<SignOssResponse>(
      '/v1/labor/student/picture'
    )
    return data
  }

  async uploadFile(file: File): Promise<string> {
    const { upload_url, download_url } = await this.signFileUploadUrl()
    await axios.put(upload_url, file)
    return download_url
  }

  async getClasses(): Promise<GetManagedClassesResponse> {
    const { data } = await this.axios.get<GetManagedClassesResponse>(
      '/v1/admin/class'
    )
    return data
  }

  async getSudentsInClass(id: number): Promise<GetStudentsInClassResponse> {
    const { data } = await this.axios.get<GetStudentsInClassResponse>(
      `/v1/admin/class/${id}/student`
    )
    return data
  }

  useStudentCategories(student_id: number | string) {
    return this.useGet<GetStudentCategoriesResponse>(
      `/v1/labor/student/category`,
      {
        student_id: String(student_id),
      }
    )
  }

  useCategories() {
    return this.useGet<Category[]>('/v1/labor/student')
  }

  async updateItems(
    added: AddItemRequest,
    updated: UpdateItemRequest,
    deleted: number[]
  ) {
    const api = '/v1/labor/student'
    await this.axios.post(api, added)
    await this.axios.put(api, updated)
    await this.axios.post(api + '/delete', deleted)
  }
}

export const http = new Http()
