import { Add } from '@mui/icons-material'
import { Autocomplete, Box, IconButton } from '@mui/joy'
import { useMemo, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { Class } from '../../../../../services/model'
import { service } from '../../../../../services/service'
import { usePreferences } from '../../../../../utils/store'

export interface ClassesAutocompleteProps {
  onAdd: (value: Class) => void
  selectedClasses: Class[]
}

const ClassesAutocompleteWithData = ({
  onAdd,
  selectedClasses,
  schoolYear,
  schoolId,
}: ClassesAutocompleteProps & {
  schoolYear: string
  schoolId: number
}) => {
  const { data, isLoading } = service.teacher.useManagedClasses(
    schoolYear,
    schoolId
  )
  const [value, setValue] = useState<Class | null>(null)
  const filteredClasses = useMemo(() => {
    if (!data) {
      return []
    }
    const selectedClassesIds = new Set(selectedClasses.map((c) => c.id))
    return data.filter((c) => !selectedClassesIds.has(c.id)) || []
  }, [selectedClasses, data])

  return (
    <>
      <Box
        component="td"
        scope="row"
        sx={{
          pl: 1,
        }}
      >
        <Autocomplete
          loading={isLoading}
          options={filteredClasses}
          getOptionLabel={(option) => option.name}
          placeholder="添加班级"
          value={value}
          onChange={(e, value) => setValue(value)}
        />
      </Box>
      <td align="right">
        <IconButton
          size="sm"
          color="success"
          disabled={!value}
          onClick={() => {
            if (value) {
              onAdd(value)
              setValue(null)
            }
          }}
        >
          <Add />
        </IconButton>
      </td>
    </>
  )
}

export default function ClassesAutocomplete(props: ClassesAutocompleteProps) {
  const [selectedSchoolYear, selectedSchool] = usePreferences(
    (state) => [state.selectedSchoolYear, state.selectedSchool],
    shallow
  )

  return (
    (selectedSchoolYear && selectedSchool && (
      <ClassesAutocompleteWithData
        {...props}
        schoolYear={selectedSchoolYear}
        schoolId={selectedSchool.id}
      />
    )) ||
    null
  )
}
