import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserType } from './service'

export interface PreferencesStore {
  personalInfoConfirmed: boolean
  confirmPersonalInfo: () => void
  classListOpen: boolean
  setClassListOpen: (open: boolean) => void
  selectedSchoolYear: string | null
  setSelectedSchoolYear: (schoolYear: string | null) => void

  token?: string
  loggedUserType?: UserType
  login: (token: string, userType: UserType) => void
  logout: () => void
}

export const usePreferences = create<PreferencesStore>()(
  persist(
    (set) => ({
      personalInfoConfirmed: false,
      classListOpen: true,
      confirmPersonalInfo: () =>
        set({
          personalInfoConfirmed: true,
        }),
      login: (token, userType) =>
        set({
          token,
          loggedUserType: userType,
        }),
      logout: () =>
        set({
          token: undefined,
          loggedUserType: undefined,
        }),
      setClassListOpen: (classListOpen) =>
        set({
          classListOpen,
        }),
      selectedSchoolYear: null,
      setSelectedSchoolYear: (selectedSchoolYear) =>
        set({
          selectedSchoolYear,
        }),
    }),
    {
      name: 'labor-preferences',
      version: 4,
    }
  )
)
