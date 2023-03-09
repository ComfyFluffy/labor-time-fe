import { useEffect } from 'react'
import { shallow } from 'zustand/shallow'
import MenuButton from '../../../components/MenuButton'
import { service } from '../../../services/service'
import { usePreferences } from '../../../utils/store'

export default function SchoolYearSwitch() {
  const { data } = service.teacher.useSchoolYears()

  const [selectedSchoolYear, setSelectedSchoolYear] = usePreferences(
    (state) => [state.selectedSchoolYear, state.setSelectedSchoolYear],
    shallow
  )

  useEffect(() => {
    if (!data) {
      return
    }
    if (
      selectedSchoolYear === null ||
      !data.school_years.includes(selectedSchoolYear)
    ) {
      setSelectedSchoolYear(data.current_school_year || null)
    }
  }, [data, selectedSchoolYear, setSelectedSchoolYear])

  return data ? (
    <MenuButton
      selectedItem={selectedSchoolYear}
      items={data.school_years}
      display={(item) => item}
      onChange={(item) => setSelectedSchoolYear(item)}
      itemId={(item) => item}
    />
  ) : null
}
