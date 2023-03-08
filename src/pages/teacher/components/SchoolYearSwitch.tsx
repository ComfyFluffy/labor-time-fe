import { ArrowDropDown } from '@mui/icons-material'
import { Box, Button, Menu, MenuItem } from '@mui/joy'
import { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { service } from '../../../services/service'
import { usePreferences } from '../../../utils/store'

export default function SchoolYearSwitch() {
  const { data } = service.teacher.useSchoolYears()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [selectedSchoolYear, setSelectedSchoolYear] = usePreferences(
    (state) => [state.selectedSchoolYear, state.setSelectedSchoolYear],
    shallow
  )
  useEffect(() => {
    if (
      data &&
      (selectedSchoolYear === null ||
        !data.school_years.includes(selectedSchoolYear))
    ) {
      setSelectedSchoolYear(data.current_school_year || null)
    }
  }, [data, selectedSchoolYear, setSelectedSchoolYear])

  return data ? (
    <Box>
      <Button
        endDecorator={<ArrowDropDown />}
        variant="soft"
        onClick={(event) => {
          setAnchorEl(event.currentTarget)
        }}
      >
        {selectedSchoolYear + ' 学年'}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null)
        }}
      >
        {data.school_years.map((year) => (
          <MenuItem
            key={year}
            selected={year === selectedSchoolYear}
            variant={year === selectedSchoolYear ? 'soft' : undefined}
            onClick={() => {
              setSelectedSchoolYear(year)
              setAnchorEl(null)
            }}
          >
            {year}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  ) : null
}
