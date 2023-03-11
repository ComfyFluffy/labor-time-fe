import {
  Alert,
  Autocomplete,
  FormControl,
  FormHelperText,
  Stack,
} from '@mui/joy'
import { useEffect } from 'react'
import { shallow } from 'zustand/shallow'
import { service } from '../../../../services/service'
import { usePreferences } from '../../../../utils/store'
import ClassesOverview from './ClassesOverview'

export interface SelectSchoolProps {
  schoolYear: string
}
export default function SelectSchool({ schoolYear }: SelectSchoolProps) {
  const { data: schools, error } = service.superAdmin.useSchools()

  const [selectedSchool, setSelectedSchool] = usePreferences(
    (state) => [state.selectedSchool, state.setSelectedSchool],
    shallow
  )

  useEffect(() => {
    if (!schools || !selectedSchool) {
      return
    }
    if (!schools.find((school) => school.id === selectedSchool.id)) {
      setSelectedSchool(null)
    }
  }, [schools, selectedSchool])

  return (
    <Stack spacing={2} sx={{ mt: 1 }}>
      <FormControl error={!!error}>
        <Autocomplete
          size="lg"
          options={schools || []}
          color="primary"
          getOptionLabel={(school) => school.name}
          loading={!schools}
          isOptionEqualToValue={(a, b) => a.id === b.id}
          value={selectedSchool}
          onChange={(e, value) => {
            setSelectedSchool(value)
          }}
          placeholder="学院"
        />
        {error && <FormHelperText>{error.message}</FormHelperText>}
      </FormControl>

      {schoolYear && selectedSchool && (
        <ClassesOverview schoolId={selectedSchool.id} schoolYear={schoolYear} />
      )}

      {!selectedSchool && (
        <Alert color="info">请选择一个学院以查看该学院的班级统计。</Alert>
      )}
    </Stack>
  )
}
