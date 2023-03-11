import { Alert, Stack } from '@mui/joy'
import { usePreferences } from '../../../../utils/store'
import ClassesOverview from './ClassesOverview'

export interface SelectSchoolProps {
  schoolYear: string
}
export default function SelectSchool({ schoolYear }: SelectSchoolProps) {
  const selectedSchool = usePreferences((state) => state.selectedSchool)

  return (
    <Stack spacing={2} sx={{ mt: 1 }}>
      {schoolYear && selectedSchool && (
        <ClassesOverview schoolId={selectedSchool.id} schoolYear={schoolYear} />
      )}

      {!selectedSchool && (
        <Alert color="info">请选择一个学院以查看该学院的班级统计。</Alert>
      )}
    </Stack>
  )
}
