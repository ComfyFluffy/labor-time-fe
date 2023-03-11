import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { School, UserType } from '../services/model'

export interface PreferencesStore {
  personalInfoConfirmed: boolean
  confirmPersonalInfo: () => void
  selectedSchoolYear: string | null
  setSelectedSchoolYear: (schoolYear: string | null) => void
  selectedSchool: School | null
  setSelectedSchool: (school: School | null) => void

  token?: string
  loggedUserType?: UserType
  login: (token: string, userType: UserType) => void
  logout: () => void
}

export const usePreferences = create<PreferencesStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        personalInfoConfirmed: false,
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
        selectedSchoolYear: null,
        setSelectedSchoolYear: (selectedSchoolYear) =>
          set({
            selectedSchoolYear,
          }),
        selectedSchool: null,
        setSelectedSchool: (selectedSchool) =>
          set({
            selectedSchool,
          }),
      }),
      {
        name: 'labor-preferences',
        version: 4,
      }
    )
  )
)
