import { Tab, TabList, TabPanel, tabPanelClasses, Tabs } from '@mui/joy'
import { service } from '../../../services/service'
import { usePreferences } from '../../../utils/store'
import ClassesOverview from './components/ClassesOverview'
import SchoolsOverview from './components/SchoolsOverview'
import SelectSchool from './components/SelectSchool'

import './chartRegister'

export default function Overview() {
  const selectedSchoolYear = usePreferences((state) => state.selectedSchoolYear)

  const { data: selfInfo } = service.teacher.useSelfInfo()

  const isSuperAdmin = selfInfo?.role_id === 3

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
        {isSuperAdmin && <Tab>全校统计</Tab>}
      </TabList>
      <TabPanel value={0}>
        {isSuperAdmin && selectedSchoolYear && (
          <SelectSchool schoolYear={selectedSchoolYear} />
        )}
        {!isSuperAdmin && selfInfo && selectedSchoolYear && (
          <ClassesOverview
            schoolId={selfInfo.college_id}
            schoolYear={selectedSchoolYear}
          />
        )}
      </TabPanel>
      {isSuperAdmin && (
        <TabPanel value={1}>
          {selectedSchoolYear && (
            <SchoolsOverview schoolYear={selectedSchoolYear} />
          )}
        </TabPanel>
      )}
    </Tabs>
  )
}
