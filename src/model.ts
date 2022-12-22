export type ItemState = 'pending' | 'approved' | 'rejected'

export interface Item {
  id: number
  state: ItemState
  rejected_reason?: string
  description: string
  duration_hour: number
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
  dormitory: string
  total_hours: number
}

export interface Admin {
  id: number
  name: string
  phone: string
}
