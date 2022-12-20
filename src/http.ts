import { Category, Student } from './model'

// Both in Admin and User

export interface AuthRequest {
  account: string
  password: string
}

export interface AuthResponse {
  access_token: string
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

export interface GetManagedClassesResponse {
  id: number
  name: string
}

export type GetStudentsInClassResponse = Student[]

export type UpdateCategoryRequest = Omit<Category, 'items'>

export type RejectStudentItemRequest = {
  item_id: number
  reason?: string
}
