import axios, { AxiosInstance } from 'axios'
import { usePreferences } from '../utils/store'
import { StudentService } from './student'
import { TeacherService } from './teacher'
import { BaseService } from './base'
import { SchoolAdminService, SuperAdminService } from './admin'
import { UserType } from './model'

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

export class Service extends BaseService {
  student: StudentService
  teacher: TeacherService
  schoolAdmin: SchoolAdminService
  superAdmin: SuperAdminService

  constructor(axios: AxiosInstance) {
    super(axios)
    this.student = new StudentService(axios)
    this.teacher = new TeacherService(axios)
    this.schoolAdmin = new SchoolAdminService(axios)
    this.superAdmin = new SuperAdminService(axios)
  }

  useAxiosInterceptor = () => {
    this.axios.interceptors.request.use((config) => {
      if (config.url?.endsWith('/login')) {
        return config
      }

      const token = usePreferences.getState().token
      if (token) {
        config.headers.Authorization = `labor ${token}`
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

  login = async (request: AuthRequest, userType: UserType) => {
    const {
      data: { token },
    } = await this.axios.post<AuthResponse>(
      `/v2/user/${userType}/login`,
      request
    )
    usePreferences.getState().login(token, userType)
  }

  logout = () => {
    usePreferences.getState().logout()
  }

  updatePassword = async (
    request: UpdatePasswordRequest,
    userType: UserType
  ) => {
    await this.axios.post(`/v2/user/${userType}/password`, request)
  }
}

const axiosInstance = axios.create({
  baseURL: '/api',
})

export const service = new Service(axiosInstance)
service.useAxiosInterceptor()
