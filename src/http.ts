import axios, { AxiosError, AxiosInstance } from 'axios'
import { Teacher, Category, Class, Item, Student, StudentState } from './model'
import { usePreferences } from './store'
import useSWR from 'swr'
import { toast } from 'react-toastify'
import imageCompression from 'browser-image-compression'

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

export type AddItemRequest = (Pick<Category, 'id'> & {
  items: (Pick<Item, 'description' | 'picture_urls'> & {
    duration_hour: number
  })[]
})[]

export type UpdateItemRequest = (Pick<
  Item,
  'id' | 'description' | 'picture_urls'
> & {
  duration_hour: number
})[]

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

export type ApiError = AxiosError<{
  code: number
  type: string
}>

export type TeacherInfoResponse = Teacher & {
  classes: Class[]
}

export type TeacherClassesResponse = (Teacher & {
  classes: Class[]
})[]

export class Http {
  axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      baseURL: '/api',
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
    const {
      data: { token },
    } = await this.axios.post<AuthResponse>(
      `/v1/user/${userType}/login`,
      request
    )
    usePreferences.getState().login(token, userType)
  }

  logout() {
    usePreferences.getState().logout()
  }

  useGet<T>(url: string, query?: Record<string, string | undefined>) {
    const filteredQuery =
      query &&
      (Object.fromEntries(
        Object.entries(query).filter(([, value]) => value !== undefined)
      ) as Record<string, string>)

    return useSWR(
      url +
        (filteredQuery ? `?${String(new URLSearchParams(filteredQuery))}` : ''),
      async (url) => {
        const { data } = await this.axios.get<T>(url)
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

  useStudentSelf() {
    return this.useGet<Student>('/v1/student/info')
  }

  private async signFileUploadUrl(): Promise<SignOssResponse> {
    const { data } = await this.axios.get<SignOssResponse>(
      '/v1/labor/student/picture'
    )
    return data
  }

  async uploadImage(file: File): Promise<string> {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    })
    const { upload_url, download_url } = await this.signFileUploadUrl()
    await axios.put(upload_url, compressedFile, {
      headers: {
        'Content-Type': '', // Empty string to remove default header to satisfy OSS
      },
    })
    return download_url
  }

  useStudentCategories(studentId: string) {
    return this.useGet<Category[]>(`/v1/labor/teacher`, {
      student_id: studentId,
    })
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
    added.length && (await this.axios.post(api, added))
    updated.length && (await this.axios.put(api, updated))
    deleted.length && (await this.axios.post(api + '/delete', deleted))
  }

  useTeacherInfo() {
    return this.useGet<TeacherInfoResponse>('/v1/teacher/info/self')
  }

  useClasses(schoolYear?: string) {
    return this.useGet<Class[]>('/v1/teacher/class', {
      'school-year': schoolYear,
    })
  }

  useClassStudents(classId: number) {
    return this.useGet<
      (Student & {
        state: StudentState
      })[]
    >(`/v1/teacher/student`, {
      class_id: String(classId),
    })
  }

  async rejectItem(id: number, rejectedReason: string) {
    await this.axios.post('/v1/labor/teacher/reject', {
      id,
      reject_reason: rejectedReason,
    })
  }

  async passItem(id: number) {
    await this.axios.post('/v1/labor/teacher/pass', [id])
  }

  async setItemPending(id: number) {
    await this.axios.post(
      '/v1/labor/teacher/rollback?' +
        String(new URLSearchParams({ id: String(id) }))
    )
  }

  useTeachers(schoolYear?: string) {
    return this.useGet<TeacherClassesResponse>('/v1/teacher/class2teacher', {
      'school-year': schoolYear,
    })
  }

  async addTeacherClassRelation(teacherId: number, classId: number) {
    await this.axios.post('/v1/teacher/class2teacher', {
      teacher_id: teacherId,
      class_id: classId,
    })
  }

  async deleteTeacherClassRelation(teacherId: number, classId: number) {
    await this.axios.post('/v1/teacher/class2teacher/delete', {
      teacher_info_id: teacherId,
      class_info_id: classId,
    })
  }

  toast<T>(promise: Promise<T> | (() => Promise<T>), text = '提交') {
    toast.promise(promise, {
      pending: '正在' + text + '…',
      success: text + '成功',
      error: {
        render: ({ data }) => {
          if (data instanceof AxiosError && data.response) {
            return text + '错误：' + (data.response.data.type || data.message)
          }
          if (data instanceof Error) {
            return text + '错误：' + data.message
          }
          return text + '错误'
        },
      },
    })
  }
}

export const http = new Http()
