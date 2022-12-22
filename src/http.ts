import axios, { AxiosInstance } from 'axios'
import { Category, Student } from './model'
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
      baseURL: '/api',
    })
    this.axios.interceptors.request.use((config) => {
      const token = usePreferences.getState().token
      if (token) {
        config.headers!.Authorization = `Bearer ${token}`
      }
      return config
    })
  }

  async login(request: AuthRequest, userType: UserType): Promise<void> {
    // Global axios
    const {
      data: { token },
    } = await axios.post<AuthResponse>(`/v1/user/${userType}/login`, request)
    usePreferences.setState({ token })
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

  async signFileUploadUrl(): Promise<SignOssResponse> {
    const { data } = await this.axios.get<SignOssResponse>(
      '/v1/labor/student/picture'
    )
    return data
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
}

export const http = new Http()
