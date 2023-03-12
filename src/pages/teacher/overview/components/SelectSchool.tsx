import { Alert, Stack } from '@mui/joy'
import DownloadButton from '../../../../components/DownloadButton'
import SchoolSelector from '../../../../components/SchoolSelector'
import { service } from '../../../../services/service'
import { usePreferences } from '../../../../utils/store'
import ClassesOverview from './ClassesOverview'

export interface SelectSchoolProps {
  schoolYear: string
}
export default function SelectSchool({ schoolYear }: SelectSchoolProps) {
  const selectedSchool = usePreferences((state) => state.selectedSchool)

  return (
    <Stack spacing={2} sx={{ mt: 1 }}>
      <SchoolSelector />

      {selectedSchool && (
        <>
          <Stack direction="row">
            <DownloadButton
              text="导出该学院表格"
              downloadFn={() =>
                service.superAdmin.downloadXlsx(schoolYear, selectedSchool)
              }
            />
          </Stack>
          <ClassesOverview
            schoolId={selectedSchool.id}
            schoolYear={schoolYear}
          />
        </>
      )}

      {!selectedSchool && (
        <Alert color="info">请选择一个学院以查看该学院的班级统计。</Alert>
      )}
    </Stack>
  )
}
