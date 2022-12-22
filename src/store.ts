import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface PreferencesStore {
  personalInfoConfirmed: boolean
  confirmPersonalInfo: () => void
  token?: string
}

export const usePreferences = create<PreferencesStore>()(
  immer(
    persist(
      (set) => ({
        personalInfoConfirmed: false,
        confirmPersonalInfo: () =>
          set((state) => void (state.personalInfoConfirmed = true)),
      }),
      {
        name: 'labor-preferences',
        version: 1,
      }
    )
  )
)
