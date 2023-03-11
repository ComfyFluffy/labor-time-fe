import { Autocomplete, FormControl, FormHelperText } from '@mui/joy'
import { useEffect } from 'react'
import { shallow } from 'zustand/shallow'
import { service } from '../services/service'
import { usePreferences } from '../utils/store'

export default function SchoolSelector() {
  const [selectedSchool, setSelectedSchool] = usePreferences(
    (state) => [state.selectedSchool, state.setSelectedSchool],
    shallow
  )

  const { data, error } = service.superAdmin.useSchools()

  useEffect(() => {
    if (!data || !selectedSchool) {
      return
    }
    if (!data.find((school) => school.id === selectedSchool.id)) {
      setSelectedSchool(null)
    }
  }, [data, selectedSchool])

  return (
    <FormControl error={!!error}>
      <Autocomplete
        size="lg"
        options={data || []}
        color="primary"
        getOptionLabel={(school) => school.name}
        loading={!data}
        isOptionEqualToValue={(a, b) => a.id === b.id}
        value={selectedSchool}
        onChange={(e, value) => {
          setSelectedSchool(value)
        }}
        placeholder="学院"
      />
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  )
}
