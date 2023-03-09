export type LaborItemState = 'pending' | 'approved' | 'rejected'

export const studentStates = [
  'allApproved',
  'hasPendingItem',
  'hasRejectedItem',
  'notSubmitted',
] as const
export type StudentState = typeof studentStates[number]

export const roleIdToRole = new Map([
  [1, '教师'],
  [2, '院级管理员'],
  [3, '校级管理员'],
])

export type UserType = 'student' | 'teacher'

export interface LaborItem {
  id: number
  state: LaborItemState
  reason?: string
  description: string
  duration_hour: number
  approved_hour: number
  evidence_urls: string[]
}

export interface Category {
  id: number
  name: string
  min_hour: number
  max_hour: number
  items: LaborItem[]
  explanation: {
    title: string
    text: string
  }
}

export interface Student {
  id: number
  uid: string
  name: string
  classname: string
  total_hour: number
  avatar: string
  state: StudentState
}

export interface Teacher {
  id: number
  name: string
  phone: string
  college_id: number
  college_name: string
  role_id: number
}

export interface Class {
  id: number
  name: string
}

export interface School {
  id: number
  name: string
}
