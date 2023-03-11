import { Alert, Stack } from '@mui/joy'
import SchoolSelector from '../../../../../components/SchoolSelector'
import { usePreferences } from '../../../../../utils/store'
import AdminTableEditor from './AdminTableEditor'

export default function AdminEditor() {
  const selectedSchool = usePreferences((state) => state.selectedSchool)

  return (
    <Stack spacing={2}>
      <SchoolSelector />

      {selectedSchool && <AdminTableEditor schoolId={selectedSchool.id} />}

      {!selectedSchool && (
        <Alert color="info">请选择一个学院以查看该学院的教师列表。</Alert>
      )}
    </Stack>
  )
}
