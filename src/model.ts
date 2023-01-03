export type ItemState = 'pending' | 'approved' | 'rejected'

export interface Item {
  id: number
  state: ItemState
  reject_reason?: string
  description: string
  duration_hour: string | number
  picture_urls: string[]
}

export interface CategoryExplanation {
  title: string
  text: string
}
export interface Category {
  id: number
  name: string
  editable: boolean
  max_total_hour?: number
  items: Item[]
  explanation?: CategoryExplanation
}

export interface Student {
  id: number
  student_id: string
  name: string
  class_name: string
  major: string
  total_hours: number
}

export interface Teacher {
  id: number
  name: string
  phone: string
  is_admin: boolean
}

export interface Class {
  id: number
  name: string
}
