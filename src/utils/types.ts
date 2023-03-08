import { Category, LaborItem } from '../services/model'

// https://stackoverflow.com/questions/43159887/make-a-single-property-optional-in-typescript
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type NewLaborItem = Pick<LaborItem, 'description' | 'evidence_urls'> & {
  local_id: number
  category_id: number
  duration_hour?: number
}
export type CategoryWithNewItem = Omit<Category, 'items'> & {
  items: (NewLaborItem | LaborItem)[]
}
export type UpdateLaborItem = Pick<
  LaborItem,
  'id' | 'description' | 'duration_hour' | 'evidence_urls'
>
