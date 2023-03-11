import {
  Alert,
  Autocomplete,
  FormControl,
  FormHelperText,
  Stack,
  Tab,
  TabList,
  TabPanel,
  tabPanelClasses,
  Tabs,
} from '@mui/joy'
import { service } from '../../../services/service'
import { useEffect } from 'react'
import ClassesOverview from './components/ClassesOverview'
import { usePreferences } from '../../../utils/store'
import SchoolsOverview from './components/SchoolsOverview'

export default function Overview() {
  const selectedSchoolYear = usePreferences((state) => state.selectedSchoolYear)
  const { data: schools, error } = service.superAdmin.useSchools()
  const [selectedSchool, setSelectedSchool] = usePreferences((state) => [
    state.selectedSchool,
    state.setSelectedSchool,
  ])

  useEffect(() => {
    if (!schools || !selectedSchool) {
      return
    }
    if (!schools.find((school) => school.id === selectedSchool.id)) {
      setSelectedSchool(null)
    }
  }, [schools, selectedSchool])

  return (
    <Tabs
      defaultValue={0}
      sx={{
        [`& .${tabPanelClasses.root}`]: {
          p: 2,
        },
      }}
    >
      <TabList>
        <Tab>学院统计</Tab>
        <Tab>全校统计</Tab>
      </TabList>
      <TabPanel value={0}>
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

          {selectedSchoolYear && selectedSchool && (
            <ClassesOverview
              schoolId={selectedSchool.id}
              schoolYear={selectedSchoolYear}
            />
          )}

          {!selectedSchool && (
            <Alert color="info">请选择一个学院以查看该学院的班级统计。</Alert>
          )}
        </Stack>
      </TabPanel>
      <TabPanel value={1}>
        {selectedSchoolYear && (
          <SchoolsOverview schoolYear={selectedSchoolYear} />
        )}
      </TabPanel>
    </Tabs>
  )
}
