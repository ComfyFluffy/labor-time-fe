import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { UserType } from './http'

export interface PreferencesStore {
  personalInfoConfirmed: boolean
  confirmPersonalInfo: () => void
  token?: string
  loggedUserType?: UserType
}

export const usePreferences = create<PreferencesStore>()(
  immer(
    persist(
      (set) => ({
        personalInfoConfirmed: false,
        confirmPersonalInfo: () =>
          set((state) => {
            state.personalInfoConfirmed = true
          }),
      }),
      {
        name: 'labor-preferences',
        version: 1,
      }
    )
  )
)
